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
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-navy to-gold opacity-80"
                                style={{ width: `${pctRight}%` }}
                            />
                            {/* Center Marker */}
                            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/80 transform -translate-x-1/2 z-10" />
                        </div>

                        {/* Labels */}
                        <div className="flex justify-between mt-1 text-[10px] font-jp text-gray-500 font-medium">
                            <span>{ax.left} {pctLeft}%</span>
                            <span>{ax.right} {pctRight}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
