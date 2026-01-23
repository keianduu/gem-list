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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {monthKeys.map(month => {
                const monthData = MONTHS_DATA[month];
                // その月の誕生石を持つカテゴリを抽出
                const monthGems = categories.filter(cat => hasMonth(cat, month));

                // 名前順にソート
                monthGems.sort((a, b) => a.name.localeCompare(b.name));

                return (
                    <section key={month} id={`month-${month}`}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '40px',
                            position: 'relative'
                        }}>
                            <span style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '4rem',
                                fontFamily: 'var(--font-en)',
                                color: 'rgba(0,0,0,0.03)',
                                fontWeight: '700',
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                lineHeight: 1
                            }}>
                                {monthData.en}
                            </span>
                            <h2 style={{
                                fontFamily: 'var(--font-jp)',
                                fontSize: '1.8rem',
                                fontWeight: '500',
                                margin: '0 0 8px',
                                position: 'relative'
                            }}>
                                {monthData.ja}
                            </h2>
                            <span style={{
                                fontFamily: 'var(--font-en)',
                                fontSize: '1.0rem',
                                color: '#888',
                                letterSpacing: '0.1em'
                            }}>
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
                            <div style={{
                                textAlign: 'center',
                                padding: '20px 0',
                                color: '#ccc',
                                fontFamily: 'var(--font-en)',
                                letterSpacing: '0.05em'
                            }}>
                                Coming Soon...
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
