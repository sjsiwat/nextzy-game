import { PrismaService } from '../prisma/prisma.service';
import { capScore, getSummary, pickRandomScore } from './game.logic';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { CHECKPOINTS, MAX_SCORE } from './game.constants';
import { ClaimResult, PlayerSummary, PlayResult } from './game.types';

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

  async claimReward(
    playerId: string,
    checkpoint: number,
  ): Promise<ClaimResult> {
    const reward = CHECKPOINTS.find((item) => item.points === checkpoint);
    if (!reward) {
      throw new BadRequestException('Unknown checkpoint');
    }

    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
    });
    if (!player || player.totalScore < checkpoint) {
      throw new BadRequestException('Score has not reached this checkpoint');
    }

    try {
      const claim = await this.prisma.rewardClaim.create({
        data: { playerId, checkpoint, rewardName: reward.reward },
      });
      return {
        checkpoint,
        reward: claim.rewardName,
        claimedAt: claim.createdAt,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Reward already claimed');
      }
      throw error;
    }
  }
  async resetPlayer(playerId: string): Promise<void> {
    await this.prisma.player.deleteMany({ where: { id: playerId } });
  }
}
