import { HttpService, Injectable, OnModuleInit } from '@nestjs/common'
import chalk from 'chalk'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Cron, CronExpression } from '@nestjs/schedule'
import { NFT_ABI } from './nft.abi'
import { TOKEN_ABI } from './token.abi'
import { MANAGER_ABI } from './manager.abi'
import moment from 'moment'
import { time } from 'cron'

const { log } = console

const URL = 'https://play.dragonslayer.games/api/signature/fight'
const URL_TIME = 'https://play.dragonslayer.games/api/stats?warriors[]=3281&warriors[]=3290&warriors[]=28126&warriors[]=28141&warriors[]=41351'

const configs = {
  warriors: [
    {
      id: 3281,
      monster: 'blackz',
      level: 5,
    },
    {
      id: 3290,
      monster: 'blackz',
      level: 5,
    },
    {
      id: 28126,
      monster: 'thornado',
      level: 3,
    },
    {
      id: 28141,
      monster: 'thornado',
      level: 3,
    },
    {
      id: 41351,
      monster: 'topaz',
      level: 4,
    }
  ],
  gasLimit: 3e5,
}

@Injectable()
export class DrsBot implements OnModuleInit {
  private web3 = new Web3(process.env.RPC_NODE)
  // private web3 = new Web3(process.env.WSS_NODE)
  private account = this.web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY)
  private nftContract = new this.web3.eth.Contract(NFT_ABI as AbiItem[], process.env.DRS_NFT_CONTRACT)
  private tokenContract = new this.web3.eth.Contract(TOKEN_ABI as AbiItem[], process.env.DRS_TOKEN_CONTRACT)
  private managerContract = new this.web3.eth.Contract(MANAGER_ABI as AbiItem[], process.env.DRS_MANAGER_CONTRACT)
  private isNeedRefresh = false
  private canBattle = true
  private mapTimeBattle: Map<number, number> = new Map()

  constructor(private httpService: HttpService) {}

  // private readonly provider = new ethers.providers.WebSocketProvider(process.env.WSS_NODE)
  // private readonly wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY)
  // private readonly accountEthers = this.wallet.connect(this.provider)
  //
  // private readonly pkmonBattle = new ethers.Contract(
  //     process.env.BATTLE_CONTRACT,
  //     BATTLE_ABI,
  //     this.accountEthers,
  // )

  // {"success":false,"message":"You need to wait at least 1 hour to battle again"}

  async onModuleInit(): Promise<any> {
    log(chalk.bgRedBright(chalk.yellow('===Auto battle dragon slayer start===')))
    // this.allChars = await this.fetchAllChars()

    // await this.getTimeBattle()
    await this.handleBattle()
    await this.currentReward()
  }

  async getTimeBattle() {
    try {
      const response = await this.httpService.get(URL_TIME).toPromise()
      if (response && response.data) {
        for (const [key, value] of Object.entries(response.data.stats)) {
          this.mapTimeBattle.set(+key, Math.round(Date.now() / 1000) + +value)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  @Cron('*/5 * * * *')
  async handleBattle() {
    try {
      await this.getTimeBattle()
      for (const warrior of configs.warriors) {
        const timeBattle = this.mapTimeBattle.get(warrior.id)
        const now = Math.round(Date.now() / 1000)
        if (now >= timeBattle) {
          const response = await this.httpService
            .post(
              URL,
              {
                address: this.account.address,
                monsterId: warrior.monster,
                warriorId: warrior.id,
                warriorLevel: warrior.level,
              },
              { headers: { Cookie: process.env.DRS_COOKIES } },
            )
            .toPromise()
          console.log(response.data)
          if (response && response.status === 200) {
            const { data } = response
            // console.log(data)
            if (data.success && data.result === 'WIN') {
              try {
                const [trxData, nonce] = await Promise.all([
                  this.managerContract.methods
                    .addRewards(
                      this.account.address,
                      data.rewards,
                      data.signature.nonce,
                      data.signature.hash,
                      data.signature.signature,
                    )
                    .encodeABI(),
                  this.web3.eth.getTransactionCount(this.account.address),
                ])
                const trans = {
                  nonce,
                  gasLimit: configs.gasLimit,
                  from: this.account.address,
                  to: process.env.DRS_MANAGER_CONTRACT,
                  value: 0,
                  data: trxData,
                }
                const signedTrans = await this.account.signTransaction(trans)
                const receipt = await this.web3.eth.sendSignedTransaction(signedTrans.rawTransaction)
                console.log(chalk.green(`Kill dragon successfully - ${receipt.transactionHash}\n`))
              } catch (err) {
                console.log(err)
              }
            } else {
              console.log(chalk.red(`Dragon slayer: Waiting for new turn`))
            }
          }
        } else {
          const duration = moment.duration(moment(timeBattle * 1e3).diff(now * 1e3))
          console.log(
            chalk.green(
              `Drs id ${warrior.id} battle time remaining ${Math.round(duration.asMinutes())}m at ${moment(timeBattle * 1e3).format(
                'HH:mm:ss',
              )} \n`,
            ),
          )
        }
      }
    } catch (e) {
      console.log('=====ERROR=====', e)
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async currentReward() {
    try {
      const rewards = await this.managerContract.methods.getRewards().call({ from: this.account.address })
      console.log(chalk.green(`DRS current reward available = ${Math.round(rewards * 1e-9)} DRS\n`))
    } catch (e) {
      console.log(e)
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  random(mn, mx) {
    return Math.random() * (mx - mn) + mn
  }
}
