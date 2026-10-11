"use client";

import BottomBar from "@/components/BottomBar";
import ResultModal from "@/components/ResultModal";
import ScoreChip, { type ChipState } from "@/components/ScoreChip";
import { useGame } from "@/hooks/useGame";
import { formatNumber } from "@/lib/format";
import { GAME_SCORES } from "@/lib/game";

export default function GamePage() {
  const {
    totalScore,
    maxScore,
    remaining,
    phase,
    result,
    error,
    play,
    closeResult,
  } = useGame();

  const stateOf = (value: number): ChipState => {
    if (!remaining.includes(value)) return "removed";
    return phase === "finished" ? "winner" : "active";
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-125 flex-col bg-linear-to-b from-white to-brand-orange/17">
      <div className="flex-1">
        <h1 className="pt-12 text-center text-2xl font-semibold leading-8">
          คะแนนสะสม{" "}
          {totalScore !== null ? (
            `${formatNumber(totalScore)}/${formatNumber(maxScore)}`
          ) : error ? (
            "-"
          ) : (
            <span className="inline-block h-6 w-32 animate-pulse rounded bg-neutral-200 align-middle" />
          )}
        </h1>

        <div className="mt-48 grid grid-cols-4 gap-2 px-2">
          {GAME_SCORES.map((value) => (
            <ScoreChip key={value} value={value} state={stateOf(value)} />
          ))}
        </div>

        {phase !== "finished" && (
          <button
            type="button"
            onClick={() => void play()}
            disabled={phase === "playing"}
            className="mx-auto mt-17.5 flex h-9.5 w-30 items-center justify-center rounded-xl bg-brand-red text-xl font-bold text-white disabled:cursor-wait disabled:bg-brand-red/30"
          >
            สุ่มคะแนน
          </button>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 px-4 text-center text-sm text-brand-red"
          >
            {error}
          </p>
        )}
      </div>

      <BottomBar href="/" label="กลับหน้าหลัก" />

      <ResultModal
        open={phase === "finished" && result !== null}
        title="ได้รับ"
        message={`${formatNumber(result?.score ?? 0)} คะแนน`}
        onClose={closeResult}
      />
    </main>
  );
}
