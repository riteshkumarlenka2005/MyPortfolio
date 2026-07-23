/**
 * AI Communication Engine — Email Preview Card
 * Shows how the generated message will look as an actual email
 * before the user confirms sending.
 */

import React from 'react';
import { CandidateProfile } from '../config/profile';

interface EmailPreviewProps {
  senderName:  string;
  senderEmail: string;
  subject:     string;
  message:     string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  senderName,
  senderEmail,
  subject,
  message,
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] overflow-hidden text-sm">
      {/* Email header */}
      <div className="px-5 py-4 border-b border-white/8 space-y-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 w-12 shrink-0 text-xs">From</span>
          <span className="text-gray-200 font-medium">{senderName}</span>
          <span className="text-gray-500 text-xs">({senderEmail})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 w-12 shrink-0 text-xs">To</span>
          <span className="text-gray-200 font-medium">{CandidateProfile.name}</span>
          <span className="text-gray-500 text-xs">({CandidateProfile.email})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-gray-500 w-12 shrink-0 text-xs">Subject</span>
          <span className="text-white font-semibold">{subject}</span>
        </div>
      </div>

      {/* Email body */}
      <div className="px-5 py-4">
        <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
          {message}
        </p>
      </div>
    </div>
  );
};
