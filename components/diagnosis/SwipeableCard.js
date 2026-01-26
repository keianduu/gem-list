'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

export default function SwipeableCard({ question, onSwipe }) {
    // ドラッグの移動量を管理する値
    const x = useMotionValue(0);

    // ドラッグ量に応じてカードを回転させる（最大15度）
    const rotate = useTransform(x, [-200, 200], [-15, 15]);

    // ドラッグ量に応じてカードの透明度を下げる（端に行くと消える）
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // ドラッグ量に応じて背景に滲み出る色（左:ネイビー、右:ゴールド）
    const overlayColor = useTransform(
        x,
        [-150, 0, 150],
        ['rgba(0, 88, 163, 0.2)', 'rgba(255, 255, 255, 0)', 'rgba(197, 163, 101, 0.2)']
    );

    // スワイプ判定のしきい値
    const SWIPE_THRESHOLD = 100;

    const handleDragEnd = (event, info) => {
        if (info.offset.x > SWIPE_THRESHOLD) {
            onSwipe('right'); // YES
        } else if (info.offset.x < -SWIPE_THRESHOLD) {
            onSwipe('left'); // NO
        }
        // しきい値を超えなかった場合は、Framer Motionが自動で元の位置に戻します
    };

    return (
        <div className="relative w-full max-w-md perspective-1000">
            <AnimatePresence mode="wait">
                <motion.div
                    key={question.id}
                    // --- アニメーション設定 ---
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0, x: 0, rotate: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20, transition: { duration: 0.3 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    // --- ドラッグ設定 ---
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }} // カードが飛んでいかないように制限
                    dragElastic={0.7} // 引っ張りの抵抗感
                    onDragEnd={handleDragEnd}
                    style={{ x, rotate, opacity }}
                    // --- スタイル設定 ---
                    className="relative w-full bg-white rounded-2xl shadow-2xl border border-gold/20 overflow-hidden cursor-grab active:cursor-grabbing"
                >
                    {/* 背景に滲み出る色のオーバーレイ */}
                    <motion.div
                        style={{ backgroundColor: overlayColor }}
                        className="absolute inset-0 pointer-events-none z-0 transition-colors duration-300"
                    />

                    {/* カードの中身 */}
                    <div className="relative z-10 p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px]">

                        {/* 装飾的なヘッダー */}
                        <div className="mb-8 text-center">
                            <span className="font-en text-gold/70 text-xs tracking-[0.3em] uppercase block mb-2">
                                Question
                            </span>
                            <div className="w-8 h-[1px] bg-gold/30 mx-auto"></div>
                        </div>

                        {/* 質問文 */}
                        <h3 className="font-jp text-xl md:text-2xl text-navy-dark leading-relaxed text-center font-medium mb-10">
                            {question.text}
                        </h3>

                        {/* YES / NO インジケーター */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-between px-8 pointer-events-none">
                            <div className="flex flex-col items-center gap-1 opacity-60 font-en">
                                <div className="w-10 h-10 rounded-full border border-navy/30 flex items-center justify-center text-navy">
                                    ←
                                </div>
                                <span className="text-xs tracking-widest text-navy">NO</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-60 font-en">
                                <div className="w-10 h-10 rounded-full border border-gold/50 flex items-center justify-center text-gold-dark">
                                    →
                                </div>
                                <span className="text-xs tracking-widest text-gold-dark">YES</span>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </AnimatePresence>

            {/* 背景にある次のカードのダミー（奥行き演出用） */}
            <div className="absolute top-4 inset-x-4 h-full bg-white/80 rounded-2xl border border-gold/10 shadow-xl -z-10 scale-[0.95]"></div>
            <div className="absolute top-8 inset-x-8 h-full bg-white/60 rounded-2xl border border-gold/5 shadow-lg -z-20 scale-[0.9]"></div>
        </div>
    );
}