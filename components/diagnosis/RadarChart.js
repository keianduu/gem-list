'use client';

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function RadarChart({ scores, gemScores, isDark = false }) {
    const safeScores = scores || {};
    const safeGemScores = gemScores || {}; // 宝石の理想スコア

    const labels = [
        '情熱 (A)', '知性 (B)', '調和 (C)', '活力 (D)',
        '自由 (E)', '精神 (F)', '純粋 (G)', '変革 (H)'
    ];

    const userData = [
        safeScores.A || 0, safeScores.B || 0, safeScores.C || 0, safeScores.D || 0,
        safeScores.E || 0, safeScores.F || 0, safeScores.G || 0, safeScores.H || 0,
    ];

    const gemData = [
        safeGemScores.A || 0, safeGemScores.B || 0, safeGemScores.C || 0, safeGemScores.D || 0,
        safeGemScores.E || 0, safeGemScores.F || 0, safeGemScores.G || 0, safeGemScores.H || 0,
    ];

    const textColor = isDark ? 'rgba(255, 255, 255, 0.9)' : '#333';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(200, 200, 200, 0.3)';
    const pointColor = '#c5a365'; // Gold

    const data = {
        labels: labels,
        datasets: [
            // 1. ユーザーのチャート (前面・ゴールド・塗りつぶし)
            {
                label: 'You',
                data: userData,
                backgroundColor: 'rgba(197, 163, 101, 0.4)', // 少し濃いめにして宝石側と区別
                borderColor: pointColor,
                borderWidth: 2,
                pointBackgroundColor: pointColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: pointColor,
                order: 1, // 前面に表示
            },
            // 2. 宝石のチャート (背面・グレー・線のみ)
            {
                label: 'Gemstone',
                data: gemData,
                backgroundColor: 'rgba(200, 200, 200, 0.1)',
                borderColor: 'rgba(150, 150, 150, 0.5)', // グレーの線
                borderWidth: 1,
                borderDash: [5, 5], // 破線にして「目安」感を出す
                pointBackgroundColor: 'rgba(150, 150, 150, 0.5)',
                pointBorderColor: 'transparent',
                pointRadius: 2, // 点は小さく
                order: 2, // 背面に表示
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: gridColor },
                grid: { color: gridColor },
                pointLabels: {
                    color: textColor,
                    font: {
                        size: 11,
                        family: "'Noto Serif JP', serif",
                    },
                },
                ticks: {
                    display: false,
                    stepSize: 2,
                    backdropColor: 'transparent',
                },
                suggestedMin: 0,
                suggestedMax: 14,
            },
        },
        plugins: {
            legend: {
                display: false, // 独自の凡例をpage.js側で表示しているため非表示
            },
            tooltip: {
                enabled: true, // 比較したいのでツールチップは有効化推奨
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { family: "'Noto Serif JP', serif" },
                bodyFont: { family: "'Noto Serif JP', serif" },
            }
        },
    };

    return (
        <div className="w-full h-[300px] md:h-[350px] flex justify-center items-center relative">
            <Radar data={data} options={options} />
        </div>
    );
}