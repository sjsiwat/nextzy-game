import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [PrismaModule, GameModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
