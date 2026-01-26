import "./globals.css";
// Noto_Sans_JP を Noto_Serif_JP に変更
import { Cormorant_Garamond, Noto_Serif_JP } from "next/font/google";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_OG_IMAGE } from "@/libs/meta";
import { GoogleTagManager } from '@next/third-parties/google';
// 💎 診断機能のインポート
import { DiagnosisProvider } from '@/contexts/DiagnosisContext';
import DiagnosisModal from '@/components/diagnosis/DiagnosisModal';

// 英語フォント
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-en",
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

// 日本語フォント
const notoSerif = Noto_Serif_JP({
  weight: ["300", "400", "500", "600"],
  variable: "--font-jp",
  preload: false,
  display: "swap",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
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
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ★統合された RootLayout
export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${notoSerif.variable}`} suppressHydrationWarning>
      <body>
        <DiagnosisProvider>
          {/* 背景演出 */}
          <div className="fixed-bg">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>
            <div className="orb orb-5"></div>
          </div>

          {/* メインコンテンツ */}
          <div className="main-content">
            {children}
          </div>

          {/* 診断モーダル (どのページでも開けるように配置) */}
          <Suspense fallback={null}>
            <DiagnosisModal />
          </Suspense>
        </DiagnosisProvider>

        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXXX"} />
      </body>
    </html>
  );
}