/**
 * AI Communication Engine — Formatter
 * Post-processes LLM output: strips markdown, normalizes whitespace,
 * ensures proper structure, and appends sender signature.
 */

export class Formatter {
  format(message: string, senderName: string): string {
    let result = message;

    // Strip markdown formatting
    result = this.stripMarkdown(result);

    // Normalize line breaks
    result = this.normalizeLineBreaks(result);

    // Ensure proper signature
    result = this.ensureSignature(result, senderName);

    return result.trim();
  }

  formatSubject(subject: string): string {
    return subject
      .replace(/[*_`#]/g, '')           // strip markdown
      .replace(/\s+/g, ' ')             // normalize spaces
      .trim();
  }

  private stripMarkdown(text: string): string {
    return text
      .replace(/#{1,6}\s/g, '')         // headers
      .replace(/\*\*(.*?)\*\*/g, '$1')  // bold
      .replace(/\*(.*?)\*/g, '$1')      // italic
      .replace(/`(.*?)`/g, '$1')        // inline code
      .replace(/```[\s\S]*?```/g, '')   // code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/^[-*+]\s/gm, '')        // bullet points
      .replace(/^\d+\.\s/gm, '');       // numbered lists
  }

  private normalizeLineBreaks(text: string): string {
    return text
      .replace(/\\n/g, '\n')            // literal \n → actual newline
      .replace(/\r\n/g, '\n')           // CRLF → LF
      .replace(/\n{3,}/g, '\n\n')       // max 2 consecutive newlines
      .trim();
  }

  private ensureSignature(text: string, senderName: string): string {
    // Check if a closing is already present
    const closingPatterns = [
      /best regards/i, /regards/i, /sincerely/i, /thanks/i,
      /thank you/i, /cheers/i, /warm regards/i, /looking forward/i,
    ];
    const hasClosing = closingPatterns.some(p => p.test(text));

    if (!hasClosing) {
      text += `\n\nBest regards,\n${senderName}`;
    } else {
      // If closing exists but name doesn't follow, append name
      const lines = text.split('\n');
      const lastNonEmpty = lines.reverse().find(l => l.trim());
      const nameInText = lastNonEmpty?.toLowerCase().includes(senderName.toLowerCase().split(' ')[0]);
      if (!nameInText) {
        text += `\n${senderName}`;
      }
    }
    return text;
  }
}
