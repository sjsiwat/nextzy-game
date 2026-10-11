import Link from "next/link";

interface BottomBarProps {
  href: string;
  label: string;
}

export default function BottomBar({ href, label }: BottomBarProps) {
  return (
    <footer className="sticky bottom-0 rounded-t-5 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <Link
        href={href}
        className="flex h-12 items-center justify-center rounded-full bg-brand-yellow text-xl font-bold text-white"
      >
        {label}
      </Link>
    </footer>
  );
}
