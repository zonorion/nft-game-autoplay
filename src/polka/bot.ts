import { Injectable, OnModuleInit } from '@nestjs/common'
import chalk from 'chalk'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import moment, { Moment } from 'moment'
import { Cron, CronExpression } from '@nestjs/schedule'
import { CONTRACT_ABI } from './monster.abi'
import { NFT_ABI } from './nft.abi'
import { BATTLE_ABI } from './battle.abi'
import { MANAGER_ABI } from './manager.abi'
import { DECODELOG_ABI } from './decode-log.abi'

const { log } = console

class Pet {
  id: number
  dna: string
  expireTime: Moment
}

class Battle {
  id: number
  battleTime: Moment
  timeBattles: number
  expireTime: Moment
}

const configs = {
  monsterLevels: [2],
  gasLimit: 3e5,
}

@Injectable()
export class Bot implements OnModuleInit {
  private web3 = new Web3(process.env.RPC_NODE)
  // private web3 = new Web3(process.env.WSS_NODE)
  private account = this.web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY)
  private monsterContract = new this.web3.eth.Contract(CONTRACT_ABI as AbiItem[], process.env.PKMON_TOKEN_CONTRACT)
  private nftContract = new this.web3.eth.Contract(NFT_ABI as AbiItem[], process.env.PKMON_NFT_CONTRACT)
  private battleContract = new this.web3.eth.Contract(BATTLE_ABI as AbiItem[], process.env.PKMON_BATTLE_CONTRACT)
  private managerContract = new this.web3.eth.Contract(MANAGER_ABI as AbiItem[], process.env.PKMON_MANAGER_CONTRACT)
  private isAutoRunning = false
  private isNeedRefreshQueue = false
  private allPets: Pet[] = []
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

  private queueBattles: Map<number, Battle> = new Map<number, Battle>()

  async onModuleInit(): Promise<any> {
    log(chalk.bgRedBright(chalk.yellow('===Auto battle polka monster start===')))
    // this.allPets = await this.fetchAllPets()
    this.queueBattles = await this.initQueue()

    // await this.checkBattlefields()
    await this.handleBattle()
    await this.currentReward()
  }

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // async checkBattlefields() {
  //     try {
  //         this.canBattle = await this.managerContract.methods.battlefields(this.account.address).call()
  //     } catch (e) {
  //         console.log(e)
  //     }
  // }

  @Cron('*/5 * * * *')
  async handleBattle() {
    try {
      if (this.allPets.length > 0) {
        if (!this.isAutoRunning) {
          this.isAutoRunning = true
          if (this.canBattle) {
            for (const [key, pet] of this.queueBattles.entries()) {
              if (moment() > pet.expireTime) {
                console.log(chalk.red(`Your stone has been expired`))
                continue
              }
              if (moment() >= pet.battleTime) {
                this.isNeedRefreshQueue = true
                try {
                  for (let i = 0; i < pet.timeBattles; i++) {
                    console.log(
                      chalk.yellow(`>>>>>>>>>>>>>>>>> Pet ${key} starting battle. Turn ${i + 1} <<<<<<<<<<<<<<<<`),
                    )
                    const target = configs.monsterLevels[0]
                    const [data, nonce] = await Promise.all([
                      this.battleContract.methods.battle(pet.id, target).encodeABI(),
                      this.web3.eth.getTransactionCount(this.account.address),
                    ])
                    const trans = {
                      nonce,
                      gasLimit: configs.gasLimit,
                      from: this.account.address,
                      to: process.env.PKMON_BATTLE_CONTRACT,
                      value: 0,
                      data,
                    }
                    const signedTrans = await this.account.signTransaction(trans)
                    const receipt = await this.web3.eth.sendSignedTransaction(signedTrans.rawTransaction)
                    const result: any = this.web3.eth.abi.decodeLog(DECODELOG_ABI, receipt.logs[0].data, [
                      receipt.logs[0].topics[0],
                    ])

                    if (result.result * 1) {
                      console.log(chalk.green(`You won the battle, get ${result.reward} pkk reward`))
                    } else {
                      console.log(chalk.red(`You fucking lost the battle`))
                    }
                    console.log(
                      chalk.green(`===============================================================================\n`),
                    )

                    await this.sleep(20000)
                  }
                } catch (e) {
                  console.log(e)
                  this.queueBattles = await this.initQueue()
                  await this.sleep(10000)
                }
              }
            }
          } else {
            console.log(chalk.red(`You can not battle, server is under maintenance`))
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
      this.isAutoRunning = false
      this.queueBattles = await this.initQueue()
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async currentReward() {
    try {
      const currentReward = await this.battleContract.methods.getCurrentRewards(this.account.address).call()
      console.log(chalk.green(`Current reward available = ${currentReward * 1e-18} Pkmon\n`))

      const currentRewardV2 = await this.battleContract.methods.getCurrentRewardsV2(this.account.address).call()
      console.log(chalk.green(`Current reward v2 available = ${currentRewardV2} Pkk\n`))
    } catch (e) {
      console.log(e)
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkBattleTime() {
    try {
      for (const [key, pet] of this.queueBattles.entries()) {
        console.log(chalk.green(`Pet ${pet.id} already battle not yet`))
        const duration = moment.duration(pet.battleTime.diff(moment()))
        console.log(chalk.green(`Time remaining to battle ${duration.hours()}h:${duration.minutes()}m\n`))
      }
    } catch (e) {
      console.log(e)
    }
  }

  async reInitWeb3() {
    // this.web3 = new Web3(process.env.WSS_NODE)
    this.web3 = new Web3(process.env.RPC_NODE)
    this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY)
    this.monsterContract = new this.web3.eth.Contract(CONTRACT_ABI as AbiItem[], process.env.PKMON_TOKEN_CONTRACT)
    this.nftContract = new this.web3.eth.Contract(NFT_ABI as AbiItem[], process.env.PKMON_NFT_CONTRACT)
    this.battleContract = new this.web3.eth.Contract(BATTLE_ABI as AbiItem[], process.env.PKMON_BATTLE_CONTRACT)
    this.managerContract = new this.web3.eth.Contract(MANAGER_ABI as AbiItem[], process.env.PKMON_MANAGER_CONTRACT)
  }

  async initQueue(): Promise<Map<number, Battle>> {
    const map = new Map()
    try {
      this.allPets = await this.fetchAllPets()

      for (const pet of this.allPets) {
        const battleTime = await this.battleContract.methods.battleTimes(pet.id).call()
        const timeBattle = await this.managerContract.methods.timesBattle(this.convertDNA(pet.dna)).call()
        const timeLimitBattle = await this.managerContract.methods.timeLimitBattle().call()
        const battleSessionsTime = await this.battleContract.methods
          .battleSessionsTime(pet.id, battleTime * 1 - timeBattle * 1)
          .call()
        const limitBattleTime = timeLimitBattle * 1 + battleSessionsTime * 1
        const o = limitBattleTime - Math.floor(Date.now() / 1e3)
        const exactTimeBattle = Date.now() + 1e3 * o
        const battle = {
          id: pet.id,
          timeBattles: timeBattle * 1,
          battleTime: moment(exactTimeBattle),
          expireTime: pet.expireTime,
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
        if (+moner[16] === 0 || moment() > moment(moner[16] * 1e3)) {
          continue
        }
        pets.push({
          id: petId,
          dna: moner[4],
          expireTime: moment(moner[16] * 1e3),
        })
      }
    } catch (e) {
      console.log(e)
      throw e
    }
    return pets
  }

  convertDNA(e) {
    const t = Math.floor(+e.toString() / 10 ** 26)
    return t < 5225 ? 1 : t < 7837 ? 2 : t < 8707 ? 3 : t < 9360 ? 4 : t < 9708 ? 5 : 6
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  random(mn, mx) {
    return Math.random() * (mx - mn) + mn
  }
}
