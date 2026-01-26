'use client';

import { useState, useCallback } from 'react';
import * as diagnosisData from '@/libs/diagnosisData';

const PHASE1_LIMIT = 20;
const PHASE2_LIMIT = 40;

export const useDiagnosisEngine = () => {
    // 状態管理
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState({
        group: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 },
        role: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    });
    const [history, setHistory] = useState([]);
    const [phase, setPhase] = useState('ready'); // ready, playing, phase1_result, deep_dive, result
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // -------------------------------------------------------
    // 初期化 (Start)
    // -------------------------------------------------------
    const startDiagnosis = useCallback(() => {
        // スコア、履歴、インデックスをリセット
        const initialScores = {
            group: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 },
            role: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        };
        setScores(initialScores);
        setHistory([]);
        setCurrentQuestionIndex(0);

        // フェーズを 'playing' に戻すことで、モーダル内の表示を質問画面に切り替える
        setPhase('playing');

        // 最初の質問を再抽選してセット
        pickNextQuestion([], 0);
    }, []);

    // -------------------------------------------------------
    // 質問選定ロジック (Pick Question)
    // -------------------------------------------------------
    const pickNextQuestion = (currentHistory, nextIndex) => {
        // 既に聞かれたIDを除外
        const askedIds = new Set(currentHistory.map(h => h.id));
        const pool = (diagnosisData.QUESTIONS || []).filter(q => !askedIds.has(q.id));

        // ランダムにピックアップ (本来はアルゴリズムで最適化)
        if (pool.length > 0) {
            const nextQ = pool[Math.floor(Math.random() * pool.length)];
            setCurrentQuestion(nextQ);
        } else {
            // 万が一質問が尽きたら強制終了
            setPhase('result');
        }
    };

    // -------------------------------------------------------
    // 回答処理 (Answer)
    // -------------------------------------------------------
    const handleAnswer = useCallback((direction) => {
        if (!currentQuestion) return;

        const idx = direction === 'right' ? 0 : 1; // 0: A(Yes), 1: B(No)
        const effect = currentQuestion.effect;
        const boost = idx === 0 ? effect.a : effect.b;

        // 1. スコア更新
        setScores(prev => {
            const newScores = { ...prev };
            const targetScore = effect.type === 'G' ? newScores.group : newScores.role;
            boost.p.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] += 2; });
            boost.s.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] += 1; });
            boost.n.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] -= 1; });
            return newScores;
        });

        // 2. 履歴更新
        const newHistory = [
            ...history,
            { id: currentQuestion.id, text: currentQuestion.text, ans: idx === 0 ? currentQuestion.a : currentQuestion.b, type: effect.type }
        ];
        setHistory(newHistory);

        // 3. 次のカウントへ
        const nextCount = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextCount);

        // ★修正ポイント: フェーズ移行判定をここで行う
        // Phase 1 終了判定 (DeepDive中ではなく、かつ20問目に達した時)
        if (phase !== 'deep_dive' && nextCount >= PHASE1_LIMIT) {
            setPhase('phase1_result');
            return; // ここで止める（次の質問は選ばない）
        }

        // Phase 2 終了判定 (40問目に達した時)
        if (nextCount >= PHASE2_LIMIT) {
            setPhase('result');
            return; // ここで止める
        }

        // まだ続くなら次の質問を選ぶ
        pickNextQuestion(newHistory, nextCount);

    }, [currentQuestion, currentQuestionIndex, history, phase]);

    // -------------------------------------------------------
    // Deep Dive 開始 (Start Phase 2)
    // -------------------------------------------------------
    const startDeepDive = useCallback(() => {
        setPhase('deep_dive');
        // 現在の状態を維持したまま、次の質問を選んで再開
        pickNextQuestion(history, currentQuestionIndex);
    }, [history, currentQuestionIndex]);

    // -------------------------------------------------------
    // 結果計算 (Calculate Result)
    // -------------------------------------------------------
    const getResults = useCallback(() => {
        if (!diagnosisData.GEMS_DB) return { gemData: {}, scores: scores.group, ranking: [], consistency: 0 };

        const gStats = Object.entries(scores.group).sort((a, b) => b[1] - a[1]);
        const rStats = Object.entries(scores.role).sort((a, b) => b[1] - a[1]);

        const gMargin = gStats[0][1] - gStats[1][1];
        const rMargin = rStats[0][1] - rStats[1][1];
        const scale = Math.min(1.0, (gMargin + rMargin) / 10);

        let allCandidates = [];
        for (let g of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
            for (let r of ['1', '2', '3', '4', '5', '6']) {
                const id = `${g}-${r}`;
                let baseScore = scores.group[g] + scores.role[r];
                if (diagnosisData.SYNERGY_BONUS && diagnosisData.SYNERGY_BONUS[id]) {
                    baseScore += (diagnosisData.SYNERGY_BONUS[id] * scale);
                }

                // データが存在する場合のみ候補に追加
                if (diagnosisData.GEMS_DB[id]) {
                    allCandidates.push({
                        id,
                        score: baseScore,
                        subScore: scores.role[r],
                        data: diagnosisData.GEMS_DB[id]
                    });
                }
            }
        }

        allCandidates.sort((a, b) => b.score - a.score || b.subScore - a.subScore);
        // デフォルト値 (万が一計算できない場合)
        const top = allCandidates[0] || { id: 'A-1', data: diagnosisData.GEMS_DB['A-1'] };

        return {
            gemId: top.id,
            gemData: top.data,
            scores: scores.group,
            ranking: allCandidates.slice(1, 4),
            consistency: 85 // 簡易実装
        };
    }, [scores]);

    return {
        phase,
        currentQuestion,
        currentQuestionIndex,
        // 進捗バーの計算: DeepDive中は 40問ベース、それ以外は 20問ベースで表示
        progress: (currentQuestionIndex / (phase === 'deep_dive' ? PHASE2_LIMIT : PHASE1_LIMIT)) * 100,
        startDiagnosis,
        handleAnswer,
        startDeepDive,
        getResults
    };
};