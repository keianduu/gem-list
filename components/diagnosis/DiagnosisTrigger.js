// components/diagnosis/DiagnosisTrigger.js
'use client';

import { useDiagnosis } from '@/contexts/DiagnosisContext';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // 追加
import { useEffect } from 'react'; // 追加

export default function DiagnosisTrigger() {
    const { openDiagnosis } = useDiagnosis();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // URLパラメータ (?diagnosis=open) の監視
    useEffect(() => {
        const diagnosisParam = searchParams.get('diagnosis');
        if (diagnosisParam === 'open' || diagnosisParam === 'true') {
            openDiagnosis();


        }
    }, [searchParams, openDiagnosis, pathname, router]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="fixed left-4 bottom-[20px] z-40" // Refineボタンのボトム位置(20px前後想定)に合わせる
        >
            <button
                onClick={openDiagnosis}
                className="group relative flex items-center gap-3 bg-navy pl-1 pr-6 py-1 rounded-full shadow-lg overflow-hidden transition-all duration-300 hover:pr-8"
            >
                {/* アイコン部分：ダイヤモンドのような多角形をイメージ */}
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 fill-white group-hover:scale-110 transition-transform duration-500"
                    >
                        <path d="M12 2L4.5 9L12 22L19.5 9L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 2L9 9L12 13L15 9L12 2Z" />
                    </svg>
                </div>

                {/* テキスト部分 */}
                <div className="flex flex-col items-start">
                    <span className="font-en text-[10px] text-gold-light leading-none tracking-[0.15em] uppercase">
                        Diagnosis
                    </span>
                    <span className="font-jp text-sm text-white tracking-wider font-light">
                        宝石診断
                    </span>
                </div>

                {/* ホバー時の装飾：ゴールドの光が走る演出 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </button>
        </motion.div>
    );
}