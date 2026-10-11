"use client";

import { useState } from "react";
import BottomBar from "@/components/BottomBar";
import HistoryList from "@/components/HistoryList";
import HistoryTabs, { type HistoryTab } from "@/components/HistoryTabs";
import ProgressCard from "@/components/ProgressCard";
import ResultModal from "@/components/ResultModal";
import { useHomeData } from "@/hooks/useHomeData";

function HomeSkeleton() {
  return (
    <div aria-busy="true" className="animate-pulse">
      <div className="h-56.75 bg-neutral-200" />
      <div className="mx-auto mt-5.5 h-6.75 w-21.25 rounded-full bg-neutral-200" />
      <div className="mt-7 flex gap-1.75 px-2.5">
        <div className="h-8 w-22.5 rounded-full bg-neutral-200" />
        <div className="h-8 w-22.5 rounded-full bg-neutral-200" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data, error, reload, reset, claim } = useHomeData();
  const [tab, setTab] = useState<HistoryTab>("plays");
  const [claiming, setClaiming] = useState(false);
  const [claimedReward, setClaimedReward] = useState<string | null>(null);

  const handleClaim = async (points: number) => {
    if (claiming) return;
    setClaiming(true);
    const reward = await claim(points);
    setClaiming(false);
    if (reward) setClaimedReward(reward);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-125 flex-col bg-white">
      <div className="flex-1">
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 bg-red-50 px-4 py-3 text-sm text-brand-red"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void reload()}
              className="shrink-0 font-bold underline"
            >
              ลองอีกครั้ง
            </button>
          </div>
        )}

        {data && (
          <>
            <ProgressCard summary={data.summary} onClaim={handleClaim} />
            <button
              type="button"
              onClick={() => void reset()}
              className="mx-auto mt-5.5 block h-6.75 w-21.25 rounded-full bg-brand-blue text-lg font-bold leading-none text-white"
            >
              RESET
            </button>
            <HistoryTabs active={tab} onChange={setTab} />
            <HistoryList tab={tab} plays={data.plays} rewards={data.rewards} />
          </>
        )}

        {!data && !error && <HomeSkeleton />}
      </div>

      <BottomBar href="/game" label="ไปเล่นเกม" />

      <ResultModal
        open={claimedReward !== null}
        title="ยินดีด้วย"
        message={`คุณได้รับ${claimedReward ?? ""}`}
        imageSrc="/images/coin.png"
        onClose={() => setClaimedReward(null)}
      />
    </main>
  );
}
