import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MAX_SCORE } from './game.constants';
import { capScore, getSummary, pickRandomScore } from './game.logic';
import { PlayerSummary, PlayResult } from './game.types';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async play(playerId: string): Promise<PlayResult> {
    const score = pickRandomScore();

    return this.prisma.$transaction(async (tx) => {
      await tx.player.upsert({
        where: { id: playerId },
        update: {},
        create: { id: playerId },
      });
      const updated = await tx.player.update({
        where: { id: playerId },
        data: { totalScore: { increment: score } },
      });

      const totalScore = capScore(updated.totalScore);
      if (totalScore !== updated.totalScore) {
        await tx.player.update({
          where: { id: playerId },
          data: { totalScore },
        });
      }
      await tx.playHistory.create({ data: { playerId, score } });
      return { score, totalScore };
    });
  }

  async getPlayerSummary(playerId: string): Promise<PlayerSummary> {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: { claims: true },
    });

    const totalScore = player?.totalScore ?? 0;
    const claimedPoints = player?.claims.map((claim) => claim.checkpoint) ?? [];

    return {
      totalScore,
      maxScore: MAX_SCORE,
      checkpoints: getSummary(totalScore, claimedPoints),
    };
  }
}
