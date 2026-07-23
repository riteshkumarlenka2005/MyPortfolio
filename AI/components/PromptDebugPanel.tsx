/**
 * AI Communication Engine — Prompt Debug Panel
 * Development only. Hidden in production builds automatically.
 * Shows raw prompt, response JSON, latency, token estimate.
 */

import React, { useState } from 'react';

interface DebugInfo {
  prompt?:      string;
  rawResponse?: string;
  latencyMs?:   number;
  tokens?:      number;
  cacheHit?:    boolean;
  retryCount?:  number;
  isFallback?:  boolean;
}

interface PromptDebugPanelProps {
  info: DebugInfo;
}

export const PromptDebugPanel: React.FC<PromptDebugPanelProps> = ({ info }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // This component renders nothing in production
  if (!import.meta.env.DEV) return null;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 overflow-hidden text-xs">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-purple-400 font-mono"
      >
        <span>🛠 Debug Panel (dev only)</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 font-mono">
          {/* Metrics row */}
          <div className="flex flex-wrap gap-3 py-2 border-t border-purple-500/10">
            {info.latencyMs !== undefined && (
              <span className="text-gray-400">⏱ {info.latencyMs}ms</span>
            )}
            {info.tokens !== undefined && (
              <span className="text-gray-400">🔤 ~{info.tokens} tokens</span>
            )}
            {info.cacheHit !== undefined && (
              <span className={info.cacheHit ? 'text-emerald-400' : 'text-gray-500'}>
                {info.cacheHit ? '✓ Cache hit' : '✗ Cache miss'}
              </span>
            )}
            {info.retryCount !== undefined && info.retryCount > 0 && (
              <span className="text-amber-400">⚠ {info.retryCount} retries</span>
            )}
            {info.isFallback && (
              <span className="text-red-400">⚡ Fallback used</span>
            )}
          </div>

          {/* Prompt */}
          {info.prompt && (
            <div>
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span>PROMPT</span>
                <button
                  type="button"
                  onClick={() => copy(info.prompt!)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-black/30 rounded-lg p-3 text-gray-400 overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto text-[10px]">
                {info.prompt}
              </pre>
            </div>
          )}

          {/* Raw response */}
          {info.rawResponse && (
            <div>
              <div className="text-gray-500 mb-1.5">RAW JSON RESPONSE</div>
              <pre className="bg-black/30 rounded-lg p-3 text-emerald-400/80 overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto text-[10px]">
                {info.rawResponse}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
