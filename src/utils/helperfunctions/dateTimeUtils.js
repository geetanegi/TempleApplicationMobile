/** IST timezone for India */
const IST = 'Asia/Kolkata';

/**
 * Format ISO date string for display (matches ChatScreen messages format).
 * Handles timezone normalization: if string has no 'Z' or offset, treats as UTC.
 * Shows: "10:30 AM" for today, "Yesterday 10:30 AM", "Feb 17 10:30 AM" for older.
 */
export function formatDateTimeIST(isoString) {
  if (!isoString) return '';
  const str = String(isoString).trim();
  const normalized = str.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(str) ? str : str + 'Z';
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return '';
  const timeOpts = { hour: 'numeric', minute: '2-digit', timeZone: IST };
  const time = d.toLocaleTimeString('en-IN', timeOpts);
  const now = new Date();
  const todayIST = now.toLocaleDateString('en-CA', { timeZone: IST });
  const msgDateIST = d.toLocaleDateString('en-CA', { timeZone: IST });
  if (msgDateIST === todayIST) return time;
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayIST = yesterday.toLocaleDateString('en-CA', { timeZone: IST });
  if (msgDateIST === yesterdayIST) return `Yesterday ${time}`;
  const opts = { month: 'short', day: 'numeric', timeZone: IST };
  const msgYear = parseInt(d.toLocaleDateString('en-CA', { year: 'numeric', timeZone: IST }), 10);
  const nowYear = parseInt(now.toLocaleDateString('en-CA', { year: 'numeric', timeZone: IST }), 10);
  if (msgYear !== nowYear) opts.year = 'numeric';
  const dateStr = d.toLocaleDateString('en-IN', opts);
  return `${dateStr} ${time}`;
}
