import { HttpService, Injectable, OnModuleInit } from '@nestjs/common'
import fs from 'fs'
import path from 'path'
import { NFT_ABI } from 'src/drs/nft.abi'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import _ from 'lodash'
import chalk from 'chalk'

class Warrior {
    id: number
    kind: string
    name: string
    hp: number
    atk: number
    def: number
    level: number
}

@Injectable()
export class TokenHolder implements OnModuleInit {

    private web3 = new Web3(process.env.WSS_NODE)
    private nftContract = new this.web3.eth.Contract(NFT_ABI as AbiItem[], process.env.DRS_NFT_CONTRACT)
    private account = this.web3.eth.accounts.privateKeyToAccount(process.env.WALLET_PRIVATE_KEY)

    constructor(private httpService: HttpService) {}

    async onModuleInit() {
        // const nftInfo = await this.nftContract.methods.getWarrior(3281).call()

        this.findNFTTokenInfo()
    }
    
    async getAllTokenHolders() {
        try {
            const API = `https://api.covalenthq.com/v1/56/tokens/${process.env.DRS_NFT_CONTRACT}/token_holders/?key=${process.env.COVALENT_API_KEY}&page-size=10000`
            const response = await this.httpService.get(API).toPromise()
            if (response && response.data) {
                const holders = []
                for (const item of response.data.data.items) {
                    holders.push({
                        address: item.address,
                        balance: item.balance
                    })
                }
                const wData = JSON.stringify(holders, null, 2)
                fs.writeFile('nft-holders.json', wData, (err) => {
                    if (err) throw err
                    console.log('Data written to file')
                })
            }
        } catch(e) {
            console.log(e)
        }
    }

    async findNFTsByHolder() {
        try {
            const holders = fs.readFileSync(path.join(__dirname, '../../nft-holders.json'), 'utf8')
            const jHolders = JSON.parse(holders)
            const nftIds = []
            for (const address of jHolders) {
                console.log(address)
                const nftData = {
                    address: address.address,
                    nftIds: []
                }
                for (let i = 0; i < address.balance; i++) {
                    console.log(i)
                    const nftId = await this.nftContract.methods.tokenOfOwnerByIndex(address.address, i).call()

                    nftData.nftIds.push(nftId)
                }
                nftIds.push(nftData)
            }

            const wData = JSON.stringify(nftIds, null, 2)
            fs.writeFile('nft-ids-holders.json', wData, (err) => {
                if (err) throw err
                console.log('Data written to file')
            })
        } catch(e) {
            console.log(e)
        }
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async findNFTTokenInfo() {
        try {
            const holders = fs.readFileSync(path.join(__dirname, '../../nft-ids-holders.json'), 'utf8')
            const jHolders = JSON.parse(holders)
            const nftInfos = []

            for (const holder of jHolders) {
                console.log(holder.address)
                const nftData = {
                    address: holder.address,
                    nftInfos: []
                }

                for (const id of holder.nftIds) {
                    const nftInfo = await this.nftContract.methods.getWarrior(id).call()
                    const warrior = {
                        id: +id,
                        kind: nftInfo[0],
                        name: nftInfo[1],
                        hp: +nftInfo[2],
                        atk: +nftInfo[3],
                        def: +nftInfo[4],
                        level: +nftInfo[5],
                    } as Warrior

                    nftData.nftInfos.push(warrior)
                }

                nftInfos.push(nftData)
            }

            const chunks = _.chunk(nftInfos, 3000)
            chunks.forEach((data, idx) => {
                const wData = JSON.stringify(data, null, 2)
                fs.writeFile(`nft-infos-${idx}.json`, wData, (err) => {
                    if (err) throw err
                    console.log('Data written to file')
                })
            })
        } catch(e) {
            console.log(e)
        }
    }
}