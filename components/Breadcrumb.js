/* components/Breadcrumb.js */
import Link from "next/link";

export default function Breadcrumb({ items }) {
  // items: [{ label: "Home", path: "/" }, { label: "...", path: "..." }]
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumb">
      <div className="breadcrumb-inner">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          // ★修正: リンクにする条件を明確化
          // 1. 最後ではない (!isLast)
          // 2. pathが存在する (item.path)
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
  );
}