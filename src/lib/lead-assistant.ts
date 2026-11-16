/** Lead asistan — paylaşılan sabitler (admin filtre + FAB köprüsü). */

export const LEAD_ASSISTANT_SOURCE_TAG = '[kaynak:lead-assistant]';

export const ZVT_OPEN_LEAD_ASSISTANT = 'zvt-open-lead-assistant';

export type ZvtOpenLeadAssistantDetail = {
  screen?: 'menu' | 'quote' | 'success';
};

export function isLeadAssistantContact(input: {
  email?: string | null;
  message?: string | null;
}): boolean {
  const email = (input.email || '').toLowerCase();
  const message = input.message || '';
  return (
    email.startsWith('asistan.') ||
    message.includes(LEAD_ASSISTANT_SOURCE_TAG) ||
    /asistanından yazıyorum/i.test(message)
  );
}

export function openLeadAssistant(detail: ZvtOpenLeadAssistantDetail = { screen: 'menu' }) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(ZVT_OPEN_LEAD_ASSISTANT, {
      detail,
    })
  );
}
