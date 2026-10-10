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
