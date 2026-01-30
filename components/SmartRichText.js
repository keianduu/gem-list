/* components/SmartRichText.js */
"use client"; // ★追加: クライアントサイドでパスを取得するため

import React from 'react';
import { usePathname } from 'next/navigation'; // ★追加
import RichTextRenderer from "./RichTextRenderer";
import { GLOSSARY_DATA } from "@/libs/glossaryData";

export default function SmartRichText({ content }) {
    const pathname = usePathname(); // ★追加: 現在のパスを取得

    if (!content) return null;

    // 1. ツールチップ有効な用語を抽出し、名前が長い順にソート
    const terms = GLOSSARY_DATA
        .filter(t => t.isTooltipEnabled)
        .sort((a, b) => b.name_jp.length - a.name_jp.length);

    let processedContent = content;

    // 2. 置換処理
    terms.forEach(term => {
        const termStr = term.name_jp;

        // 正規表現用に特殊文字をエスケープ
        const escapedTerm = termStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // カタカナの連続マッチ回避 (否定後読み/先読み)
        const prefix = /^[ァ-ヶー]/.test(termStr) ? '(?<![ァ-ヶー])' : '';
        const suffix = /[ァ-ヶー]$/.test(termStr) ? '(?![ァ-ヶー])' : '';

        // 正規表現を作成
        const regex = new RegExp(`${prefix}(${escapedTerm})${suffix}(?![^<]*>)`, 'g');

        let replaced = false;
        processedContent = processedContent.replace(regex, (match) => {
            // 1記事につき最初の1回だけリンク化する
            if (replaced) return match;
            replaced = true;

            // ★修正: hrefに ?from=現在のパス を付加
            // これにより、遷移先で「どこから来たか」がわかります
            const linkUrl = `/glossary/${term.id}?from=${encodeURIComponent(pathname)}`;

            return `<span class="smart-tooltip" data-tooltip="${term.summary}">
        <a href="${linkUrl}">${match}</a>
      </span>`;
        });
    });

    return <RichTextRenderer content={processedContent} />;
}