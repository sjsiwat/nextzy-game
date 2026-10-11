import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "เกมสะสมคะแนน Nextzy",
  description: "สุ่มคะแนน สะสมแต้ม รับรางวัล",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={kanit.variable}>
      <body>{children}</body>
    </html>
  );
}
