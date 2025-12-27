/* app/layout.js */
import "./globals.css";
// Noto_Sans_JP を Noto_Serif_JP に変更
import { Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";

// 英語フォント（変更なし）
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-en",
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

// 日本語フォント（明朝体に変更）
const notoSerif = Noto_Serif_JP({
  weight: ["300", "400", "500", "600"], // 細字(300)もあるとエレガントです
  variable: "--font-jp",
  preload: false,
  display: "swap",
});

export const metadata = {
  title: "GemList",
  description: "洗練された宝石の世界へ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${notoSerif.variable}`} suppressHydrationWarning>
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