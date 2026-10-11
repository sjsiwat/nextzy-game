import Image from "next/image";
import { formatNumber } from "@/lib/format";
import type { Checkpoint, PlayerSummary } from "@/lib/types";

interface ProgressCardProps {
  summary: PlayerSummary;
  onClaim: (points: number) => void;
}

// ในดีไซน์ เหรียญ 10,000 ขยับเข้ามาจากปลายรางเพื่อไม่ให้ล้นขอบการ์ด
const COIN_OFFSET_PX = 10;

function CheckpointMarker({
  checkpoint,
  isLast,
}: {
  checkpoint: Checkpoint;
  isLast: boolean;
}) {
  if (isLast) {
    return (
      <Image
        src="/images/coin.png"
        alt=""
        width={30}
        height={30}
        className="max-w-none"
      />
    );
  }
  if (checkpoint.status === "locked") {
    return <span className="block size-5 rounded-full bg-slate-300" />;
  }
  const src =
    checkpoint.status === "claimed"
      ? "/images/checkpoint-claimed.png"
      : "/images/checkpoint-reached.png";
  return (
    <Image src={src} alt="" width={20} height={20} className="max-w-none" />
  );
}

function ClaimPill({
  checkpoint,
  onClaim,
}: {
  checkpoint: Checkpoint;
  onClaim: (points: number) => void;
}) {
  const base =
    "inline-flex h-5 items-center whitespace-nowrap rounded-full px-2 text-[10px] font-bold leading-none text-white";

  if (checkpoint.status === "claimed") {
    return (
      <span className={`${base} bg-brand-red-claim/50`}>
        ได้{checkpoint.reward} แล้ว
      </span>
    );
  }
  if (checkpoint.status === "claimable") {
    return (
      <button
        type="button"
        onClick={() => onClaim(checkpoint.points)}
        className={`${base} bg-brand-red-claim`}
      >
        กดรับ{checkpoint.reward}
      </button>
    );
  }
  return (
    <span className={`${base} bg-neutral-200`}>กดรับ{checkpoint.reward}</span>
  );
}

export default function ProgressCard({ summary, onClaim }: ProgressCardProps) {
  const { totalScore, maxScore, checkpoints } = summary;
  const percent = Math.min(totalScore / maxScore, 1) * 100;
  const lastIndex = checkpoints.length - 1;

  const positionOf = (points: number, isLast: boolean) =>
    isLast
      ? `calc(100% - ${COIN_OFFSET_PX}px)`
      : `${(points / maxScore) * 100}%`;

  return (
    <section className="bg-surface-gray px-4.25 pb-3 pt-3.75">
      <div className="relative rounded-2xl border border-black bg-white pb-3.5 pt-4.5">
        <span className="absolute left-0 top-3.5 flex h-5.5 items-center rounded-r-full bg-brand-maroon px-3 text-xs font-medium leading-none text-white">
          แชร์คะแนน
        </span>

        <div className="pr-3 text-right">
          <h1 className="text-base font-semibold leading-6">สะสมคะแนน</h1>
          <p className="text-sm font-medium leading-6">
            คะแนนครบ {formatNumber(maxScore)} รับรางวัลใหญ่
          </p>
          <p className="text-2xl font-bold leading-7 text-brand-red">
            {formatNumber(totalScore)}/{formatNumber(maxScore)}
          </p>
        </div>

        <div className="ml-4 mr-8 mt-10">
          <div className="relative h-2.5 rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-progress-fill"
              style={{ width: `${percent}%` }}
            />
            <span
              className="absolute top-1/2 size-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-progress-ball"
              style={{ left: `${percent}%` }}
            />

            {checkpoints.map((checkpoint, index) => (
              <div
                key={checkpoint.points}
                className="absolute inset-y-0 left-0"
                style={{
                  left: positionOf(checkpoint.points, index === lastIndex),
                }}
              >
                <span className="absolute -top-7.5 left-0 -translate-x-1/2 whitespace-nowrap text-xs leading-4 text-neutral-500">
                  {formatNumber(checkpoint.points)}
                </span>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <CheckpointMarker
                    checkpoint={checkpoint}
                    isLast={index === lastIndex}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2.5 pr-2">
          {checkpoints.map((checkpoint) => (
            <ClaimPill
              key={checkpoint.points}
              checkpoint={checkpoint}
              onClaim={onClaim}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
