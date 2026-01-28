'use client';

import { useState, useCallback } from 'react';
import * as diagnosisData from '@/libs/diagnosisData';

// 定数定義
const PHASE1_LIMIT = 15;
const PHASE2_LIMIT = 30;

// 固定質問リスト
const FIXED_START_IDS = [
    'g03', 'x_world_01', 'v03', 'x_orient_02',
    'g02', 'x_judge_01', 'g07', 'x_approach_01',
    'r02', 'r01',
];

export const useDiagnosisEngine = () => {
    // --- State ---
    const [phase, setPhase] = useState('ready'); // ready, playing, phase1_result, deep_dive, result
    const [qIndex, setQIndex] = useState(0);
    const [history, setHistory] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    // スコア管理
    const [scores, setScores] = useState({
        axis: { world: 0, orient: 0, judge: 0, approach: 0 },
        axisCounts: { world: 0, orient: 0, judge: 0, approach: 0 },
        role: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 }
    });

    // --- Helpers ---
    const allQuestions = useCallback(() => {
        return diagnosisData.QUESTIONS || [];
    }, []);

    const findQuestionById = useCallback((id) => {
        return allQuestions().find(q => q.id === id);
    }, [allQuestions]);

    const getAxisEffects = useCallback((q) => {
        if (!q) return null;
        if (q.axis) return q.axis;
        return diagnosisData.AXIS_EFFECTS?.[q.id] || null;
    }, []);

    // --- Logic: Pick Next Question ---
    const pickNextQuestion = useCallback((currentHistory, nextIndex, currentScores) => {
        const pool = allQuestions().filter(q => !currentHistory.some(h => h.id === q.id));

        if (pool.length === 0) {
            setPhase('result');
            return;
        }

        let nextQ = null;

        // 1. 固定質問フェーズ
        if (nextIndex < FIXED_START_IDS.length) {
            const fixedId = FIXED_START_IDS[nextIndex];
            nextQ = pool.find(q => q.id === fixedId);
        }

        // 2. バランス調整フェーズ (回答数が少ない軸を優先)
        if (!nextQ) {
            const counts = currentScores.axisCounts;
            const sortedAxes = Object.entries(counts).sort((a, b) => a[1] - b[1]);

            for (const [axisKey] of sortedAxes) {
                const candidates = pool.filter(q => {
                    const eff = getAxisEffects(q);
                    return eff && eff[axisKey];
                });
                if (candidates.length) {
                    nextQ = candidates[Math.floor(Math.random() * candidates.length)];
                    break;
                }
            }
        }

        // 3. フォールバック
        if (!nextQ) {
            nextQ = pool[Math.floor(Math.random() * pool.length)];
        }

        setCurrentQuestion(nextQ);
    }, [allQuestions, getAxisEffects]);

    // --- Action: Answer ---
    const handleAnswer = useCallback((direction) => {
        if (!currentQuestion) return;
        const ansKey = direction === 'right' ? 'a' : 'b'; // YES=a, NO=b

        const newScores = JSON.parse(JSON.stringify(scores));

        // 1. Axis反映
        const axisEff = getAxisEffects(currentQuestion);
        if (axisEff) {
            Object.keys(axisEff).forEach(key => {
                const delta = axisEff[key][ansKey] || 0;
                newScores.axis[key] += delta;
                newScores.axisCounts[key] += 1;
            });
        }

        // 2. Role反映
        if (currentQuestion.effect && currentQuestion.effect.type === 'R') {
            const boost = ansKey === 'a' ? currentQuestion.effect.a : currentQuestion.effect.b;
            boost.p?.forEach(k => { if (newScores.role[k] !== undefined) newScores.role[k] += 2; });
            boost.s?.forEach(k => { if (newScores.role[k] !== undefined) newScores.role[k] += 1; });
            boost.n?.forEach(k => { if (newScores.role[k] !== undefined) newScores.role[k] -= 1; });
        }

        setScores(newScores);

        const newHistory = [...history, { id: currentQuestion.id, ans: ansKey }];
        setHistory(newHistory);

        const nextIndex = qIndex + 1;
        setQIndex(nextIndex);

        if (phase === 'playing' && nextIndex >= PHASE1_LIMIT) {
            setPhase('phase1_result');
            return;
        }
        if (phase === 'deep_dive' && nextIndex >= PHASE2_LIMIT) {
            setPhase('result');
            return;
        }

        pickNextQuestion(newHistory, nextIndex, newScores);

    }, [currentQuestion, qIndex, history, phase, scores, pickNextQuestion, getAxisEffects]);

    // --- Action: Start / Restart ---
    const startDiagnosis = useCallback(() => {
        const initScores = {
            axis: { world: 0, orient: 0, judge: 0, approach: 0 },
            axisCounts: { world: 0, orient: 0, judge: 0, approach: 0 },
            role: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 }
        };
        setScores(initScores);
        setHistory([]);
        setQIndex(0);
        setPhase('playing');
        pickNextQuestion([], 0, initScores);
    }, [pickNextQuestion]);

    const startDeepDive = useCallback(() => {
        setPhase('deep_dive');
        pickNextQuestion(history, qIndex, scores);
    }, [history, qIndex, scores, pickNextQuestion]);

    // --- Action: Go Back (修正版) ---
    const goBack = useCallback(() => {
        if (history.length === 0) return;

        // 1. 戻る先の履歴（末尾-1）を作成
        const newHistory = history.slice(0, -1);

        // 2. 直前に回答した（今回再表示する）質問を取得
        const lastLog = history[history.length - 1];
        const questionToRestore = findQuestionById(lastLog.id);

        if (!questionToRestore) return;

        // 3. スコアをゼロから再計算（減算より安全）
        const newScores = {
            axis: { world: 0, orient: 0, judge: 0, approach: 0 },
            axisCounts: { world: 0, orient: 0, judge: 0, approach: 0 },
            role: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 }
        };

        newHistory.forEach(h => {
            const q = findQuestionById(h.id);
            if (!q) return;
            const ansKey = h.ans;

            // Axis
            const axisEff = getAxisEffects(q);
            if (axisEff) {
                Object.keys(axisEff).forEach(key => {
                    const delta = axisEff[key][ansKey] || 0;
                    newScores.axis[key] += delta;
                    newScores.axisCounts[key] += 1;
                });
            }

            // Role
            if (q.effect && q.effect.type === 'R') {
                const boost = ansKey === 'a' ? q.effect.a : q.effect.b;
                boost.p?.forEach(k => { if (newScores.role[k] !== undefined) newScores.role[k] += 2; });
                boost.s?.forEach(k => { if (newScores.role[k] !== undefined) newScores.role[k] += 1; });
                boost.n?.forEach(k => { if (newScores.role[k] !== undefined) newScores.role[k] -= 1; });
            }
        });

        // 4. State更新
        setScores(newScores);
        setHistory(newHistory);
        setQIndex(newHistory.length);
        setCurrentQuestion(questionToRestore); // 直前の質問に戻す

        // フェーズ戻し判定 (DeepDive中ならPlayingに戻る可能性も)
        if (phase === 'deep_dive' && newHistory.length < PHASE1_LIMIT) {
            setPhase('playing');
        } else if (phase === 'phase1_result') {
            setPhase('playing');
        }

    }, [history, phase, findQuestionById, getAxisEffects]);

    // --- Results Calculation ---
    const getResults = useCallback(() => {
        const axisPercent = {};
        const axes = diagnosisData.AXES_DEF || [];

        axes.forEach(ax => {
            const v = scores.axis[ax.key];
            const n = scores.axisCounts[ax.key] || 1;
            const maxAbs = 2 * n;
            const clamped = Math.max(-maxAbs, Math.min(maxAbs, v));
            const pct = 50 + ((clamped / (maxAbs || 1)) * 40);
            axisPercent[ax.key] = Math.round(Math.max(0, Math.min(100, pct)));
        });

        const isOuter = axisPercent['world'] >= 50;
        const isFlip = axisPercent['orient'] >= 50;
        const isLogic = axisPercent['judge'] >= 50;

        let groupId = 'H';
        if (isOuter && isFlip && !isLogic) groupId = 'A';
        else if (isOuter && isFlip && isLogic) groupId = 'B';
        else if (isOuter && !isFlip && !isLogic) groupId = 'C';
        else if (isOuter && !isFlip && isLogic) groupId = 'D';
        else if (!isOuter && isFlip && !isLogic) groupId = 'E';
        else if (!isOuter && isFlip && isLogic) groupId = 'F';
        else if (!isOuter && !isFlip && !isLogic) groupId = 'G';

        const sortedRoles = Object.entries(scores.role).sort((a, b) => b[1] - a[1]);
        const topRole = sortedRoles[0]?.[0] || '1';

        const gemId = `${groupId}-${topRole}`;
        const gemData = diagnosisData.GEMS_DB?.[gemId] || null;

        return {
            gemId,
            gemData,
            scores: scores.role,
            axisPercent,
            groupId,
            roleId: topRole
        };
    }, [scores]);

    return {
        phase,
        currentQuestion,
        currentQuestionIndex: qIndex,
        progress: (qIndex / (phase === 'deep_dive' ? PHASE2_LIMIT : PHASE1_LIMIT)) * 100,
        startDiagnosis,
        handleAnswer,
        startDeepDive,
        getResults,
        goBack
    };
};