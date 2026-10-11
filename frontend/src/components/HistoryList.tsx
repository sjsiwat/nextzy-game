import { formatDateTime, formatNumber } from "@/lib/format";
import type { PlayHistoryItem, RewardHistoryItem } from "@/lib/types";
import type { HistoryTab } from "./HistoryTabs";

interface HistoryListProps {
  tab: HistoryTab;
  plays: PlayHistoryItem[];
  rewards: RewardHistoryItem[];
}

export default function HistoryList({ tab, plays, rewards }: HistoryListProps) {
  const isPlays = tab === "plays";

  const rows = isPlays
    ? plays.map((item) => ({
        id: item.id,
        title: `เล่นได้ ${formatNumber(item.score)} คะแนน`,
        subtitle: `เล่นเมื่อ ${formatDateTime(item.createdAt)}`,
      }))
    : rewards.map((item) => ({
        id: item.id,
        title: `ได้รับ${item.rewardName}`,
        subtitle: `ได้รับเมื่อ ${formatDateTime(item.createdAt)}`,
      }));

  const avatarClass = isPlays ? "bg-avatar-play" : "bg-avatar-reward";

  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted">ยังไม่มีประวัติ</p>
    );
  }

  return (
    <ul className="mt-2 border-t border-neutral-200">
      {rows.map((row) => (
        <li
          key={row.id}
          className="flex h-20.5 items-center gap-6 border-b border-neutral-200 px-6"
        >
          <span className={`size-12 shrink-0 rounded-full ${avatarClass}`} />
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-6 text-ink-strong">
              {row.title}
            </p>
            <p className="text-sm leading-6 text-muted">{row.subtitle}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
