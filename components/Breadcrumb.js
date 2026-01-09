import Link from "next/link";

export default function Breadcrumb({ items }) {
  // items: [{ label: "Home", path: "/" }, { label: "...", path: "..." }]
  if (!items || items.length === 0) return null;

  // ▼▼▼ JSON-LDデータの生成 ▼▼▼
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      // pathが存在する場合のみ、絶対URLとして出力
      ...(item.path ? { "item": `https://jewelism-market.com${item.path}` } : {})
    }))
  };

  return (
    <>
      {/* ▼▼▼ UI表示エリア ▼▼▼ */}
      <nav className="breadcrumb">
        <div className="breadcrumb-inner">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            // リンクにする条件: 最後ではなく、かつ path が存在する場合
            const isLink = !isLast && item.path;

            return (
              <span key={index} style={{ display: 'contents' }}>
                {index > 0 && <span className="separator">/</span>}
                
                {isLink ? (
                  <Link href={item.path}>{item.label}</Link>
                ) : (
                  <span className="current">{item.label}</span>
                )}
              </span>
            );
          })}
        </div>
      </nav>

      {/* ▼▼▼ 構造化データ（JSON-LD）の出力 ▼▼▼ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}