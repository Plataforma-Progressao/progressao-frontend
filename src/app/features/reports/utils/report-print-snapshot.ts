import { normalizeReportPayload, type RadReportPayload } from '../../../report-layout';

const STORAGE_KEY = 'progressao_report_print_v1';
const MAX_AGE_MS = 5 * 60 * 1000;

interface StoredSnapshot {
  readonly savedAt: number;
  readonly payload: unknown;
}

export function saveReportPrintSnapshot(data: RadReportPayload): void {
  try {
    const body: StoredSnapshot = { savedAt: Date.now(), payload: data };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(body));
  } catch {
    /* storage full or disabled */
  }
}

export function consumeReportPrintSnapshot(): RadReportPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    sessionStorage.removeItem(STORAGE_KEY);
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const savedAt = record['savedAt'];
    if (typeof savedAt !== 'number' || Date.now() - savedAt > MAX_AGE_MS) {
      return null;
    }
    return normalizeReportPayload(record['payload']);
  } catch {
    return null;
  }
}
