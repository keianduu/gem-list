'use client';

import { useDiagnosis } from '@/contexts/DiagnosisContext';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeableCard from './SwipeableCard';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function DiagnosisModal() {
    const { isOpen, closeDiagnosis, engine } = useDiagnosis();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams(); // 追加

    // フルパス（クエリ含む）で比較して、ページ内遷移(DeepDive結果)も検知できるようにする
    const currentFullPath = `${pathname}?${searchParams.toString()}`;
    const startPathRef = useRef(currentFullPath);

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

    const totalQuestions = phase === 'deep_dive' ? 30 : 15;
    const currentNum = (currentQuestionIndex || 0) + 1;

    useEffect(() => {
        if (isOpen) {
            // モーダルが開いた時点、またはフェーズ開始時点のパスを記録
            startPathRef.current = currentFullPath;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (phase === 'result' || phase === 'phase1_result') {
            const result = getResults();
            const params = new URLSearchParams();

            const axisValues = [
                result.axisPercent.world,
                result.axisPercent.orient,
                result.axisPercent.judge,
                result.axisPercent.approach
            ].join(',');
            params.set('ax', axisValues);

            const scoreValues = Object.values(result.scores).join(',');
            params.set('s', scoreValues);

            if (phase === 'result') {
                params.set('mode', 'deep');
            }

            const slug = result.gemData?.slug || 'diamond';
            const targetUrl = `/gems/${slug}/diagnosis?${params.toString()}`;

            const timer = setTimeout(() => {
                router.push(targetUrl);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [phase, getResults, router]);

    useEffect(() => {
        if (isOpen && (phase === 'result' || phase === 'phase1_result')) {
            // パスまたはクエリパラメータが変わったら閉じる
            if (currentFullPath !== startPathRef.current) {
                closeDiagnosis();
            }
        }
    }, [currentFullPath, isOpen, phase, closeDiagnosis]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={closeDiagnosis}
                        className="absolute inset-0 bg-navy-dark/95 backdrop-blur-sm"
                    />

                    {(phase !== 'phase1_result' && phase !== 'result') && (
                        <button
                            onClick={closeDiagnosis}
                            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-[10000]"
                        >
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-navy-dark/50">✕</div>
                        </button>
                    )}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full max-w-lg flex flex-col items-center justify-center min-h-[500px]"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                                <div className="w-full flex flex-col items-center mb-8 px-2 text-white/80">
                                    <div className="flex items-end gap-3 mb-4 font-en text-gold">
                                        {/* 文字サイズ拡大: text-xs -> text-sm */}
                                        <span className="text-sm tracking-[0.2em] uppercase opacity-70">
                                            Phase {phase === 'deep_dive' ? '2 : Deep' : '1 : Basic'}
                                        </span>
                                        {/* 文字サイズ拡大: text-sm -> text-xl */}
                                        <span className="text-xl font-bold tracking-widest leading-none">
                                            Q.{currentNum} <span className="text-sm opacity-50 font-normal">/ {totalQuestions}</span>
                                        </span>
                                    </div>

                                    <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="absolute top-0 left-0 h-full bg-gold shadow-[0_0_10px_rgba(197,163,101,0.5)]"
                                        />
                                    </div>
                                </div>

                                <div className="w-full relative z-10 mb-6 flex items-center justify-center">
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

                                {/* Backボタン: 文字サイズ拡大 */}
                                <button
                                    onClick={goBack}
                                    className={`mt-2 px-8 py-3 rounded-full text-white/60 text-sm hover:text-white hover:bg-white/10 transition-all ${currentQuestionIndex === 0 ? 'invisible pointer-events-none' : ''
                                        }`}
                                >
                                    <span className="mr-2">↩︎</span>
                                    Back
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