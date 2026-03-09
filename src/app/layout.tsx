import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FleetAI — منصة إدارة الأساطيل الذكية",
  description:
    "منصة عربية لمراقبة أساطيل تأجير السيارات في الوقت الفعلي باستخدام أجهزة OBD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
