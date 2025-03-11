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
  description: "의심되는 링크, 클릭 전에 확인하세요! 피싱 위험도를 분석해 안전하게 인터넷을 사용할 수 있도록 도와드립니다.",
  keywords: ["피싱", "사이트 안전성", "URL 검사", "보안", "피싱 링크", "사이버 보안", "안전한 인터넷"],
  authors: [{ name: "AnSim-Link Team", url: "https://github.com/MojitoBar/AnSimLink" }],
  creator: "AnSim-Link Team",
  publisher: "AnSim-Link",
  metadataBase: new URL("https://ansim-link.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://ansim-link.vercel.app",
    title: "AnSim-Link | 피싱 링크 판별 서비스",
    description: "의심되는 링크, 클릭 전에 확인하세요! 피싱 위험도를 분석해 안전하게 인터넷을 사용할 수 있도록 도와드립니다.",
    siteName: "AnSim-Link",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "AnSim-Link 피싱 링크 판별 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AnSim-Link | 피싱 링크 판별 서비스",
    description: "의심되는 링크, 클릭 전에 확인하세요! 피싱 위험도를 분석해 안전하게 인터넷을 사용할 수 있도록 도와드립니다.",
    images: ["/images/og-image.svg"],
    creator: "@ansimlink",
  },
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
  category: "보안",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="trancy-ko light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AnSim-Link",
              "url": "https://ansim-link.vercel.app",
              "description": "의심되는 링크, 클릭 전에 확인하세요! 피싱 위험도를 분석해 안전하게 인터넷을 사용할 수 있도록 도와드립니다.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ansim-link.vercel.app/?url={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-50 to-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
