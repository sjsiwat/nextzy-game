import type {
  ClaimResult,
  PlayHistoryItem,
  PlayResult,
  PlayerSummary,
  RewardHistoryItem,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError(
      0,
      "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (เซิร์ฟเวอร์อาจกำลังเริ่มทำงาน) กรุณารอสักครู่แล้วลองใหม่",
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  getSummary: (playerId: string) =>
    request<PlayerSummary>(`/players/${playerId}/summary`),
  play: (playerId: string) =>
    request<PlayResult>(`/players/${playerId}/game/play`, { method: "POST" }),
  claim: (playerId: string, checkpoint: number) =>
    request<ClaimResult>(`/players/${playerId}/rewards/${checkpoint}/claim`, {
      method: "POST",
    }),
  getPlayHistory: (playerId: string) =>
    request<PlayHistoryItem[]>(`/players/${playerId}/history/plays`),
  getRewardHistory: (playerId: string) =>
    request<RewardHistoryItem[]>(`/players/${playerId}/history/rewards`),
  reset: (playerId: string) =>
    request<void>(`/players/${playerId}/reset`, { method: "POST" }),
};
