import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { Bot } from './polka/bot'
import { DballBot } from './dball/dball-bot'
import { P2eBot } from './p2e/p2e-bot'
import { DrsBot } from './drs/drs-bot'

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: ['.env'] }), ScheduleModule.forRoot()],
    controllers: [],
    providers: [
        // Bot,
        DballBot,
        P2eBot,
        // DrsBot,
    ],
})
export class AppModule {
}
