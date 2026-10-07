const SCHOOL_NAME = 'नवीन एकेडेमी उच्च माध्यमिक विद्यालय, चौहटन';

export function buildFeeReminderMessage({ studentName, className, due, session }) {
  const amt = Number(due || 0).toLocaleString('en-IN');
  return [
    `नमस्ते,`,
    ``,
    `${SCHOOL_NAME} की ओर से सूचना:`,
    ``,
    `छात्र: ${studentName || '—'}`,
    `कक्षा: ${className || '—'}${session ? ` (सत्र ${session})` : ''}`,
    `बकाया फीस: ₹${amt}`,
    ``,
    `कृपया शीघ्र विद्यालय में फीस जमा करवाएँ।`,
    ``,
    `धन्यवाद।`,
    `— ${SCHOOL_NAME}`,
  ].join('\n');
}

export function normalizeIndianMobile(mobile) {
  const digits = String(mobile || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return '91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length === 11 && digits.startsWith('0')) return '91' + digits.slice(1);
  return digits;
}

export function openWhatsApp(mobile, message) {
  const num = normalizeIndianMobile(mobile);
  if (!num) {
    alert('मोबाइल नंबर उपलब्ध नहीं है।');
    return;
  }
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}