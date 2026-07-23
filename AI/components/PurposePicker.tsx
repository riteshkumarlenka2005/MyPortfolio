/**
 * AI Communication Engine — Purpose Picker
 * Career-focused pill-style category selector.
 */

import React from 'react';
import { PURPOSE_CATEGORIES } from '../config/constants';
import type { Purpose } from '../types/ai.types';

interface PurposePickerProps {
  selected:         Purpose | null;
  onChange:         (purpose: Purpose) => void;
  suggestedPurpose?: Purpose | null;
  suggestion?:      { purpose: Purpose; confidence: number } | null;
  onAcceptSuggestion?: () => void;
  disabled?:        boolean;
}

export const PurposePicker: React.FC<PurposePickerProps> = ({
  selected,
  onChange,
  suggestion,
  onAcceptSuggestion,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        What brings you here? <span className="text-red-400">*</span>
      </label>

      {/* Intent suggestion chip */}
      {suggestion && !selected && onAcceptSuggestion && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 animate-fade-in">
          <span className="text-xs text-amber-400">
            Did you mean:{' '}
            <strong>
              {PURPOSE_CATEGORIES.find(p => p.id === suggestion.purpose)?.label}
            </strong>
            ?
          </span>
          <button
            type="button"
            onClick={onAcceptSuggestion}
            className="ml-auto text-xs text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg hover:bg-amber-500/10 transition-colors"
          >
            Select
          </button>
        </div>
      )}

      {/* Purpose pills */}
      <div className="flex flex-wrap gap-2">
        {PURPOSE_CATEGORIES.map(cat => {
          const isSelected = selected === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(cat.id)}
              title={cat.description}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                border transition-all duration-200 select-none
                ${isSelected
                  ? 'bg-white text-black border-white scale-105 shadow-lg shadow-white/10'
                  : 'bg-[#1a1a1a] text-gray-400 border-white/10 hover:border-white/30 hover:text-gray-200 hover:bg-[#222]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
