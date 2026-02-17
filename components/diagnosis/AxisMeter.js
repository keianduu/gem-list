'use client';

import { blendSentence } from '@/libs/diagnosisUtils';
import { AXES_DEF } from '@/libs/diagnosisData';

export default function AxisMeter({ axisPercent }) {
    // axisPercent: { world: 60, orient: 40, ... }

    if (!axisPercent) return null;

    return (
        <div className="w-full space-y-6">
            {AXES_DEF.map((ax) => {
                const pctRight = axisPercent[ax.key] || 50;
                const pctLeft = 100 - pctRight;
                const description = blendSentence(ax.key, pctRight);

                // Determine dominance (50% treats as Right dominant or neutral logic)
                const isRightDominant = pctRight > 50; // Just > 50? Or >=? User said 50/50 doesn't matter.
                // Let's explicitly handle styling variables.

                const barWidth = isRightDominant ? pctRight : pctLeft;
                const barPositionClass = isRightDominant ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r";
                // Gradient: Always from-navy (outer edge) to-gold (inner/center) seems appropriate for "energy" 
                // but user just said "gradient". Let's stick to consistent direction or intuitive "filling from edge".
                // If I use to-l for right side, it goes Right(Navy) -> Left(Gold). 
                // If I use to-r for left side, it goes Left(Navy) -> Right(Gold).
                // This creates a symmetrical "Navy at edges, Gold at center" feel? 
                // Or maybe the other way around? 
                // Let's try `from-navy to-gold` for both `to-r` (L->R) and `to-l` (R->L).

                return (
                    <div key={ax.key} className="bg-white/40 p-4 rounded-xl border border-white/50 backdrop-blur-sm shadow-sm">
                        {/* Header */}
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-en text-gray-500 uppercase tracking-wider">{ax.name}</span>
                        </div>

                        <p className="text-[11px] text-gray-600 font-jp mb-3 leading-relaxed">
                            {description}
                        </p>

                        {/* Bar */}
                        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`absolute top-0 h-full from-navy to-gold opacity-80 ${barPositionClass}`}
                                style={{ width: `${barWidth}%` }}
                            />
                        </div>

                        {/* Labels (Fixed Position) */}
                        <div className="flex justify-between mt-1 text-[10px] font-jp font-medium">
                            {/* Left Label */}
                            <span className={!isRightDominant ? "text-navy font-bold" : "text-gray-400"}>
                                {ax.left} {pctLeft}%
                            </span>
                            {/* Right Label */}
                            <span className={isRightDominant || pctRight === 50 ? "text-navy font-bold" : "text-gray-400"}>
                                {ax.right} {pctRight}%
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
