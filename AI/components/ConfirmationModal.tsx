/**
 * AI Communication Engine — Confirmation Modal
 * Final review before sending. Shows EmailPreview + confirm/cancel.
 */

import React from 'react';
import { EmailPreview } from './EmailPreview';

interface ConfirmationModalProps {
  isOpen:      boolean;
  senderName:  string;
  senderEmail: string;
  subject:     string;
  message:     string;
  isSending:   boolean;
  onConfirm:   () => void;
  onCancel:    () => void;
  onEdit:      () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  senderName,
  senderEmail,
  subject,
  message,
  isSending,
  onConfirm,
  onCancel,
  onEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/8">
          <h2
            id="confirm-modal-title"
            className="text-lg font-bold text-white"
          >
            Ready to send?
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Review your message before it's sent to Ritesh.
          </p>
        </div>

        {/* Email preview */}
        <div className="px-6 py-4 max-h-[50vh] overflow-y-auto">
          <EmailPreview
            senderName={senderName}
            senderEmail={senderEmail}
            subject={subject}
            message={message}
          />
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-white/8 flex flex-col sm:flex-row gap-2.5">
          {/* Confirm */}
          <button
            type="button"
            id="confirm-send-btn"
            onClick={onConfirm}
            disabled={isSending}
            className="
              flex-1 flex items-center justify-center gap-2
              bg-white hover:bg-gray-100 text-black font-semibold
              px-5 py-2.5 rounded-xl transition-colors
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isSending ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            disabled={isSending}
            className="
              flex items-center justify-center gap-1.5
              px-4 py-2.5 rounded-xl border border-white/10
              text-gray-300 hover:text-white hover:border-white/20
              text-sm font-medium transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            disabled={isSending}
            className="
              flex items-center justify-center gap-1.5
              px-4 py-2.5 rounded-xl
              text-gray-500 hover:text-gray-300 text-sm font-medium
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
