import "./globals.css";

export const metadata = {
  title: "GemList",
  description: "Discover the Unseen Brilliance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}