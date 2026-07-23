/**
 * AI Communication Engine — Analytics
 * Adapter pattern — LocalStorage implementation by default.
 * Swap to Firebase/Supabase by replacing the adapter without touching anything else.
 */

// ─── Adapter Interface ────────────────────────────────────────────────────────

interface AnalyticsAdapter {
  track(event: string, properties?: Record<string, unknown>): void;
  getAll(): Record<string, unknown>;
}

// ─── LocalStorage Adapter ─────────────────────────────────────────────────────

const ANALYTICS_KEY = 'ai_engine_analytics';

class LocalStorageAdapter implements AnalyticsAdapter {
  track(event: string, properties?: Record<string, unknown>): void {
    try {
      const raw   = localStorage.getItem(ANALYTICS_KEY) ?? '{}';
      const store = JSON.parse(raw) as Record<string, unknown[]>;

      if (!store[event]) store[event] = [];
      (store[event] as unknown[]).push({
        ts: Date.now(),
        ...properties,
      });

      // Keep max 200 events per type to avoid bloat
      if ((store[event] as unknown[]).length > 200) {
        (store[event] as unknown[]).shift();
      }

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(store));
    } catch { /* ignore storage errors */ }
  }

  getAll(): Record<string, unknown> {
    try {
      return JSON.parse(localStorage.getItem(ANALYTICS_KEY) ?? '{}');
    } catch {
      return {};
    }
  }
}

// ─── Analytics Class ──────────────────────────────────────────────────────────

export class Analytics {
  private adapter: AnalyticsAdapter = new LocalStorageAdapter();

  track(event: string, properties?: Record<string, unknown>): void {
    this.adapter.track(event, properties);
  }

  /** Swap the backend — one line change */
  setAdapter(adapter: AnalyticsAdapter): void {
    this.adapter = adapter;
  }

  /** Dev utility — view all tracked events */
  getAll(): Record<string, unknown> {
    return this.adapter.getAll();
  }
}
