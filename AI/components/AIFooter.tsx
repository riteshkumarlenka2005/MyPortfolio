/**
 * AI Communication Engine — AI Footer
 * Subtle bar at the bottom: status badge + version + disclaimer.
 * Never distracts from the form.
 */

import React from 'react';

interface AIFooterProps {
  providerStatus: 'online' | 'offline' | 'checking';
  version:        string;
  model:          string;
  showDisclaimer?: boolean;
}

export const AIFooter: React.FC<AIFooterProps> = ({
  providerStatus,
  version,
  model,
  showDisclaimer = false,
}) => {
  const statusConfig = {
    online:   { dot: 'bg-emerald-400', pulse: true,  label: 'AI Ready'    },
    offline:  { dot: 'bg-red-400',     pulse: false, label: 'AI Offline'  },
    checking: { dot: 'bg-amber-400',   pulse: true,  label: 'Connecting…' },
  }[providerStatus];

  return (
    <div className="flex flex-col gap-1.5 pt-2">
      {/* Status + version row */}
      <div className="flex items-center justify-between">
        {/* Status badge */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            {statusConfig.pulse && (
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${statusConfig.dot}`}
              />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.dot}`} />
          </span>
          <span className="text-[11px] text-gray-500 font-medium tracking-wide">
            {statusConfig.label}
          </span>
        </div>

        {/* Version tag */}
        <span className="text-[11px] text-gray-600 tracking-wide">
          AI Assistant&nbsp;•&nbsp;v{version}&nbsp;·&nbsp;{model}
        </span>
      </div>

      {/* Disclaimer — shown only after generation */}
      {showDisclaimer && (
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Generated with AI. Please review before sending.
        </p>
      )}
    </div>
  );
};
