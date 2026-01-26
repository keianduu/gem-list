"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MONTHS_DATA } from '@/libs/constants';
import GemCard from './GemCard';

export default function BirthstoneList({ categories }) {
    // 1月〜12月のループ
    const monthKeys = Object.keys(MONTHS_DATA).map(Number).sort((a, b) => a - b);

    // どのカテゴリがどの月を持つかの判定関数
    // birthstoneは配列(例: [1], ["1"], [1, 5]など)を想定
    const hasMonth = (cat, month) => {
        if (!Array.isArray(cat.birthstone)) return false;
        return cat.birthstone.some(val => Number(val) === month);
    };

    return (
        <div className="birthstone-list-container">
            {monthKeys.map(month => {
                const monthData = MONTHS_DATA[month];
                // その月の誕生石を持つカテゴリを抽出
                const monthGems = categories.filter(cat => hasMonth(cat, month));

                // 名前順にソート
                monthGems.sort((a, b) => a.name.localeCompare(b.name));

                return (
                    <section key={month} id={`month-${month}`}>
                        <div className="birthstone-month-header">
                            <span className="birthstone-month-en-bg">
                                {monthData.en}
                            </span>
                            <h2 className="birthstone-month-jp">
                                {monthData.ja}
                            </h2>
                            <span className="birthstone-month-en-small">
                                {monthData.en}
                            </span>
                        </div>

                        {monthGems.length > 0 ? (
                            <div className="category-index-grid">
                                {monthGems.map(cat => (
                                    <GemCard key={cat.id} cat={cat} />
                                ))}
                            </div>
                        ) : (
                            // 宝石がない場合の表示
                            <div className="birthstone-empty-state">
                                Coming Soon...
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
