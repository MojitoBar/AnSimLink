import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnSim-Link | 피싱 링크 판별 서비스",
  description: "의심스러운 URL을 입력하면 해당 사이트의 피싱 위험도를 분석하여 안전성을 평가해주는 웹 서비스",
  icons: {
    icon: [
      { url: '/icons/shield-icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icons/shield-icon.svg', type: 'image/svg+xml' }
    ],
  },
  verification: {
    google: "D9UkM4Wzh6zGyXKePHH21HM9W-7zFbOLoLq-sMLscWY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="trancy-ko light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
