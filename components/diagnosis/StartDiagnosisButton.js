'use client';

import { useDiagnosis } from '@/contexts/DiagnosisContext';

export default function StartDiagnosisButton() {
    const { openDiagnosis, engine } = useDiagnosis();

    const handleClick = () => {
        if (engine && engine.startDiagnosis) {
            engine.startDiagnosis(); // 状態をリセットして開始
            openDiagnosis(); // モーダルを開く
        }
    };

    return (
        <button
            onClick={handleClick}
            className="px-10 py-4 bg-navy text-white font-jp tracking-widest hover:bg-navy-dark transition-colors shadow-lg rounded-full"
        >
            宝石診断を行う
        </button>
    );
}
