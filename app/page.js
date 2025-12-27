import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
          <div className="orb orb-5"></div>
        </div>
        
        <div className="hero-content reveal active">
          <h1 className="hero-title">Discover the Unseen <br /> Brilliance</h1>
          <p className="hero-subtitle">歴史に磨かれた一石との出会い。洗練された宝石の世界へ。</p>
        </div>

        {/* Infinite Loop Carousel */}
        <div className="hero-carousel-wrapper">
          <div className="hero-carousel-track">
            {/* Set 1 */}
            <div className="carousel-card">
              <div className="carousel-label">Diamond</div>
            </div>
            <div className="carousel-card">
              <div className="carousel-label">Ruby</div>
            </div>
            <div className="carousel-card">
              <div className="carousel-label">Sapphire</div>
            </div>
            <div className="carousel-card">
              <div className="carousel-label">Emerald</div>
            </div>
             {/* Set 2 (Loop用) */}
             <div className="carousel-card">
              <div className="carousel-label">Diamond</div>
            </div>
            <div className="carousel-card">
              <div className="carousel-label">Ruby</div>
            </div>
            <div className="carousel-card">
              <div className="carousel-label">Sapphire</div>
            </div>
            <div className="carousel-card">
              <div className="carousel-label">Emerald</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery */}
      <section className="gallery-section">
        <div className="section-header reveal active">
          <h2 className="section-title">The Collection</h2>
          <p className="section-desc">世界中から厳選された、唯一無二の輝き</p>
        </div>

        <div className="masonry-grid">
           {/* 仮のアイテム */}
          <div className="grid-item reveal active">
            <div className="item-overlay">
              <div className="item-meta">
                <h3>ブリリアントカット・ソリティア</h3>
                <p>¥1,250,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}