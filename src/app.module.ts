import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { Bot } from './polka/bot'
import { DballBot } from './dball/dball-bot'

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: ['.env'] }), ScheduleModule.forRoot()],
    controllers: [],
    providers: [Bot, DballBot],
})
export class AppModule {
}
