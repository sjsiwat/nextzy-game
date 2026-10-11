export type CheckpointStatus = "locked" | "claimable" | "claimed";

export interface Checkpoint {
  points: number;
  reward: string;
  status: CheckpointStatus;
}

export interface PlayerSummary {
  totalScore: number;
  maxScore: number;
  checkpoints: Checkpoint[];
}

export interface PlayResult {
  score: number;
  totalScore: number;
}

export interface ClaimResult {
  checkpoint: number;
  reward: string;
  claimedAt: string;
}

export interface PlayHistoryItem {
  id: number;
  score: number;
  createdAt: string;
}

export interface RewardHistoryItem {
  id: number;
  checkpoint: number;
  rewardName: string;
  createdAt: string;
}
