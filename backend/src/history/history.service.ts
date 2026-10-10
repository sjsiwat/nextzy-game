import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const HISTORY_LIMIT = 100;

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  getPlays(playerId: string) {
    return this.prisma.playHistory.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      take: HISTORY_LIMIT,
      select: { id: true, score: true, createdAt: true },
    });
  }

  getRewards(playerId: string) {
    return this.prisma.rewardClaim.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, checkpoint: true, rewardName: true, createdAt: true },
    });
  }
}
