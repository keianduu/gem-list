'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'jewelism_latest_diagnosis';

export function useDiagnosisHistory() {
    const [latestDiagnosis, setLatestDiagnosis] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setLatestDiagnosis(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse diagnosis history", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save diagnosis result
    const saveDiagnosis = (diagnosisData) => {
        // Validation: ensure required fields exist
        if (!diagnosisData || !diagnosisData.slug) return;

        const dataToSave = {
            slug: diagnosisData.slug,
            name: diagnosisData.name, // Display name (English preferred based on recent changes)
            image: diagnosisData.image,
            url: diagnosisData.url, // Full URL with query params
            timestamp: new Date().toISOString()
        };

        setLatestDiagnosis(dataToSave);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    };

    return { latestDiagnosis, saveDiagnosis, isLoaded };
}
