import { Injectable, OnModuleInit } from '@nestjs/common'
import chalk from 'chalk'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import moment, { Moment } from 'moment'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ethers } from 'ethers'
import { CONTRACT_ABI } from './monster.abi'
import { NFT_ABI } from './nft.abi'
import { BATTLE_ABI } from './battle.abi'
import { MANAGER_ABI } from './manager.abi'

const { log } = console

class Pet {
    id: number
    dna: string
}

class Battle {
    id: number
    battleTime: Moment
    timeBattles: number
}

const configs = {
    monsterLevel: 2,
    gasLimit: 3e5,
}

@Injectable()
export class Bot implements OnModuleInit {
    private web3 = new Web3(process.env.RPC_NODE)
    // private web3 = new Web3(process.env.WSS_NODE)
    private account = this.web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY)
    private monsterContract = new this.web3.eth.Contract(CONTRACT_ABI as AbiItem[], process.env.TOKEN_CONTRACT)
    private nftContract = new this.web3.eth.Contract(NFT_ABI as AbiItem[], process.env.NFT_CONTRACT)
    private battleContract = new this.web3.eth.Contract(BATTLE_ABI as AbiItem[], process.env.BATTLE_CONTRACT)
    private managerContract = new this.web3.eth.Contract(MANAGER_ABI as AbiItem[], process.env.MANAGER_CONTRACT)
    private isAutoRunning = false
    private isNeedRefreshQueue = false
    private allPets: Pet[] = []

    // private readonly provider = new ethers.providers.WebSocketProvider(process.env.WSS_NODE)
    // private readonly wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY)
    // private readonly accountEthers = this.wallet.connect(this.provider)
    //
    // private readonly pkmonBattle = new ethers.Contract(
    //     process.env.BATTLE_CONTRACT,
    //     BATTLE_ABI,
    //     this.accountEthers,
    // )

    private queueBattles: Map<number, Battle> = new Map<number, Battle>()

    async onModuleInit(): Promise<any> {
        log(chalk.bgRedBright(chalk.yellow('===Auto battle polka monster start===')))
        this.allPets = await this.fetchAllPets()
        this.queueBattles = await this.initQueue()

        await this.handleBattle()
        await this.currentReward()
    }

    @Cron('*/1 * * * *')
    async handleBattle() {
        try {
            if (this.allPets.length > 0) {
                if (!this.isAutoRunning) {
                    this.isAutoRunning = true
                    for (const [key, pet] of this.queueBattles.entries()) {
                        if (moment() >= pet.battleTime) {
                            this.isNeedRefreshQueue = true
                            for (let i = 0; i < pet.timeBattles; i++) {
                                console.log(chalk.yellow(`>>>>>>>>>>>>>>>>> Pet ${key} starting battle. Turn ${i + 1} <<<<<<<<<<<<<<<<`))
                                const [data, nonce] = await Promise.all([
                                    this.battleContract.methods.battle(pet.id, configs.monsterLevel).encodeABI(),
                                    this.web3.eth.getTransactionCount(this.account.address),
                                ])
                                const trans = {
                                    nonce,
                                    gasLimit: configs.gasLimit,
                                    from: this.account.address,
                                    to: process.env.BATTLE_CONTRACT,
                                    value: 0,
                                    data,
                                }
                                const signedTrans = await this.account.signTransaction(trans)
                                const receipt = await this.web3.eth.sendSignedTransaction(signedTrans.rawTransaction)

                                console.log(chalk.yellow(`Transaction receipt : https://www.bscscan.com/tx/${receipt.transactionHash}`))
                                console.log(chalk.green(`===============================================================================\n`))

                                await this.sleep(10000)
                            }
                        }
                    }
                    if (this.isNeedRefreshQueue) {
                        this.queueBattles = await this.initQueue()
                        this.isNeedRefreshQueue = false
                    }
                    this.isAutoRunning = false
                }
            } else {
                console.log(chalk.red(`======Can not find any pet======`))
            }
        } catch (e) {
            console.log('=====ERROR=====', e.message)
            if (e.message.includes('')) {
                await this.reInitWeb3()
                await this.handleBattle()
            }
        }
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async currentReward() {
        try {
            const currentReward = await this.battleContract.methods.getCurrentRewards(this.account.address).call()
            console.log(chalk.green(`Current reward available = ${currentReward * 1e-18} \n`))
        } catch (e) {
            console.log(e)
        }
    }

    async reInitWeb3() {
        // this.web3 = new Web3(process.env.WSS_NODE)
        this.web3 = new Web3(process.env.RPC_NODE)
        this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY)
        this.monsterContract = new this.web3.eth.Contract(CONTRACT_ABI as AbiItem[], process.env.TOKEN_CONTRACT)
        this.nftContract = new this.web3.eth.Contract(NFT_ABI as AbiItem[], process.env.NFT_CONTRACT)
        this.battleContract = new this.web3.eth.Contract(BATTLE_ABI as AbiItem[], process.env.BATTLE_CONTRACT)
        this.managerContract = new this.web3.eth.Contract(MANAGER_ABI as AbiItem[], process.env.MANAGER_CONTRACT)
    }

    async initQueue(): Promise<Map<number, Battle>> {
        const map = new Map()
        try {
            for (const pet of this.allPets) {
                const battleTime = await this.battleContract.methods.battleTimes(pet.id).call()
                const timeBattle = await this.managerContract.methods.timesBattle(this.convertDNA(pet.dna)).call()
                const timeLimitBattle = await this.managerContract.methods.timeLimitBattle().call()
                const battleSessionsTime = await this.battleContract.methods.battleSessionsTime(pet.id, battleTime * 1 - timeBattle * 1).call()
                const limitBattleTime = timeLimitBattle * 1 + battleSessionsTime * 1
                const o = limitBattleTime - (Math.floor(Date.now() / 1e3))
                const exactTimeBattle = Date.now() + 1e3 * o
                const battle = {
                    id: pet.id,
                    timeBattles: timeBattle * 1,
                    battleTime: moment(exactTimeBattle),
                } as Battle

                console.log(chalk.green(`Pet ${battle.id} already battle not yet`))
                const duration = moment.duration(battle.battleTime.diff(moment()))
                console.log(chalk.green(`Time remaining to battle ${duration.hours()}h:${duration.minutes()}m\n`))

                map.set(pet.id, battle)
            }
        } catch (e) {
            console.log(e)
            throw e
        }
        return map
    }

    async fetchAllPets(): Promise<Pet[]> {
        const pets = []
        try {
            const balance = await this.nftContract.methods.balanceOf(this.account.address).call()
            for (let i = 0; i < balance; i++) {
                const petId = await this.nftContract.methods.tokenOfOwnerByIndex(this.account.address, i).call()
                const moner = await this.nftContract.methods.getMoner(petId).call()
                pets.push({
                    id: petId,
                    dna: moner[4],
                })
            }
        } catch (e) {
            console.log(e)
            throw e
        }
        return pets
    }

    convertDNA(e) {
        const t = Math.floor(+e.toString() / (10 ** 26))
        return t < 5225 ? 1 : t < 7837 ? 2 : t < 8707 ? 3 : t < 9360 ? 4 : t < 9708 ? 5 : 6
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}
