import { Injectable, OnModuleInit } from '@nestjs/common'
import chalk from 'chalk'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NFT_ABI } from './nft.abi'
import { DECODELOG_ABI } from './decode-log.abi'
import { TOKEN_ABI } from './token.abi'
import { MANAGER_ABI } from './manager.abi'

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
    gasLimit: 3e5,
    stamina: 9,
}

const TARGETS = [
    {
        targetId: 2,
        winRate: 70,
    },
    {
        targetId: 3,
        winRate: 50,
    },
    {
        targetId: 4,
        winRate: 30,
    },
]

@Injectable()
export class DrsBot implements OnModuleInit {
    private web3 = new Web3(process.env.RPC_NODE)
    // private web3 = new Web3(process.env.WSS_NODE)
    private account = this.web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY)
    private nftContract = new this.web3.eth.Contract(NFT_ABI as AbiItem[], process.env.DSR_NFT_CONTRACT)
    private tokenContract = new this.web3.eth.Contract(TOKEN_ABI as AbiItem[], process.env.DRS_TOKEN_CONTRACT)
    private managerContract = new this.web3.eth.Contract(MANAGER_ABI as AbiItem[], process.env.DRS_MANAGER_CONTRACT)
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
        log(chalk.bgRedBright(chalk.yellow('===Auto battle dragon slayer start===')))
        // this.allChars = await this.fetchAllChars()

        // await this.handleBattle()
        // await this.currentReward()
        // const reward = {
        //     value: 1689000000000,
        //     nonce: 'YFNH_K3-aAnY8mUEgqSHb',
        //     hash: '0xff96bb2107ca87bd3b732443cd8036516d808ca481b8b48ca8b536ed783aedb8',
        // eslint-disable-next-line max-len
        //     signature: '0x24e8435b0721bd3b45aa0c3271e6bcbf04817bc14aa69d0d32d4099dc0c4306002fa379b78d50b24b8cf94127262e597230a777e087a942a79690c77e58916131c',
        // }
        // const [data, nonce] = await Promise.all([
        //     this.managerContract.methods.addRewards(
        //         this.account.address,
        //         reward.value,
        //         reward.nonce,
        //         reward.hash,
        //         reward.signature,
        //     ).encodeABI(),
        //     this.web3.eth.getTransactionCount(this.account.address),
        // ])
        // const trans = {
        //     nonce,
        //     gasLimit: configs.gasLimit,
        //     from: this.account.address,
        //     to: process.env.DRS_MANAGER_CONTRACT,
        //     value: 0,
        //     data,
        // }
        // const signedTrans = await this.account.signTransaction(trans)
        // const receipt = await this.web3.eth.sendSignedTransaction(signedTrans.rawTransaction)
        // console.log(receipt)

        // const rewards = await this.managerContract.methods.getRewards().call()
        // console.log(rewards)
    }

    // @Cron('*/30 * * * *')
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
                        console.log(`Current p2e stamina of ${char.id}: ${char.stamina}`)
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

    // @Cron(CronExpression.EVERY_30_MINUTES)
    async currentReward() {
        try {
            const balance = await this.tokenContract.methods.balanceOf(this.account.address).call()
            console.log(chalk.green(`Current balance available = ${balance * 1e-18} P2e\n`))
        } catch (e) {
            console.log(e)
        }
    }

    // @Cron(CronExpression.EVERY_30_MINUTES)
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
                const planId = await this.nftContract.methods.tokenOfOwnerByIndex(this.account.address, i).call()
                const info = await this.nftContract.methods.getInfo(planId).call()
                const char = {
                    id: parseInt(planId, 10),
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
                this.managerContract.methods.combat(id, rate.targetId).encodeABI(),
                this.web3.eth.getTransactionCount(this.account.address),
            ])
            const trans = {
                nonce,
                gasLimit: configs.gasLimit,
                from: this.account.address,
                to: process.env.DRS_MANAGER_CONTRACT,
                value: 0,
                data,
            }
            const signedTrans = await this.account.signTransaction(trans)
            const receipt = await this.web3.eth.sendSignedTransaction(signedTrans.rawTransaction)

            const logTrx = receipt.logs.filter((l) => l.topics[0] === '0xd8dd88c99320afdc7ea6baaa655f908349f9143cb3b4768f992ab9f17fb3628b')

            const result: any = this.web3.eth.abi.decodeLog(
                DECODELOG_ABI,
                logTrx[0].data,
                [logTrx[0].topics[0]],
            )

            if (result.isWin) {
                console.log(chalk.green(`You won the battle, get ${result.ballGain * 1e-18} p2e reward`))
            } else {
                console.log(chalk.red(`You fucking lost the battle`))
            }
            console.log(chalk.green(`===============================================================================\n`))
        } catch (e) {
            console.log('Combat p2e fail: ', e)
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
