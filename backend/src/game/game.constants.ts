export const SCORES = [300, 500, 1000, 3000];
export const MAX_SCORE = 10000;

export const CHECKPOINTS = [
  { points: 5000, reward: 'รางวัล A' },
  { points: 7500, reward: 'รางวัล B' },
  { points: 10000, reward: 'รางวัล C' },
];

export const CHECKPOINT_POINTS = CHECKPOINTS.map(
  (checkpoint) => checkpoint.points,
);
