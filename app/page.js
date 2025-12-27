"use client";
import { useEffect } from "react";
import Link from "next/link";
// ※Next.jsの最適化Imageではなく、デザイン再現のため一旦通常のimgタグを使用します

export default function Home() {
  // スクロールアニメーションの設定
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });
  }, []);

  return (
    <>
      <header>
        <div className="logo">GemList</div>
        <nav>
          <ul>
            <li>Collection</li>
            <li>Journal</li>
            <li>About</li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
          <div className="orb orb-5"></div>
        </div>
        <div className="hero-content reveal">
          <h1 className="hero-title">
            Discover the Unseen <br /> Brilliance
          </h1>
          <p className="hero-subtitle">
            歴史に磨かれた一石との出会い。洗練された宝石の世界へ。
          </p>
        </div>

        {/* 無限スクロールカルーセル */}
        <div className="hero-carousel-wrapper">
          <div className="hero-carousel-track">
            {/* Set 1 */}
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80"
                alt="Diamond"
              />
              <div className="carousel-label">Diamond</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1561745027-20b015823651?w=400&q=80"
                alt="Ruby"
              />
              <div className="carousel-label">Ruby</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=400&q=80"
                alt="Emerald"
              />
              <div className="carousel-label">Emerald</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1610526881101-a1690930939c?w=400&q=80"
                alt="Sapphire"
              />
              <div className="carousel-label">Sapphire</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80"
                alt="Pearl"
              />
              <div className="carousel-label">Pearl</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1617038220319-888491695d1b?w=400&q=80"
                alt="Opal"
              />
              <div className="carousel-label">Opal</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=400&q=80"
                alt="Gold"
              />
              <div className="carousel-label">Gold</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&q=80"
                alt="Antique"
              />
              <div className="carousel-label">Antique</div>
            </div>

            {/* Set 2 (ループ用) */}
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80"
                alt="Diamond"
              />
              <div className="carousel-label">Diamond</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1561745027-20b015823651?w=400&q=80"
                alt="Ruby"
              />
              <div className="carousel-label">Ruby</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=400&q=80"
                alt="Emerald"
              />
              <div className="carousel-label">Emerald</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1610526881101-a1690930939c?w=400&q=80"
                alt="Sapphire"
              />
              <div className="carousel-label">Sapphire</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80"
                alt="Pearl"
              />
              <div className="carousel-label">Pearl</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1617038220319-888491695d1b?w=400&q=80"
                alt="Opal"
              />
              <div className="carousel-label">Opal</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=400&q=80"
                alt="Gold"
              />
              <div className="carousel-label">Gold</div>
            </div>
            <div className="carousel-card">
              <img
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&q=80"
                alt="Antique"
              />
              <div className="carousel-label">Antique</div>
            </div>
          </div>
        </div>
      </section>

      <section className="search-section reveal">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="宝石名、ブランド、色で検索..."
          />
        </div>
        <div className="search-tags">
          <span className="tag">Diamond</span>
          <span className="tag">Royal Blue Sapphire</span>
          <span className="tag">Colombian Emerald</span>
          <span className="tag">Ruby</span>
          <span className="tag">Antique</span>
        </div>
      </section>

      <section className="gallery-section">
        <div className="section-header reveal">
          <h2 className="section-title">The Collection</h2>
          <p className="section-desc">世界中から厳選された、唯一無二の輝き</p>
        </div>

        <div className="masonry-grid">
          {/* Grid Items */}
          <Link href="/item/diamond" className="grid-item reveal">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80"
              alt="Diamond Ring"
            />
            <div className="item-overlay">
              <div className="item-meta">
                <h3>ブリリアントカット・ソリティア</h3>
                <p>¥1,250,000</p>
              </div>
            </div>
          </Link>

          <Link href="/item/gold" className="grid-item reveal">
            <img
              src="https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=600&q=80"
              alt="Gold Jewelry"
            />
            <div className="item-overlay">
              <div className="item-meta">
                <h3>K18 ヴィンテージブレスレット</h3>
                <p>¥480,000</p>
              </div>
            </div>
          </Link>

          <Link href="/item/emerald" className="grid-item reveal">
            <img
              src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=600&q=80"
              alt="Emerald"
            />
            <div className="item-overlay">
              <div className="item-meta">
                <h3>コロンビア産エメラルド</h3>
                <p>¥890,000</p>
              </div>
            </div>
          </Link>

          <Link href="/item/pearl" className="grid-item reveal">
            <img
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80"
              alt="Pearls"
            />
            <div className="item-overlay">
              <div className="item-meta">
                <h3>アコヤ真珠 2連ネックレス</h3>
                <p>¥320,000</p>
              </div>
            </div>
          </Link>

          <Link href="/item/tanzanite" className="grid-item reveal">
            <img
              src="https://images.unsplash.com/photo-1603561289423-68f5d0d69114?w=600&q=80"
              alt="Blue Stone"
            />
            <div className="item-overlay">
              <div className="item-meta">
                <h3>タンザナイト ルース (3.5ct)</h3>
                <p>¥210,000</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="journal-section">
        <div className="section-header reveal">
          <h2 className="section-title">The Journal</h2>
          <p className="section-desc">宝石の歴史、選び方、そして物語</p>
        </div>
        <div className="journal-grid">
          <article className="journal-card reveal">
            <img
              src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&q=80"
              alt="History"
              className="journal-thumb"
            />
            <span className="journal-cat">History</span>
            <h3 className="journal-title">英国王室とサファイアの系譜</h3>
            <p className="journal-excerpt">
              なぜ王室はダイヤモンドではなくサファイアを選んだのか。19世紀から続く伝統と象徴の意味を紐解きます。
            </p>
          </article>
          <article className="journal-card reveal">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"
              alt="Guide"
              className="journal-thumb"
            />
            <span className="journal-cat">Buyer's Guide</span>
            <h3 className="journal-title">「一生もの」の真珠の選び方</h3>
            <p className="journal-excerpt">
              テリ、巻き、キズ。プロの鑑定士がチェックする3つのポイントと、メンテナンス方法について。
            </p>
          </article>
          <article className="journal-card reveal">
            <img
              src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80"
              alt="Trend"
              className="journal-thumb"
            />
            <span className="journal-cat">Investment</span>
            <h3 className="journal-title">資産としてのカラーダイヤモンド</h3>
            <p className="journal-excerpt">
              近年価格高騰が続くピンクダイヤモンド。投資対象としての宝石の魅力とリスクを解説します。
            </p>
          </article>
        </div>
      </section>

      <footer>
        <div className="footer-logo">GemList</div>
        <div className="footer-links">
          <Link href="#">ブランドについて</Link>
          <Link href="#">お問い合わせ</Link>
          <Link href="#">プライバシーポリシー</Link>
          <Link href="#">特定商取引法に基づく表記</Link>
        </div>
        <p className="copyright">&copy; 2025 GemList. All Rights Reserved.</p>
      </footer>
    </>
  );
}