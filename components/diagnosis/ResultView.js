'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ResultView({ result, onClose }) {
    // データがない場合のガード
    if (!result || !result.gemData) return null;

    const { gemData } = result;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white w-full max-w-md rounded-lg overflow-hidden shadow-2xl relative"
        >
            {/* 上部：宝石のイメージエリア */}
            <div className="bg-navy p-8 text-center relative overflow-hidden">
                {/* 背景装飾 */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,theme('colors.gold.DEFAULT')_0%,transparent_70%)] animate-pulse" />
                </div>

                <div className="relative z-10">
                    <p className="font-en text-gold text-xs tracking-[0.3em] uppercase mb-4">
                        Your Guardian Gem
                    </p>

                    {/* 宝石名 */}
                    <h2 className="font-jp text-3xl text-white font-medium mb-2 tracking-wide">
                        {gemData.name}
                    </h2>
                    <p className="font-en text-white/60 text-sm tracking-wider uppercase mb-6">
                        {gemData.id}
                    </p>

                    {/* 宝石の擬似ビジュアル（画像があればimgタグに差し替え） */}
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4">
                        <span className="text-4xl">💎</span>
                    </div>
                </div>
            </div>

            {/* 下部：詳細テキストエリア */}
            <div className="p-8 bg-white">
                {/* キャッチコピー */}
                <h3 className="font-jp text-lg text-navy-dark mb-6 text-center leading-relaxed font-medium border-b border-gold/30 pb-4">
                    {gemData.catchCopy}
                </h3>

                {/* 解説文 */}
                <div className="font-jp text-sm text-gray-600 leading-loose mb-8 h-[200px] overflow-y-auto custom-scrollbar pr-2">
                    <p className="mb-4">{gemData.summary}</p>
                    <p>{gemData.nature}</p>
                </div>

                {/* アクションボタン */}
                <div className="flex flex-col gap-3">
                    {/* 詳細ページへ飛ぶボタン（slugがあれば） */}
                    <Link
                        href={`/gems/${gemData.slug || '#'}`} // slugがない場合は仮で#
                        onClick={onClose}
                        className="w-full py-4 bg-navy text-white font-jp text-sm tracking-widest text-center hover:bg-navy-dark transition-colors"
                    >
                        この宝石を詳しく見る
                    </Link>

                    <button
                        onClick={onClose}
                        className="w-full py-3 text-gray-400 font-en text-xs tracking-widest hover:text-navy transition-colors"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </motion.div>
    );
}