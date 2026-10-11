import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { preconnect } from "react-dom";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  title: "เกมสะสมคะแนน Nextzy",
  description: "สุ่มคะแนน สะสมแต้ม รับรางวัล",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // เปิดการเชื่อมต่อ (DNS + TLS) ไปยัง backend ล่วงหน้า ก่อนที่โค้ดฝั่งเบราว์เซอร์จะเรียก API
  preconnect(API_URL, { crossOrigin: "anonymous" });

  return (
    <html lang="th" className={kanit.variable}>
      <body>{children}</body>
    </html>
  );
}
