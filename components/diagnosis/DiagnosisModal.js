'use client';

import { useDiagnosis } from '@/contexts/DiagnosisContext';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeableCard from './SwipeableCard';
import { useEffect, useRef } from 'react'; // ★ useRef を追加
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function DiagnosisModal() {
    const { isOpen, closeDiagnosis, engine } = useDiagnosis();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // ★追加: 診断を開始した時のパスを記憶するための Ref
    const startPathRef = useRef(pathname);

    const {
        currentQuestion,
        handleAnswer,
        progress,
        phase,
        getResults,
        goBack,
        startDiagnosis,
        currentQuestionIndex
    } = engine || {};

    // ★追加: モーダルが開いたときや診断開始時に、現在のパスを記録
    useEffect(() => {
        if (isOpen && phase === 'ready') {
            startPathRef.current = pathname;
        }
    }, [isOpen, phase, pathname]);

    // 1. 診断終了時の処理：ページ遷移トリガー
    useEffect(() => {
        if (phase === 'result' || phase === 'phase1_result') {
            const result = getResults();

            // URLパラメータの構築
            const params = new URLSearchParams();
            const scoreValues = Object.values(result.scores).join(',');
            params.set('s', scoreValues);

            if (phase === 'result') {
                params.set('mode', 'deep');
            }

            const slug = result.gemData.slug || 'diamond';
            const targetUrl = `/gems/${slug}/diagnosis?${params.toString()}`;

            // Analyzing表示のための待機時間後、遷移を実行
            const timer = setTimeout(() => {
                // ここでは閉じずに遷移だけする
                router.push(targetUrl);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [phase, getResults, router]);

    // 2. ページ遷移完了（URL変化）を検知してモーダルを閉じる
    useEffect(() => {
        // 結果表示フェーズであり、かつ「現在のパス」が「開始時のパス」と異なる場合のみ閉じる
        if (isOpen && (phase === 'result' || phase === 'phase1_result')) {
            if (pathname !== startPathRef.current) {
                closeDiagnosis();
            }
        }
    }, [pathname, isOpen, phase, closeDiagnosis]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* 背景 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={closeDiagnosis}
                        className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm"
                    />

                    {/* コンテンツ */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full max-w-lg flex flex-col items-center justify-center min-h-[500px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 閉じるボタン (Analyzing中は非表示) */}
                        {(phase !== 'phase1_result' && phase !== 'result') && (
                            <button
                                onClick={closeDiagnosis}
                                className="absolute top-0 right-0 p-2 text-white/50 hover:text-white transition-colors z-50"
                            >
                                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">✕</div>
                            </button>
                        )}

                        {/* A. スタート画面 */}
                        {phase === 'ready' && (
                            <div className="text-center p-8 w-full animate-fade-in">
                                <div className="mb-8 relative inline-block">
                                    <div className="text-6xl">💎</div>
                                    <div className="absolute -inset-4 border border-gold/30 rounded-full animate-[spin_10s_linear_infinite]" />
                                </div>
                                <h2 className="font-en text-3xl text-gold mb-4 tracking-widest">Jewelism Diagnosis</h2>
                                <p className="font-jp text-white/80 leading-loose text-sm mb-10">
                                    深層心理から、あなたの魂が共鳴する<br />
                                    「守護石」を導き出します。
                                </p>
                                <button
                                    onClick={startDiagnosis}
                                    className="px-12 py-4 bg-gold text-navy-dark font-jp tracking-widest hover:bg-gold-light transition-colors shadow-lg rounded-sm"
                                >
                                    診断をはじめる
                                </button>
                            </div>
                        )}

                        {/* B. プレイ画面 */}
                        {(phase === 'playing' || phase === 'deep_dive') && (
                            <>
                                <div className="w-full flex flex-col items-center mb-6 px-2 text-white/80">
                                    <span className="font-en text-xs tracking-[0.2em] uppercase text-gold mb-4">
                                        Phase {phase === 'deep_dive' ? '2 : Deep Analysis' : '1 : Basic Analysis'}
                                    </span>
                                    <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="absolute top-0 left-0 h-full bg-gold shadow-[0_0_10px_rgba(197,163,101,0.5)]"
                                        />
                                    </div>
                                </div>

                                <div className="w-full relative z-10 mb-8 min-h-[400px] flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {currentQuestion && (
                                            <SwipeableCard
                                                key={currentQuestion.id}
                                                question={currentQuestion}
                                                onSwipe={handleAnswer}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex gap-4 w-full px-4">
                                    <button onClick={() => handleAnswer('left')} className="flex-1 py-4 border border-white/20 rounded-full text-white font-en text-sm tracking-widest hover:bg-white/10 transition-colors group">
                                        <span className="text-white/50 group-hover:text-white mr-2 transition-colors">←</span> NO
                                    </button>
                                    <button onClick={() => handleAnswer('right')} className="flex-1 py-4 bg-gold text-navy-dark font-en text-sm tracking-widest rounded-full shadow-lg hover:bg-gold-light transition-colors group">
                                        YES <span className="text-navy-dark/50 group-hover:text-navy-dark ml-2 transition-colors">→</span>
                                    </button>
                                </div>
                                <button
                                    onClick={goBack}
                                    className={`mt-6 px-6 py-2 rounded-full bg-black/20 border border-white/10 text-white/60 text-xs hover:bg-black/40 hover:text-white hover:border-white/30 transition-all duration-300 ${currentQuestionIndex === 0 ? 'invisible pointer-events-none' : ''
                                        }`}
                                >
                                    <span className="mr-2">↩︎</span>
                                    ひとつ前の質問に戻る
                                </button>
                            </>
                        )}

                        {/* C. 遷移待機画面 */}
                        {(phase === 'phase1_result' || phase === 'result') && (
                            <div className="text-center text-white p-10 animate-fade-in">
                                <div className="mb-6 relative inline-block">
                                    <div className="w-16 h-16 border-t-2 border-r-2 border-gold rounded-full animate-spin"></div>
                                </div>
                                <div className="text-2xl font-en text-gold mb-4 tracking-widest">Analyzing...</div>
                                <p className="font-jp text-sm opacity-80">診断結果ページへ移動します</p>
                            </div>
                        )}

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}