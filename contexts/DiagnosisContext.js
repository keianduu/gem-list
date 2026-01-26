'use client'; // 必須
import { createContext, useContext, useState } from 'react';
import { useDiagnosisEngine } from '@/hooks/useDiagnosisEngine'; // 中括弧 {} が必須

const DiagnosisContext = createContext();

export const DiagnosisProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const engine = useDiagnosisEngine(); // ここでHookを呼び出し

    const openDiagnosis = () => {
        setIsOpen(true);
        // engineが正しく初期化されているか確認
        if (engine && engine.phase === 'ready') {
            // 必要ならここで startDiagnosis を呼ぶ
            // engine.startDiagnosis(); 
        }
    };

    const closeDiagnosis = () => setIsOpen(false);

    return (
        <DiagnosisContext.Provider value={{ isOpen, openDiagnosis, closeDiagnosis, engine }}>
            {children}
        </DiagnosisContext.Provider>
    );
};

export const useDiagnosis = () => useContext(DiagnosisContext);