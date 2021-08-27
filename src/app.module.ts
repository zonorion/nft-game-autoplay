import { HttpModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { Bot } from './polka/bot'
import { DballBot } from './dball/dball-bot'
import { P2eBot } from './p2e/p2e-bot'
import { DrsBot } from './drs/drs-bot'
import { TokenHolder } from './holder/token-holder'

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: ['.env'] }),
        ScheduleModule.forRoot(),
        // eslint-disable-next-line max-len
        HttpModule.register({ headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36' } }),
    ],
    controllers: [],
    providers: [
        // Bot,
        // DballBot,
        // P2eBot,
        DrsBot,
        // TokenHolder,
    ],
})
export class AppModule {
}
