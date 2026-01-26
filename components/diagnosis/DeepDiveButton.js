// components/diagnosis/DeepDiveButton.js
'use client';

import { useDiagnosis } from '@/contexts/DiagnosisContext';

export default function DeepDiveButton() {
    const { openDiagnosis, engine } = useDiagnosis();

    const handleClick = () => {
        // コンテキストの関数を呼び出し
        if (engine && engine.startDeepDive) {
            engine.startDeepDive(); // フェーズを deep_dive に変更
            openDiagnosis(); // モーダルを開く
        } else {
            console.error("Diagnosis engine not ready");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="px-10 py-4 bg-navy text-white font-jp tracking-widest hover:bg-navy-dark transition-colors shadow-lg rounded-full"
        >
            Deep Dive (詳細診断へ)
        </button>
    );
}