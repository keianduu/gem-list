/* components/SiteFooter.js */
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="gem-footer">
      <Link href="/" className="footer-logo-container">
        <span className="logo-main">Jewelism</span>
        <span className="logo-sub">MARKET</span>
      </Link>
      <div className="footer-links">
         <Link href="#">ブランドについて</Link>
         <Link href="/privacy-policy">プライバシーポリシー</Link>
         <Link href="/about">運営者情報・免責事項</Link>
      </div>
      <p className="copyright">&copy; 2025 Jewelism Market. All Rights Reserved.</p>
    </footer>
  );
}