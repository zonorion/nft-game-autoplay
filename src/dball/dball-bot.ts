import { Injectable, OnModuleInit } from '@nestjs/common'
import chalk from 'chalk'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NFT_ABI } from './nft.abi'
import { DECODELOG_ABI } from './decode-log.abi'
import { TOKEN_ABI } from './token.abi'
import { GAME_ABI } from './game.abi'

const { log } = console

class Character {
    id: number
    classId: number
    exp: number
    level: number
    rare: number
    hatched: boolean
    stamina: number
    price: number
}

const configs = {
    monsterLevel: 2,
    gasLimit: 4e5,
    stamina: 9,
}

const TARGETS = [
    {
        targetId: 1,
        winRate: 90,
    },
    {
        targetId: 2,
        winRate: 70,
    },
    {
        targetId: 3,
        winRate: 50,
    },
]

@Injectable()
export class DballBot implements OnModuleInit {
    private web3 = new Web3(process.env.RPC_NODE)
    // private web3 = new Web3(process.env.WSS_NODE)
    private account = this.web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY)
    private nftContract = new this.web3.eth.Contract(NFT_ABI as AbiItem[], process.env.DBALL_NFT_CONTRACT)
    private tokenContract = new this.web3.eth.Contract(TOKEN_ABI as AbiItem[], process.env.DBALL_TOKEN_CONTRACT)
    private gameContract = new this.web3.eth.Contract(GAME_ABI as AbiItem[], process.env.DBALL_GAME_CONTRACT)
    private allChars: Character[] = []
    private isNeedRefresh = false
    private canBattle = true

    // private readonly provider = new ethers.providers.WebSocketProvider(process.env.WSS_NODE)
    // private readonly wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY)
    // private readonly accountEthers = this.wallet.connect(this.provider)
    //
    // private readonly pkmonBattle = new ethers.Contract(
    //     process.env.BATTLE_CONTRACT,
    //     BATTLE_ABI,
    //     this.accountEthers,
    // )

    async onModuleInit(): Promise<any> {
        log(chalk.bgRedBright(chalk.yellow('===Auto battle DrakeBall start===')))
        this.allChars = await this.fetchAllChars()

        await this.handleBattle()
        await this.currentReward()
    }

    @Cron('*/30 * * * *')
    async handleBattle() {
        try {
            if (this.canBattle) {
                for (const char of this.allChars) {
                    if (char.stamina >= configs.stamina) {
                        this.isNeedRefresh = true
                        const combatTimes = Math.floor(char.stamina / 3)
                        for (let i = 0; i < combatTimes; i++) {
                            const target = TARGETS[Math.floor(this.random(1, 3)) - 1]
                            await this.combat(char.id, target)
                            await this.sleep(5000)
                        }
                    } else {
                        console.log(`Current stamina of ${char.id}: ${char.stamina}`)
                    }
                }
            }
            if (this.isNeedRefresh) {
                this.allChars = await this.fetchAllChars()
            }
        } catch (e) {
            console.log('=====ERROR=====', e.message)
            await this.fetchAllChars()
        }
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async currentReward() {
        try {
            const balance = await this.tokenContract.methods.balanceOf(this.account.address).call()
            console.log(chalk.green(`Current balance available = ${balance * 1e-18} Dball\n`))
        } catch (e) {
            console.log(e)
        }
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async checkBattleTime() {
        try {
            this.allChars = await this.fetchAllChars()
        } catch (e) {
            console.log(e)
        }
    }

    async fetchAllChars(): Promise<Character[]> {
        const chars = []
        try {
            const balance = await this.nftContract.methods.balanceOf(this.account.address).call()
            for (let i = 0; i < balance; i++) {
                const ballId = await this.nftContract.methods.tokenOfOwnerByIndex(this.account.address, i).call()
                const info = await this.nftContract.methods.getInfo(ballId).call()
                const char = {
                    id: parseInt(ballId, 10),
                    classId: parseInt(info[3], 10),
                    exp: parseInt(info[1], 10),
                    rare: parseInt(info[0], 10),
                    level: parseInt(info[2], 10),
                    hatched: info[4],
                    stamina: parseInt(info[5], 10),
                    price: parseInt(info[6], 10),
                } as Character

                chars.push(char)
            }
        } catch (e) {
            console.log(e)
            throw e
        }
        return chars
    }

    async combat(id, rate) {
        try {
            console.log(chalk.green(`Char ${id} starting battle with win rate ${rate.winRate}%`))
            const [data, nonce] = await Promise.all([
                this.gameContract.methods.combat(id, [], rate.targetId).encodeABI(),
                this.web3.eth.getTransactionCount(this.account.address),
            ])
            const trans = {
                nonce,
                gasLimit: configs.gasLimit,
                from: this.account.address,
                to: process.env.DBALL_GAME_CONTRACT,
                value: 0,
                data,
            }
            const signedTrans = await this.account.signTransaction(trans)
            const receipt = await this.web3.eth.sendSignedTransaction(signedTrans.rawTransaction)

            const logTrx = receipt.logs.filter((l) => l.topics[0] === '0x04dc576b5ca3464d598c94e3943e0110bfb3a1d6bc7633bfa280527170aba121')

            const result: any = this.web3.eth.abi.decodeLog(
                DECODELOG_ABI,
                logTrx[0].data,
                [logTrx[0].topics[0]],
            )

            if (result.isWin) {
                console.log(chalk.green(`You won the battle, get ${result.ballGain * 1e-18} dball reward`))
            } else {
                console.log(chalk.red(`You fucking lost the battle`))
            }
            console.log(chalk.green(`===============================================================================\n`))
        } catch (e) {
            console.log('Combat fail: ', e)
            throw e
        }
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    random(mn, mx) {
        return Math.random() * (mx - mn) + mn
    }
}
