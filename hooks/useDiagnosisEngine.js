'use client';

import { useState, useCallback, useRef } from 'react';
import * as diagnosisData from '@/libs/diagnosisData';

const PHASE1_LIMIT = 20;
const PHASE2_LIMIT = 40;

// ★1. 序盤の固定質問リスト (ID指定)
// 世界観(G)と役割(R)をバランスよく、かつ性格の根幹に関わる質問を選定
const FIXED_START_IDS = [
    'g01', // 新しいもの好き vs 定番 (変化)
    'r02', // リーダーシップ vs フォロワー (主導権)
    'g03', // 外向 vs 内向 (エネルギー)
    'r01', // 指摘する vs 空気を読む (葛藤処理)
    'g02', // 直感 vs 情報 (判断基準)
];

export const useDiagnosisEngine = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState({
        group: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 },
        role: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    });
    const [history, setHistory] = useState([]);
    const [phase, setPhase] = useState('ready');
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // ★前回の回答が「トップ属性への否定」だったかを追跡するためのRef
    const irregularityCheckRef = useRef({ isIrregular: false, targetType: null, targetKey: null });

    // -------------------------------------------------------
    // 初期化 (Start)
    // -------------------------------------------------------
    const startDiagnosis = useCallback(() => {
        const initialScores = {
            group: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 },
            role: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        };
        setScores(initialScores);
        setHistory([]);
        setCurrentQuestionIndex(0);
        setPhase('playing');
        irregularityCheckRef.current = { isIrregular: false, targetType: null, targetKey: null };

        // 最初の質問へ
        pickNextQuestion([], 0, initialScores);
    }, []);

    // -------------------------------------------------------
    // 質問選定ロジック (Pick Question) - ★ロジック強化
    // -------------------------------------------------------
    const pickNextQuestion = (currentHistory, nextIndex, currentScores) => {
        const askedIds = new Set(currentHistory.map(h => h.id));
        let pool = (diagnosisData.QUESTIONS || []).filter(q => !askedIds.has(q.id));

        if (pool.length === 0) {
            setPhase('result');
            return;
        }

        let nextQ = null;

        // --- A. 序盤固定フェーズ (1問目〜5問目) ---
        if (nextIndex < FIXED_START_IDS.length) {
            const fixedId = FIXED_START_IDS[nextIndex];
            nextQ = pool.find(q => q.id === fixedId);
            // 万が一データにない場合はランダムフォールバック
            if (!nextQ) nextQ = pool[Math.floor(Math.random() * pool.length)];
        }

        // --- B. イレギュラー検証 & 適応フェーズ (6問目以降) ---
        else {
            const check = irregularityCheckRef.current;

            // B-1. イレギュラー検知時の「確認質問」
            // 「さっきNoと言ったけど、こっちの質問ならどう？」という検証
            if (check.isIrregular && check.targetType && check.targetKey) {
                // その属性(targetKey)を加点(p)する質問を優先的に探す
                const verifyQ = pool.find(q => {
                    const boostA = q.effect.a.p.includes(check.targetKey); // A回答で加点
                    const boostB = q.effect.b.p.includes(check.targetKey); // B回答で加点
                    return (q.effect.type === check.targetType) && (boostA || boostB);
                });

                if (verifyQ) {
                    nextQ = verifyQ;
                    // フラグをリセット
                    irregularityCheckRef.current = { isIrregular: false, targetType: null, targetKey: null };
                }
            }

            // B-2. 特に検証事項がない場合：トップ属性を競わせる or ランダム
            if (!nextQ) {
                // 現在のトップスコアの属性を抽出
                const sortedGroups = Object.entries(currentScores.group).sort((a, b) => b[1] - a[1]);
                const topGroup = sortedGroups[0][0];

                // トップグループに関連する質問を優先的に出して、特徴を固めに行く
                // (ランダムすぎると特徴が薄まるため)
                const relevantQ = pool.find(q =>
                    q.effect.type === 'G' && (q.effect.a.p.includes(topGroup) || q.effect.b.p.includes(topGroup))
                );

                // 候補があれば50%の確率でそれを採用（偏りすぎ防止）、なければ完全ランダム
                if (relevantQ && Math.random() > 0.5) {
                    nextQ = relevantQ;
                } else {
                    nextQ = pool[Math.floor(Math.random() * pool.length)];
                }
            }
        }

        setCurrentQuestion(nextQ);
    };

    // -------------------------------------------------------
    // 回答処理 (Answer) - ★イレギュラー判定を追加
    // -------------------------------------------------------
    const handleAnswer = useCallback((direction) => {
        if (!currentQuestion) return;

        const idx = direction === 'right' ? 0 : 1; // 0: A(Yes), 1: B(No)
        const effect = currentQuestion.effect;
        const boost = idx === 0 ? effect.a : effect.b; // 選んだ選択肢の加点内容
        const reject = idx === 0 ? effect.b : effect.a; // 選ばなかった方の加点内容（＝否定した内容）

        // 1. イレギュラー判定ロジック
        // 「現在のトップスコアの属性」を「否定」したかチェック
        // (例: 情熱(A)がトップなのに、情熱的な選択肢を選ばなかった場合)
        if (currentQuestionIndex >= FIXED_START_IDS.length) {
            // 現在のトップを計算
            const targetScoreObj = effect.type === 'G' ? scores.group : scores.role;
            const sorted = Object.entries(targetScoreObj).sort((a, b) => b[1] - a[1]);
            const topKey = sorted[0][0]; // 現在の1位 (例: 'A')
            const topVal = sorted[0][1];

            // 2位との差がある程度開いている（＝傾向が出ている）場合のみ判定
            if (topVal > 2) {
                // 選ばなかった選択肢(reject)の加点要素(p)に、現在のトップ(topKey)が含まれていたか？
                // 含まれていた場合、「トップ属性の行動を否定した」ことになる
                if (reject.p.includes(topKey)) {
                    irregularityCheckRef.current = {
                        isIrregular: true,
                        targetType: effect.type,
                        targetKey: topKey
                    };
                    console.log(`Irregularity detected: User denied top trait ${topKey}. Verifying...`);
                } else {
                    irregularityCheckRef.current = { isIrregular: false, targetType: null, targetKey: null };
                }
            }
        }

        // 2. スコア更新
        const newScores = {
            group: { ...scores.group },
            role: { ...scores.role }
        };
        const targetScore = effect.type === 'G' ? newScores.group : newScores.role;

        boost.p.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] += 2; });
        boost.s.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] += 1; });
        boost.n.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] -= 1; });

        setScores(newScores);

        // 3. 履歴更新
        const newHistory = [
            ...history,
            { id: currentQuestion.id, text: currentQuestion.text, ans: idx === 0 ? currentQuestion.a : currentQuestion.b, type: effect.type }
        ];
        setHistory(newHistory);

        // 4. 次のフェーズ・質問へ
        const nextCount = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextCount);

        if (phase !== 'deep_dive' && nextCount >= PHASE1_LIMIT) {
            setPhase('phase1_result');
            return;
        }
        if (nextCount >= PHASE2_LIMIT) {
            setPhase('result');
            return;
        }

        // 次の質問を選ぶ（最新のスコアを渡す）
        pickNextQuestion(newHistory, nextCount, newScores);

    }, [currentQuestion, currentQuestionIndex, history, phase, scores]);

    // ... (startDeepDive, goBack, getResults は変更なし)
    // -------------------------------------------------------
    // Deep Dive 開始
    // -------------------------------------------------------
    const startDeepDive = useCallback(() => {
        setPhase('deep_dive');
        // Phase2の開始時も、現在のスコアに基づいて次の質問を選ぶ
        pickNextQuestion(history, currentQuestionIndex, scores);
    }, [history, currentQuestionIndex, scores]);

    const goBack = useCallback(() => {
        if (history.length === 0) return;
        const lastEntry = history[history.length - 1];
        const lastQuestionId = lastEntry.id;
        const questionData = diagnosisData.QUESTIONS.find(q => q.id === lastQuestionId);
        if (!questionData) return;

        const idx = lastEntry.ans === questionData.a ? 0 : 1;
        const effect = questionData.effect;
        const boost = idx === 0 ? effect.a : effect.b;

        // スコアを戻す
        const restoredScores = {
            group: { ...scores.group },
            role: { ...scores.role }
        };
        const targetScore = effect.type === 'G' ? restoredScores.group : restoredScores.role;

        boost.p.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] -= 2; });
        boost.s.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] -= 1; });
        boost.n.forEach(k => { if (targetScore[k] !== undefined) targetScore[k] += 1; });

        setScores(restoredScores);
        setHistory(prev => prev.slice(0, -1));

        const prevIndex = currentQuestionIndex - 1;
        setCurrentQuestionIndex(prevIndex);
        setCurrentQuestion(questionData);

        // イレギュラーチェックもリセット
        irregularityCheckRef.current = { isIrregular: false, targetType: null, targetKey: null };

        if (phase === 'deep_dive' && prevIndex < PHASE1_LIMIT) {
            setPhase('playing');
        }
    }, [history, phase, currentQuestionIndex, scores]);

    // getResultsは既存のまま
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
        const top = allCandidates[0] || { id: 'A-1', data: diagnosisData.GEMS_DB['A-1'] };

        return {
            gemId: top.id,
            gemData: top.data,
            scores: scores.group,
            ranking: allCandidates.slice(1, 4),
            consistency: 85
        };
    }, [scores]);

    return {
        phase,
        currentQuestion,
        currentQuestionIndex,
        progress: (currentQuestionIndex / (phase === 'deep_dive' ? PHASE2_LIMIT : PHASE1_LIMIT)) * 100,
        startDiagnosis,
        handleAnswer,
        startDeepDive,
        goBack,
        getResults
    };
};