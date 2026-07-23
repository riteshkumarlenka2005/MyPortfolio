/**
 * AI Communication Engine — Mail Service
 * Sends the final message via Web3Forms.
 * Moved from ContactPage.tsx so the engine owns the full pipeline.
 */

import type { ContactFormData } from '../types/ai.types';
import { AIError, AIErrorCode } from '../types/error.types';

export interface MailPayload {
  formData: ContactFormData;
  subject:  string;
  message:  string;
}

export class MailService {
  private readonly endpoint = 'https://api.web3forms.com/submit';

  async send(payload: MailPayload): Promise<void> {
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

    if (!accessKey) {
      throw new AIError(AIErrorCode.UNKNOWN, 'Web3Forms access key is not configured.');
    }

    let response: Response;
    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          from_name:  `${payload.formData.fullName} (Portfolio — AI Engine)`,
          name:       payload.formData.fullName,
          email:      payload.formData.email,
          phone:      payload.formData.phone,
          location:   payload.formData.location ?? '',
          subject:    payload.subject,
          message:    payload.message,
        }),
      });
    } catch {
      throw new AIError(AIErrorCode.NETWORK_ERROR, 'Failed to reach Web3Forms.');
    }

    const result = await response.json().catch(() => ({}));

    if (response.status !== 200) {
      throw new AIError(
        AIErrorCode.UNKNOWN,
        `Web3Forms error: ${result.message ?? response.status}`,
      );
    }
  }
}
