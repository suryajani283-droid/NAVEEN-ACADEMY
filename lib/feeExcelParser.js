import * as XLSX from 'xlsx';

/* ---------- Hindi + English column aliases ---------- */
export const FIELD_ALIASES = {
  name:          ['name', 'नाम', 'student name', 'छात्र का नाम', 'नाम / पिता'],
  mobile:        ['mobile', 'मो', 'मोबाइल', 'phone', 'contact', 'मो. नं.'],
  route:         ['route', 'रूट', 'route name', 'रूट नाम', 'bus'],
  previous_due:  ['previous', 'पिछला', 'prev', 'old', 'पिछला बकाया'],
  admission_fee: ['admission', 'प्रवेश', 'प्रवेश शुल्क'],
  tuition_fee:   ['tuition', 'शिक्षण', 'शिक्षण शुल्क', 'fees'],
  vehicle_fee:   ['vehicle', 'वाहन', 'वाहन शुल्क', 'transport', 'bus fee'],
  paid:          ['paid', 'जमा', 'कुल जमा', 'received', 'deposit'],
  phone_date:    ['date', 'दिनांक', 'phone date', 'दूरभाष'],
};

const NORMALIZE = (s) =>
  String(s ?? '').toLowerCase().replace(/[\s.।,()/\\-]+/g, '').trim();

export function guessField(header) {
  const h = NORMALIZE(header);
  if (!h) return null;
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const a of aliases) {
      if (h.includes(NORMALIZE(a))) return field;
    }
  }
  return null;
}

/* ---------- Find the header row (first row with ≥2 recognized headers) ---------- */
function splitHeaderAndRows(grid) {
  let headerIdx = 0;
  for (let i = 0; i < Math.min(grid.length, 8); i++) {
    const hits = (grid[i] || []).filter((c) => guessField(c)).length;
    if (hits >= 2) { headerIdx = i; break; }
  }
  const headers = (grid[headerIdx] || []).map((h) => String(h ?? '').trim());
  const rows = grid
    .slice(headerIdx + 1)
    .filter((r) => r.some((c) => String(c ?? '').trim() !== ''));
  return { headers, rows };
}

/* ---------- Parse an Excel/CSV file → { headers, rows } ---------- */
export async function parseExcelFile(file) {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const grid = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    defval: '',
    blankrows: false,
  });
  return splitHeaderAndRows(grid);
}

/* ---------- Apply header→field mapping to raw rows ---------- */
export function mapRows(headers, rows, mapping) {
  const NUMERIC = ['previous_due', 'admission_fee', 'tuition_fee', 'vehicle_fee', 'paid'];

  return rows
    .map((r, idx) => {
      const obj = { sno: idx + 1 };
      headers.forEach((_, i) => {
        const field = mapping[i];
        if (!field) return;
        obj[field] = r[i] ?? '';
      });
      NUMERIC.forEach((k) => {
        obj[k] = Number(String(obj[k] ?? '').replace(/[^\d.-]/g, '')) || 0;
      });
      obj.name = String(obj.name ?? '').trim();
      obj.mobile = String(obj.mobile ?? '').trim();
      obj.route = String(obj.route ?? '').trim();
      obj.phone_date = String(obj.phone_date ?? '').trim();
      return obj;
    })
    .filter((r) => r.name || r.mobile);
}