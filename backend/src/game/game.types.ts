export type CheckpointStatus = 'locked' | 'claimable' | 'claimed';

export interface CheckpointSummary {
  points: number;
  reward: string;
  status: CheckpointStatus;
}

export interface PlayResult {
  score: number;
  totalScore: number;
}

export interface PlayerSummary {
  totalScore: number;
  maxScore: number;
  checkpoints: CheckpointSummary[];
}

export interface ClaimResult {
  checkpoint: number;
  reward: string;
  claimedAt: Date;
}
