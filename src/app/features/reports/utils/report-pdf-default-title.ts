import type { RadReportPayload } from '../../../report-layout';

const MAX_TITLE_LENGTH = 120;

function slugPart(raw: string): string {
  const normalized = raw
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const chunk = normalized.slice(0, 48).replace(/^-+|-+$/g, '');
  return chunk.length > 0 ? chunk : 'docente';
}

/** Value for `document.title` before `print()`; many browsers suggest the same name when saving as PDF. */
export function buildRadPdfSuggestedTitle(data: RadReportPayload): string {
  const cycle = slugPart(data.metadata.cycleLabel);
  const name = slugPart(data.userData.name);
  const joined = `RAD-${cycle}-${name}`.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return joined.slice(0, MAX_TITLE_LENGTH);
}
