"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface ResultModalProps {
  open: boolean;
  title: string;
  message: string;
  imageSrc?: string;
  onClose: () => void;
}

export default function ResultModal({
  open,
  title,
  message,
  imageSrc,
  onClose,
}: ResultModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[min(21.25rem,calc(100vw-2rem))] rounded-2xl bg-white p-0 text-ink-strong backdrop:bg-black/50"
    >
      <div className="relative flex flex-col items-center px-6 pb-7 pt-9 text-center">
        <button
          type="button"
          aria-label="ปิด"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M3 3l12 12M15 3L3 15" />
          </svg>
        </button>

        {imageSrc && (
          <Image
            src={imageSrc}
            alt=""
            width={78}
            height={78}
            className="mb-4 max-w-none"
          />
        )}
        <h2 className="text-2xl font-semibold leading-8">{title}</h2>
        <p className="mt-2 text-lg text-neutral-600">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-9 w-44 rounded-full bg-brand-yellow text-lg font-bold text-white"
        >
          ปิด
        </button>
      </div>
    </dialog>
  );
}
