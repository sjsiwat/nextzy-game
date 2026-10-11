import { formatNumber } from "@/lib/format";

export type ChipState = "active" | "winner" | "removed";

const STYLES: Record<ChipState, string> = {
  active: "bg-brand-cyan text-brand-green-dark",
  winner: "bg-brand-green text-brand-green-dark",
  removed: "bg-transparent text-brand-green-dark/50",
};

export default function ScoreChip({
  value,
  state,
}: {
  value: number;
  state: ChipState;
}) {
  return (
    <div
      className={`flex h-9.5 items-center justify-center rounded-xl text-xl font-bold transition-colors duration-300 ${STYLES[state]}`}
    >
      {formatNumber(value)}
    </div>
  );
}
