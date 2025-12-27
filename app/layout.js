/* app/layout.js */
import "./globals.css";
// Noto Serif JP を Noto Sans JP に変更します
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";

// 英語フォント（数字やアクセントに使用）
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-en",
  weight: ["600", "700"], // 太めを追加
  display: "swap",
});

// 日本語フォント（ゴシック体に変更）
const notoSans = Noto_Sans_JP({
  preload: false,
  variable: "--font-jp",
  weight: ["400", "500", "700"], // 太めを追加
  display: "swap",
});

export const metadata = {
  title: "IKEA-like & Pinterest-like Prototype",
  description: "ECサイトプロトタイプ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${notoSans.variable}`} suppressHydrationWarning>
      {/* 背景のオーブをbodyの外（または一番上）に配置して固定表示させます */}
      <body>
        <div className="fixed-bg">
           <div className="orb orb-1"></div>
           <div className="orb orb-2"></div>
           <div className="orb orb-3"></div>
           <div className="orb orb-4"></div>
           <div className="orb orb-5"></div>
        </div>
        {children}
      </body>
    </html>
  );
}