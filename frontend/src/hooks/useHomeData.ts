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

async function fetchHomeData(playerId: string): Promise<HomeData> {
  const [summary, plays, rewards] = await Promise.all([
    api.getSummary(playerId),
    api.getPlayHistory(playerId),
    api.getRewardHistory(playerId),
  ]);
  return { summary, plays, rewards };
}

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await fetchHomeData(getPlayerId()));
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

  // โหลดครั้งแรก: ignore กัน setState หลังออกจากหน้าไปก่อนข้อมูลมาถึง
  useEffect(() => {
    let ignore = false;
    fetchHomeData(getPlayerId())
      .then((result) => {
        if (ignore) return;
        setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!ignore) setError(toMessage(err));
      });
    return () => {
      ignore = true;
    };
  }, []);

  return { data, error, reload: load, reset, claim };
}
