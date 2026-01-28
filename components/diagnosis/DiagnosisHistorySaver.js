'use client';

import { useEffect } from 'react';
import { useDiagnosisHistory } from '@/hooks/useDiagnosisHistory';

export default function DiagnosisHistorySaver({ gem, url }) {
    const { saveDiagnosis } = useDiagnosisHistory();

    useEffect(() => {
        if (gem && url) {
            saveDiagnosis({
                slug: gem.slug,
                name: gem.name || gem.nameJa, // Use English name if available, else Japanese
                image: gem.image?.url,
                url: url
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gem.slug, url]); // Only run when gem or url changes

    return null; // This component renders nothing
}
