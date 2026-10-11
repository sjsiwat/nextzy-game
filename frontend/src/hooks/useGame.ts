import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { GAME_SCORES, REVEAL_DELAY_MS, shuffle, sleep } from "@/lib/game";
import { getPlayerId } from "@/lib/player";
import type { PlayResult } from "@/lib/types";

export type GamePhase = "idle" | "playing" | "finished";

function toMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

export function useGame() {
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState(10000);
  const [remaining, setRemaining] = useState<number[]>(GAME_SCORES);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [result, setResult] = useState<PlayResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // กัน setState หลังออกจากหน้าไปแล้วระหว่างแอนิเมชัน
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    api
      .getSummary(getPlayerId())
      .then((summary) => {
        setTotalScore(summary.totalScore);
        setMaxScore(summary.maxScore);
      })
      .catch((err: unknown) => setError(toMessage(err)));
  }, []);

  const play = useCallback(async () => {
    if (phase !== "idle") return;
    setError(null);
    setPhase("playing");

    try {
      const playResult = await api.play(getPlayerId());
      if (!GAME_SCORES.includes(playResult.score)) {
        throw new Error("ได้รับข้อมูลคะแนนที่ไม่ถูกต้อง");
      }

      const losers = shuffle(GAME_SCORES.filter((s) => s !== playResult.score));
      for (const loser of losers) {
        await sleep(REVEAL_DELAY_MS);
        if (!mountedRef.current) return;
        setRemaining((current) => current.filter((s) => s !== loser));
      }
      await sleep(REVEAL_DELAY_MS);
      if (!mountedRef.current) return;

      setResult(playResult);
      setTotalScore(playResult.totalScore);
      setPhase("finished");
    } catch (err) {
      if (!mountedRef.current) return;
      setError(toMessage(err));
      setRemaining(GAME_SCORES);
      setPhase("idle");
    }
  }, [phase]);

  // ปิด modal แล้วกลับสู่สถานะพร้อมเล่นรอบใหม่
  const closeResult = useCallback(() => {
    setResult(null);
    setRemaining(GAME_SCORES);
    setPhase("idle");
  }, []);

  return {
    totalScore,
    maxScore,
    remaining,
    phase,
    result,
    error,
    play,
    closeResult,
  };
}
