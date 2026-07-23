/**
 * AI Communication Engine — Session Manager
 * Persists the full form + generation state to sessionStorage.
 * Survives page refresh. Clears when the tab is closed.
 */

import type { SessionState } from '../types/ai.types';
import type { Purpose } from '../types/ai.types';

const SESSION_KEY = 'ai_comm_engine_session';

const defaultState = (): SessionState => ({
  formData: { fullName: '', email: '', phone: '', location: '' },
  selectedPurpose: null,
  context: '',
  generatedSubject: '',
  generatedMessage: '',
  generationCount: 0,
  lastGeneratedAt: 0,
  sessionId: crypto.randomUUID(),
});

export class SessionManager {
  private state: SessionState;

  constructor() {
    this.state = this.load();
  }

  get(): SessionState {
    return { ...this.state };
  }

  update(partial: Partial<SessionState>): void {
    this.state = { ...this.state, ...partial };
    this.save();
  }

  setGeneratedContent(subject: string, message: string): void {
    this.update({
      generatedSubject: subject,
      generatedMessage: message,
      generationCount:  this.state.generationCount + 1,
      lastGeneratedAt:  Date.now(),
    });
  }

  setPurpose(purpose: Purpose | null): void {
    this.update({ selectedPurpose: purpose });
  }

  setContext(context: string): void {
    this.update({ context });
  }

  clear(): void {
    this.state = defaultState();
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }

  get sessionId(): string {
    return this.state.sessionId;
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private load(): SessionState {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw) as SessionState;
      // Always generate a fresh sessionId on restore (tab re-opens)
      return { ...parsed };
    } catch {
      return defaultState();
    }
  }

  private save(): void {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(this.state));
    } catch { /* storage full — ignore */ }
  }
}
