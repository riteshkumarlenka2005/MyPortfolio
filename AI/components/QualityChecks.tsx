/**
 * AI Communication Engine — Quality Checks
 * Shows concrete, defensible quality indicators after generation.
 * No fake percentages — only verifiable heuristics.
 */

import React from 'react';
import type { QualityCheckResult } from '../types/ai.types';

interface QualityChecksProps {
  quality: QualityCheckResult;
}

export const QualityChecks: React.FC<QualityChecksProps> = ({ quality }) => {
  const checks = [
    { label: 'Has greeting',   passed: quality.hasGreeting  },
    { label: 'Has closing',    passed: quality.hasClosing   },
    { label: 'Grammar OK',     passed: quality.grammarOk    },
    { label: 'Clear intent',   passed: quality.clearIntent  },
  ];

  const passCount = checks.filter(c => c.passed).length;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {/* Read time */}
      <span className="flex items-center gap-1 text-[11px] text-gray-500">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        ~{quality.readTimeSeconds}s read
      </span>

      {/* Check items */}
      {checks.map(check => (
        <span
          key={check.label}
          className={`flex items-center gap-1 text-[11px] font-medium ${
            check.passed ? 'text-emerald-400' : 'text-gray-600'
          }`}
        >
          {check.passed ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {check.label}
        </span>
      ))}

      {/* Summary badge */}
      <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
        passCount === 4
          ? 'bg-emerald-500/10 text-emerald-400'
          : passCount >= 2
          ? 'bg-amber-500/10 text-amber-400'
          : 'bg-gray-500/10 text-gray-500'
      }`}>
        {passCount}/4 checks
      </span>
    </div>
  );
};
