'use client';

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

export default function SwipeableCard({ question, onSwipe }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    const overlayColor = useTransform(
        x,
        [-150, 0, 150],
        ['rgba(243, 244, 246, 0.9)', 'rgba(255, 255, 255, 0)', 'rgba(255, 251, 235, 0.9)']
    );

    const handleDragEnd = (event, info) => {
        const SWIPE_THRESHOLD = 100;
        if (info.offset.x > SWIPE_THRESHOLD) {
            onSwipe('right');
        } else if (info.offset.x < -SWIPE_THRESHOLD) {
            onSwipe('left');
        }
    };

    return (
        <div className="relative w-full max-w-md perspective-1000 h-[480px]">
            {/* --- 重なり表現（ダミーカード） --- */}
            {/* 3枚目 (一番後ろ): 大きく下にずらす */}
            <div
                className="absolute inset-0 bg-white/20 rounded-3xl border border-white/10 shadow transform translate-y-10 scale-90"
                style={{ zIndex: 0 }}
            />
            {/* 2枚目 (真ん中): 少し下にずらす */}
            <div
                className="absolute inset-0 bg-white/40 rounded-3xl border border-white/20 shadow-lg transform translate-y-5 scale-95"
                style={{ zIndex: 10 }}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0, x: 0, rotate: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={handleDragEnd}
                    style={{ x, rotate, opacity, zIndex: 20 }} // メインカードは最前面
                    className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col"
                >
                    <motion.div
                        style={{ backgroundColor: overlayColor }}
                        className="absolute inset-0 pointer-events-none z-0"
                    />

                    {/* 質問文エリア */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                        <span className="font-en text-gold text-[10px] tracking-[0.3em] uppercase mb-6 block">
                            Question
                        </span>
                        {/* インラインスタイルで色を強制 */}
                        <h3 className="font-jp text-2xl md:text-3xl font-medium leading-relaxed" style={{ color: '#111827' }}>
                            {question.text}
                        </h3>
                    </div>

                    {/* 選択肢エリア */}
                    <div className="relative z-10 w-full grid grid-cols-2 border-t border-gray-100 h-[180px] bg-white">

                        {/* --- 左: 選択肢B (NO/Left) --- */}
                        <div
                            onClick={() => onSwipe('left')}
                            className="relative flex flex-col justify-start pt-8 pb-4 px-5 bg-gray-50/80 border-r border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors group active:bg-gray-200"
                        >
                            {/* ヘッダー: 左寄せ */}
                            <div className="flex items-center gap-2 mb-3 w-full">
                                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="font-en text-gray-500 text-xs tracking-widest font-bold">B</span>
                            </div>

                            {/* テキスト: 左寄せ & インラインスタイルで色を強制 */}
                            <p
                                className="font-jp text-sm md:text-base leading-relaxed font-medium text-left"
                                style={{ color: '#1f2937' }} // gray-800相当
                            >
                                {question.b}
                            </p>
                        </div>

                        {/* --- 右: 選択肢A (YES/Right) --- */}
                        <div
                            onClick={() => onSwipe('right')}
                            className="relative flex flex-col justify-start pt-8 pb-4 px-5 bg-white cursor-pointer hover:bg-yellow-50 transition-colors group active:bg-yellow-100"
                        >
                            {/* ヘッダー: 右寄せ */}
                            <div className="flex items-center justify-end gap-2 mb-3 w-full">
                                <span className="font-en text-gold text-xs tracking-widest font-bold">A</span>
                                <div className="text-gold group-hover:text-gold-dark transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            {/* テキスト: 左寄せ & インラインスタイルで色を強制 */}
                            <p
                                className="font-jp text-sm md:text-base leading-relaxed font-medium text-left"
                                style={{ color: '#004480' }} // navy-dark相当
                            >
                                {question.a}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}