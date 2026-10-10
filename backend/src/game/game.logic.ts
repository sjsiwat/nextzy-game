import { SCORES, MAX_SCORE, CHECKPOINTS } from './game.constants';
import { CheckpointStatus, CheckpointSummary } from './game.types';

export function pickRandomScore(): number {
  const index = Math.floor(Math.random() * SCORES.length);
  return SCORES[index];
}

export function getCheckpointStatus(
  total: number,
  checkpointPoints: number,
  claimedPoints: number[],
): CheckpointStatus {
  if (claimedPoints.includes(checkpointPoints)) {
    return 'claimed';
  }
  if (total >= checkpointPoints) {
    return 'claimable';
  }
  return 'locked';
}

export function getSummary(
  total: number,
  claimedPoints: number[],
): CheckpointSummary[] {
  return CHECKPOINTS.map((checkpoint) => ({
    points: checkpoint.points,
    reward: checkpoint.reward,
    status: getCheckpointStatus(total, checkpoint.points, claimedPoints),
  }));
}

export function capScore(total: number): number {
  return Math.min(total, MAX_SCORE);
}
