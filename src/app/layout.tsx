import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FleetAI — منصة إدارة الأساطيل الذكية",
  description:
    "منصة عربية لمراقبة أساطيل تأجير السيارات في الوقت الفعلي باستخدام أجهزة OBD",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${cairo.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
