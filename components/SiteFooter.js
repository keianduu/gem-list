/* components/SiteFooter.js */
import Link from "next/link";
import { client } from "@/libs/microcms";

async function getFooterData() {
  try {
    const [categoriesData, roughStonesData] = await Promise.all([
      client.get({
        endpoint: "jewelry-categories",
        queries: {
          limit: 100,
          fields: 'id,name,slug,yomigana',
          orders: 'name',
          filters: 'isVisible[equals]true'
        },
        customRequestInit: {
          next: { revalidate: 3600, tags: ['layout'] }
        }
      }),
      client.get({
        endpoint: "rough-stones",
        queries: { limit: 100, fields: 'id,name,slug,yomigana', orders: 'name' },
        customRequestInit: {
          next: { revalidate: 3600, tags: ['layout'] }
        }
      })
    ]);

    return {
      categories: categoriesData.contents,
      roughStones: roughStonesData.contents
    };
  } catch (err) {
    console.error("Footer data fetch error:", err);
    return { categories: [], roughStones: [] };
  }
}

export default async function SiteFooter() {
  const { categories, roughStones } = await getFooterData();

  const renderLinkText = (name, yomi) => {
    return yomi ? `${yomi} (${name})` : name;
  };

  return (
    <footer className="gem-footer">
      <div className="footer-content-wrapper">

        {/* --- Brand & Main Nav --- */}
        <div className="footer-brand-section">
          <Link href="/" className="footer-logo-container">
            <span className="logo-main">Jewelism</span>
            <span className="logo-sub">MARKET</span>
          </Link>

          {/* ★修正: 英語(上・小) + 日本語(下・大) の2行構成に変更 */}
          <nav className="footer-main-nav">
            <Link href="/" className="footer-nav-item">
              <span className="nav-en">Home</span>
              <span className="nav-jp">トップページ</span>
            </Link>
            <Link href="/about" className="footer-nav-item">
              <span className="nav-en">About</span>
              <span className="nav-jp">Jewelism Marketについて</span>
            </Link>
            <Link href="/gems" className="footer-nav-item">
              <span className="nav-en">Gemstones</span>
              <span className="nav-jp">宝石カテゴリ一覧</span>
            </Link>
            <Link href="/birthstones" className="footer-nav-item">
              <span className="nav-en">Birthstones</span>
              <span className="nav-jp">誕生石から探す</span>
            </Link>
            <Link href="/rough-stones" className="footer-nav-item">
              <span className="nav-en">Rough Stones</span>
              <span className="nav-jp">原石図鑑</span>
            </Link>
            <Link href="/glossary" className="footer-nav-item">
              <span className="nav-en">Glossary</span>
              <span className="nav-jp">宝石用語集</span>
            </Link>
            <Link href="/search" className="footer-nav-item">
              <span className="nav-en">Search All</span>
              <span className="nav-jp">全てのアイテムを探す</span>
            </Link>
            <Link href="/favorites" className="footer-nav-item">
              <span className="nav-en">Favorites</span>
              <span className="nav-jp">お気に入り</span>
            </Link>
          </nav>
        </div>

        <div className="footer-divider"></div>

        {/* --- Links Section --- */}
        <div className="footer-lists-container">

          {/* Gemstones List */}
          <div className="footer-list-block">
            <details className="footer-details" open>
              <summary className="footer-list-title">
                Gemstone Index
                <svg className="accordion-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="footer-tags-grid">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/gems/${cat.slug}`} className="footer-tag-link">
                    {renderLinkText(cat.name, cat.yomigana)}
                  </Link>
                ))}
              </div>
            </details>
          </div>

          {/* Rough Stones List */}
          <div className="footer-list-block">
            <details className="footer-details" open>
              <summary className="footer-list-title">
                Rough Stones
                <svg className="accordion-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="footer-tags-grid">
                {roughStones.map((stone) => (
                  <Link key={stone.id} href={`/rough-stones/${stone.slug}`} className="footer-tag-link">
                    {renderLinkText(stone.name, stone.yomigana)}
                  </Link>
                ))}
              </div>
            </details>
          </div>

        </div>

        <div className="footer-divider"></div>

        {/* --- Bottom Utility --- */}
        <div className="footer-bottom">
          <div className="footer-legal-links">
            <Link href="/privacy-policy">プライバシーポリシー</Link>
            <Link href="/about#contact">お問い合わせ</Link>
            <Link href="/about">免責事項</Link>
          </div>
          <p className="copyright">&copy; 2025 Jewelism Market. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}