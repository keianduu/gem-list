'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * HtmlWithScrollHint
 * A component that safely renders HTML and injects a subtle "Swipe" hint
 * over wide tables on mobile devices.
 */
export default function HtmlWithScrollHint({ htmlContent }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Find all table wrappers in the injected HTML
        const tableWrappers = containerRef.current.querySelectorAll('.glossary-table-wrapper');

        tableWrappers.forEach((wrapper) => {
            // Check if this wrapper already has a hint (to prevent duplication on re-renders)
            if (wrapper.querySelector('.scroll-hint-overlay')) return;

            // Add relative positioning to the wrapper so we can absolutely position the hint inside it
            wrapper.style.position = 'relative';

            // Create the hint overlay element
            const hintDiv = document.createElement('div');
            hintDiv.className = 'scroll-hint-overlay';

            // Inside the overlay, we create a small pill-shaped hint
            hintDiv.innerHTML = `
        <div class="scroll-hint-pill">
          →
        </div>
      `;

            // Append the hint to the table wrapper
            wrapper.appendChild(hintDiv);

            // Function to hide the hint when the user interacts
            const hideHint = () => {
                hintDiv.classList.add('hidden');
            };

            // Add event listeners to detect scroll or touch
            wrapper.addEventListener('scroll', hideHint, { once: true, passive: true });
            wrapper.addEventListener('touchstart', hideHint, { once: true, passive: true });
        });

    }, [htmlContent]);

    return (
        <div
            ref={containerRef}
            className="glossary-html-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
