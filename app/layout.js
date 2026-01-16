/* app/layout.js */
import "./globals.css";
// Noto_Sans_JP を Noto_Serif_JP に変更
import { Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_OG_IMAGE } from "@/libs/meta"; // ★追加
import { GoogleTagManager } from '@next/third-parties/google'; // ★追加

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
  metadataBase: new URL(SITE_URL), // OGP画像などの相対パス解決に必要
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`, // 子ページで title: "About" とすると "About | Jewelism MARKET" になる
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    // images: [SITE_OG_IMAGE], // OGと同じなら省略可
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXX"} />
      </body>
    </html>
  );
}