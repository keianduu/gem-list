/* app/about/page.js */
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";
import Breadcrumb from "@/components/Breadcrumb";
import { PAGE_METADATA } from "@/libs/meta";

export const metadata = {
  title: PAGE_METADATA.about.title,
  description: PAGE_METADATA.about.description,
  alternates: {
    canonical: '/about',
  },
};
const breadcrumbItems = [
  { label: "Home", path: "/" },
  { label: "About & Disclaimer", path: "/about" }
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="journal-main">

        {/* --- 修正: タイトルエリアのデザインを共通化 --- */}
        <div style={{ maxWidth: "800px", margin: "40px auto 60px" }}>

          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{
              fontFamily: 'var(--font-en)', fontSize: '0.8rem', letterSpacing: '0.1em',
              color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '8px'
            }}>
              Information
            </span>
            <h1 className="section-title">About & Disclaimer</h1>
            <p className="section-subtitle">運営情報 & 免責事項</p>
          </div>

          <div className="policy-content">

            {/* --- Concept Section --- */}
            <section>
              <div className="policy-contact-info">
                <h2>Concept</h2>
                <div style={{ marginTop: '20px' }}>
                  <p>
                    <strong>&quot;Discover the Unseen Brilliance&quot;（見えざる輝きを発見する）</strong>
                  </p>
                  <p>
                    宝石の輝きって、眺めているだけで不思議と癒やされますよね。 でも、「宝石」と聞くとすごく高額で、自分とは縁遠い世界のように見えがちです。
                  </p>
                  <p>
                    実は、宝石の世界はもっと自由で、身近なものなんです。 資産価値のある有名な宝石だけじゃなく、鉱物として個性的な美しさを持つ石や、意外と手に入りやすいものもたくさんあります。
                  </p>
                  <p>
                    どんな石も、地球が長い時間をかけて生み出した小さな奇跡。 その一粒一粒に、生まれた場所や辿ってきた物語が詰まっています。
                  </p>
                  <p>
                    Jewelism MARKETでは、そんな宝石や鉱物たちの奥深い魅力を、図鑑をめくるような感覚でご紹介しています。 ここでの出会いを通して、宝石の世界をもっと身近に感じてもらえたら嬉しいです。
                  </p>
                  <p>
                    さあ、一緒に宝石の世界を楽しみませんか？
                  </p>
                </div>
              </div>
            </section>

            {/* --- 運営者情報 --- */}
            <section>
              <div className="policy-contact-info">
                <h2>運営者情報</h2>
                <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px 0', marginTop: '16px' }}>
                  <dt style={{ fontWeight: 'bold', color: '#111' }}>サイト名</dt>
                  <dd>Jewelism Market（ジュエリズム・マーケット）</dd>

                  <dt style={{ fontWeight: 'bold', color: '#111' }}>運営者</dt>
                  <dd>kei ando</dd>

                  <dt style={{ fontWeight: 'bold', color: '#111' }}>URL</dt>
                  <dd>https://jewelism-market.com</dd>
                </dl>
              </div>
            </section>

            {/* --- 免責事項 --- */}
            <section>
              <div className="policy-contact-info">
                <h2>免責事項</h2>
                <div style={{ marginTop: '16px' }}>
                  <p>
                    当サイトに掲載している情報は、作成時点の内容に基づいており、正確性・完全性・最新性を保証するものではありません。商品・サービスの価格、在庫、仕様、販売条件等は予告なく変更される場合があります。ご購入・ご契約の最終判断は、必ず各販売元・提供元の公式情報をご確認のうえ、自己責任で行ってください。
                  </p>
                  <p>
                    当サイトからリンク・バナー等により他サイトへ移動された場合、移動先サイトで提供される情報、商品・サービス、取引内容等について当サイトは一切責任を負いません。
                  </p>
                  <p>
                    当サイトの情報を利用したことにより生じたいかなる損害についても、当サイトは責任を負いかねます。
                  </p>
                  <p>
                    なお、当サイトはアフィリエイトプログラムを利用しており、リンク経由で商品・サービスの購入等が行われた場合、当サイトに報酬が支払われることがあります。
                  </p>
                  <p>
                    宝石・ジュエリーの品質や価値は、鑑別書・鑑定書の有無、販売店の基準、個体差等により異なります。購入前に販売元の説明・付属資料をご確認ください。
                  </p>
                </div>
              </div>
            </section>

            {/* --- お問い合わせ --- */}
            <section id="contact">
              <div className="policy-contact-info">
                <h2>お問い合わせ</h2>
                <div style={{ marginTop: '16px' }}>
                  <p>
                    当サイトに関するご質問、ご要望、お仕事のご依頼などは、以下のフォームよりお願いいたします。
                  </p>

                  <div style={{ marginTop: '40px' }}>
                    <ContactForm />
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '20px' }}>
                    ※原則として2〜3営業日以内にご返信いたしますが、内容によってはお時間をいただく場合や、お答えできない場合がございます。あらかじめご了承ください。
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>

      </main>
      <Breadcrumb items={breadcrumbItems} />
      <SiteFooter />
    </>
  );
}