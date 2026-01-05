/* app/privacy-policy/page.js */
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Privacy Policy - Jewelism MARKET",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />

      <main className="journal-main">
        {/* ▼▼▼ パンくずリスト追加 ▼▼▼ */}
        <nav className="breadcrumb">
          <div className="breadcrumb-inner">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Privacy Policy</span>
          </div>
        </nav>

        {/* 本文エリア: 中央寄せ (800px) */}
        <div style={{ maxWidth: "800px", margin: "0 auto", paddingTop: "40px" }}>
          <h1 className="policy-title">Privacy Policy</h1>
          
          <div className="policy-content">
            
            {/* ▼▼▼ 全体を一つのグラスモーフィズムカードで囲む ▼▼▼ */}
            <div className="policy-contact-info">
              <p>
                Jewelism Market（以下「当サイト」）は、当サイトにおける個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。
              </p>

              <section>
                <h2>1. 取得する情報</h2>
                <p>当サイトでは、以下の情報を取得する場合があります。</p>
                <ul>
                  <li>お問い合わせフォームの送信内容（氏名、メールアドレス、問い合わせ内容等）</li>
                  <li>アクセス解析により収集される情報（閲覧ページ、参照元、閲覧日時、端末情報、ブラウザ情報、IPアドレス、Cookie等）</li>
                </ul>
              </section>

              <section>
                <h2>2. 利用目的</h2>
                <p>取得した情報は、以下の目的で利用します。</p>
                <ul>
                  <li>お問い合わせへの回答および必要な連絡</li>
                  <li>サイトの品質向上、利用状況分析、コンテンツ改善</li>
                  <li>不正利用の防止、セキュリティ確保</li>
                </ul>
              </section>

              <section>
                <h2>3. 個人情報の第三者提供</h2>
                <p>当サイトは、法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。</p>
              </section>

              <section>
                <h2>4. 外部サービスの利用（アクセス解析）</h2>
                <p>
                  当サイトでは、アクセス解析のために Google Analytics を利用する場合があります。Google Analytics は Cookie 等を利用してトラフィックデータを収集します。このトラフィックデータは匿名で収集され、個人を特定するものではありません。
                </p>
                <p>
                  Cookie を無効にすることで収集を拒否できます。設定方法はご利用のブラウザの設定をご確認ください。
                </p>
              </section>

              <section>
                <h2>5. 広告配信・アフィリエイトプログラムについて</h2>
                <p>
                  当サイトは、第三者配信の広告サービスやアフィリエイトプログラムを利用する場合があります。これらの広告配信事業者・アフィリエイト事業者は、ユーザーの興味関心に応じた広告表示や成果計測のため、Cookie 等を使用することがあります。
                </p>
                <p>
                  当サイト経由で商品・サービスの購入や申込みが行われた場合、当サイトが報酬を得ることがあります。
                </p>
                <p>
                  なお、リンク先の商品・サービスの取引や個人情報の取扱いについては、各事業者のプライバシーポリシー等をご確認ください。
                </p>
              </section>

              <section>
                <h2>6. 個人情報の管理</h2>
                <p>
                  当サイトは、取得した個人情報の漏えい、滅失、改ざん等を防止するため、合理的な安全対策を講じます。
                </p>
              </section>

              <section>
                <h2>7. 開示・訂正・削除等の請求</h2>
                <p>
                  本人から個人情報の開示、訂正、追加、削除、利用停止等の請求があった場合、本人確認のうえ、法令に従い適切に対応します。
                </p>
              </section>

              <section>
                <h2>8. 免責</h2>
                <p>
                  当サイトからのリンク・バナー等で移動した外部サイトにおける情報・サービス等について、当サイトは一切責任を負いません。
                </p>
              </section>

              <section>
                <h2>9. プライバシーポリシーの変更</h2>
                <p>
                  当サイトは、法令の改正や運用方針の変更等により、本ポリシーを予告なく改定する場合があります。最新の内容は当サイトに掲載します。
                </p>
              </section>

              <section>
                <h2>10. お問い合わせ窓口</h2>
                <p>本ポリシーに関するお問い合わせは、以下までご連絡ください。</p>
                {/* 内部の連絡先情報もデザインを整えるため、単純なdivに変更するか、
                    policy-contact-infoクラスを使わずスタイルを当てます 
                    （入れ子にするとデザインが崩れる可能性があるため） 
                */}
                <div style={{ background: "rgba(255,255,255,0.5)", padding: "20px", borderRadius: "12px", marginTop: "10px" }}>
                  <p>運営者：kei ando</p>
                  <p>お問い合わせ：<Link href="/about#contact" style={{ color: "#0058a3", textDecoration: "underline" }}>お問い合わせフォーム</Link></p>
                </div>
              </section>

              <div className="policy-dates">
                <p>制定日：2026年1月5日</p>
                <p>最終改定日：2026年1月5日</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}