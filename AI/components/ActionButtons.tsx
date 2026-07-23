/**
 * AI Communication Engine — Action Buttons
 * 10 post-generation improvement actions.
 */

import React from 'react';
import { TONE_ACTIONS } from '../config/constants';
import type { ToneAction } from '../types/ai.types';

interface ActionButtonsProps {
  onAction:    (action: ToneAction) => void;
  onReset:     () => void;
  disabled?:   boolean;
  generating?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAction,
  onReset,
  disabled   = false,
  generating = false,
}) => {
  const actions = TONE_ACTIONS.filter(a => a.id !== 'reset' && a.id !== 'regenerate');
  const isDisabled = disabled || generating;

  return (
    <div className="space-y-2">
      {/* Regenerate — primary action */}
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onAction('regenerate')}
        className="
          w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
          bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
          text-white text-sm font-medium transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {generating ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <span>🔄</span> Regenerate
          </>
        )}
      </button>

      {/* Improvement actions — compact grid */}
      <div className="flex flex-wrap gap-1.5">
        {actions.map(action => (
          <button
            key={action.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onAction(action.id)}
            title={action.instruction}
            className="
              flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
              bg-[#1a1a1a] hover:bg-[#252525] border border-white/8 hover:border-white/20
              text-gray-400 hover:text-gray-200 transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}

        {/* Reset — separated */}
        <button
          type="button"
          onClick={onReset}
          className="
            flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
            bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20
            text-red-400/70 hover:text-red-400 transition-all duration-150
          "
        >
          <span>🔁</span>
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
