/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io', // MicroCMS用
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash用（ダミー画像を使わなくなったら消してOK）
      },
    ],
  },
};

export default nextConfig;