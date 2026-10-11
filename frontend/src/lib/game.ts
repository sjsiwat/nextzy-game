// ค่าที่ใช้แสดงผลเท่านั้น ผู้ตัดสินคะแนนจริงคือ backend
export const GAME_SCORES = [300, 500, 1000, 3000];
export const REVEAL_DELAY_MS = 700;

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
