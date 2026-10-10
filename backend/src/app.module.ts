import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { HealthModule } from './health/health.module';
import { HistoryModule } from './history/history.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, GameModule, HistoryModule, HealthModule],
})
export class AppModule {}
