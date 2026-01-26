/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // app/layout.js で定義された変数を使用
                jp: ['var(--font-jp)', 'serif'],
                en: ['var(--font-en)', 'serif'],
            },
            colors: {
                // Jewelism Market ブランドカラー
                navy: {
                    DEFAULT: '#0058a3', // リンク色やアクセントに使用
                    dark: '#004480',    // ホバー時など
                },
                gold: {
                    DEFAULT: '#c5a365', // 高級感の演出に使用
                    light: '#e0c895',
                },
                // 背景色 (globals.cssの変数と合わせる)
                base: '#F9F7F2',
            },
            // 高級感のある緩やかなアニメーション定義
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'float': 'float 20s infinite ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '50%': { transform: 'translate(0, -10px)' },
                }
            }
        },
    },
    plugins: [],
};