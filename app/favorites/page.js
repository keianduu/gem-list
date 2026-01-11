/* app/favorites/page.js */
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumb from "@/components/Breadcrumb";
import FavoritesContent from "@/components/FavoritesContent"; // ★新規コンポーネントをインポート
import { PAGE_METADATA } from "@/libs/meta";

export const metadata = {
  title: PAGE_METADATA.favorites.title,
  description: PAGE_METADATA.favorites.description,
};

export default function FavoritesPage() {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Favorites", path: "/favorites" }
  ];

  return (
    <>
      <SiteHeader />

      <main className="journal-main">
        {/* クライアント側の処理はここに分離 */}
        <FavoritesContent />
      </main>

      <Breadcrumb items={breadcrumbItems} />
      
      {/* サーバーコンポーネントとしてレンダリングされるのでエラーが解消します */}
      <SiteFooter />
    </>
  );
}