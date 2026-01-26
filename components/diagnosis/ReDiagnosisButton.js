'use client';

import { useDiagnosis } from '@/contexts/DiagnosisContext';

export default function ReDiagnosisButton() {
    const { openDiagnosis, engine } = useDiagnosis();

    const handleReDiagnosis = () => {
        if (engine && engine.startDiagnosis) {
            engine.startDiagnosis(); // 状態をリセット
            openDiagnosis(); // モーダルを開く
        }
    };

    return (
        <button
            onClick={handleReDiagnosis}
            // hover:border-[#c5a365] を明示的に指定し、ボーダー色も維持
            className="group relative px-8 py-3 overflow-hidden rounded-full bg-transparent border border-[#c5a365] text-[#c5a365] transition-all duration-300 hover:text-white hover:border-[#c5a365] hover:shadow-md"
        >
            {/* 背景アニメーション: -z-10 を削除し、通常配置に */}
            <span className="absolute inset-0 w-full h-full bg-[#c5a365] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>

            {/* テキスト: z-10 を追加して、背景より確実に手前に表示 */}
            <span className="relative z-10 font-jp text-sm tracking-widest">
                もう一度診断する
            </span>
        </button>
    );
}