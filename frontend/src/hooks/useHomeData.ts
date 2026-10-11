import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getPlayerId } from "@/lib/player";
import type {
  PlayHistoryItem,
  PlayerSummary,
  RewardHistoryItem,
} from "@/lib/types";

interface HomeData {
  summary: PlayerSummary;
  plays: PlayHistoryItem[];
  rewards: RewardHistoryItem[];
}

function toMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const playerId = getPlayerId();
    try {
      const [summary, plays, rewards] = await Promise.all([
        api.getSummary(playerId),
        api.getPlayHistory(playerId),
        api.getRewardHistory(playerId),
      ]);
      setData({ summary, plays, rewards });
      setError(null);
    } catch (err) {
      setError(toMessage(err));
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      await api.reset(getPlayerId());
      await load();
    } catch (err) {
      setError(toMessage(err));
    }
  }, [load]);

  // คืนชื่อรางวัลเมื่อสำเร็จ ไม่สำเร็จคืน null
  const claim = useCallback(
    async (points: number): Promise<string | null> => {
      try {
        const result = await api.claim(getPlayerId(), points);
        await load();
        return result.reward;
      } catch (err) {
        await load(); // ซิงก์หน้าจอกับข้อมูลจริงก่อน แล้วค่อยแสดง error
        setError(toMessage(err));
        return null;
      }
    },
    [load],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return { data, error, reload: load, reset, claim };
}
