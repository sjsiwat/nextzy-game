export type HistoryTab = "plays" | "rewards";

const TABS: { id: HistoryTab; label: string }[] = [
  { id: "plays", label: "ประวัติการเล่น" },
  { id: "rewards", label: "ประวัติรางวัล" },
];

interface HistoryTabsProps {
  active: HistoryTab;
  onChange: (tab: HistoryTab) => void;
}

export default function HistoryTabs({ active, onChange }: HistoryTabsProps) {
  return (
    <div role="tablist" className="mt-7.25 flex gap-1.5 px-2.5">
      {TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`flex h-8 w-22.5 items-center justify-center whitespace-nowrap rounded-full border px-2 text-[13px] leading-[1.2] ${
              selected
                ? "border-tab-red text-tab-red"
                : "border-tab-gray text-tab-gray"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
