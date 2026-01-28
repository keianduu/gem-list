'use client';

import { useEffect } from 'react';
import { useDiagnosisHistory } from '@/hooks/useDiagnosisHistory';

export default function DiagnosisHistorySaver({ gem, url, shouldSave }) {
    const { saveDiagnosis } = useDiagnosisHistory();

    useEffect(() => {
        if (shouldSave && gem && url) {
            saveDiagnosis({
                slug: gem.slug,
                name: gem.name || gem.nameJa, // Use English name if available, else Japanese
                image: gem.image?.url,
                url: url
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gem.slug, url, shouldSave]); // Only run when gem or url changes or shouldSave becomes true

    return null; // This component renders nothing
}
