/* components/RichTextRenderer.js */
import Link from "next/link";
import Image from "next/image";

// ダミーの商品カードコンポーネント（実際はAPIから商品データを引くか、埋め込みコードを使う）
const ProductCardEmbed = ({ url }) => {
  // 本来はここで url から商品IDを特定し、swrなどでデータを非同期取得して表示します
  return (
    <div className="product-embed-card">
      <div className="embed-thumb">
        {/* ダミー画像 */}
        <div style={{width: '100%', height: '100%', background: '#eee'}}></div>
      </div>
      <div className="embed-info">
        <span className="embed-label">PICK UP ITEM</span>
        <h4 className="embed-title">Loading Product Info...</h4>
        <p className="embed-url">{url}</p>
        <div className="embed-btn">View Item</div>
      </div>
    </div>
  );
};

export default function RichTextRenderer({ content }) {
  if (!content) return null;

  // 簡易実装: dangerouslySetInnerHTML を使う
  // ※将来的に「URLの自動展開」をする場合は、ここで html-react-parser を導入し、
  // <a href="/items/xxx">...</a> を検知して <ProductCardEmbed /> に差し替える処理を書きます。
  
  return (
    <div 
      className="rich-text-body"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}