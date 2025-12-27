import "./globals.css";
import { Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";

// 英語フォントの設定
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-en",
  weight: ["400", "600"],
  display: "swap",
});

// 日本語フォントの設定
const noto = Noto_Serif_JP({
  preload: false,
  variable: "--font-jp",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata = {
  title: "GemList - Discover Timeless Beauty",
  description: "歴史に磨かれた一石との出会い。洗練された宝石の世界へ。",
};

export default function RootLayout({ children }) {
  return (
    // ↓ ここに suppressHydrationWarning を追加しました
    <html lang="ja" className={`${cormorant.variable} ${noto.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}