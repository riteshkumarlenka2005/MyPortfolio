/**
 * AI Communication Engine — Regeneration Engine
 * Tracks variation index across generations so each Regenerate call
 * produces a genuinely different version rather than the same output.
 */

export class RegenerationEngine {
  private variationIndex = 0;
  private history: Array<{ subject: string; message: string }> = [];

  /** Call before each regeneration to increment variation */
  nextVariation(): number {
    this.variationIndex = (this.variationIndex + 1) % 5;
    return this.variationIndex;
  }

  /** Store a generated result in history */
  record(subject: string, message: string): void {
    this.history.push({ subject, message });
    if (this.history.length > 10) this.history.shift(); // keep last 10
  }

  /** Current variation index (for PromptBuilder) */
  get currentIndex(): number {
    return this.variationIndex;
  }

  /** How many unique versions have been generated */
  get count(): number {
    return this.history.length;
  }

  reset(): void {
    this.variationIndex = 0;
    this.history = [];
  }
}
