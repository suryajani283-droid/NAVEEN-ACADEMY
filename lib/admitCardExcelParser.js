import * as XLSX from 'xlsx';

/* ---------- Admit card field aliases (Hindi + English) ---------- */
export const ADMIT_FIELD_ALIASES = {
  roll_no:       ['roll', 'roll no', 'rollno', 'रोल', 'रोल नं', 'क्रमांक', 'क्र', 'sr', 's.no', 'sno'],
  student_name:  ['name', 'student name', 'नाम', 'छात्र का नाम', 'छात्र', 'विद्यार्थी'],
  father_name:   ['father', 'father name', 'पिता', 'पिता का नाम', 'पिता जी'],
  mother_name:   ['mother', 'mother name', 'माता', 'माता का नाम', 'माँ'],
  mobile:        ['mobile', 'phone', 'contact', 'मो', 'मोबाइल', 'मो. नं.', 'फोन'],
  class_section: ['class', 'कक्षा', 'section', 'कक्षा-वर्ग'],
  dob:           ['dob', 'date of birth', 'birth', 'जन्म', 'जन्म तिथि', 'जन्म दिनांक'],
  gender:        ['gender', 'sex', 'लिंग'],
  enrollment_no: ['enroll', 'enrollment', 'enrolment', 'नामांकन', 'नामांकन क्रमांक', 'reg no', 'registration'],
  photo_url:     ['photo', 'photo url', 'image', 'फोटो'],
};

const NORMALIZE = (s) =>
  String(s ?? '').toLowerCase().replace(/[\s.।,()/\\\-–—]+/g, '').trim();

export function guessAdmitField(header) {
  const h = NORMALIZE(header);
  if (!h) return null;

  for (const [field, aliases] of Object.entries(ADMIT_FIELD_ALIASES)) {
    for (const a of aliases) {
      if (h === NORMALIZE(a)) return field;
    }
  }

  let best = null;
  let bestLen = 0;
  for (const [field, aliases] of Object.entries(ADMIT_FIELD_ALIASES)) {
    for (const a of aliases) {
      const na = NORMALIZE(a);
      if (na && h.includes(na) && na.length > bestLen) {
        best = field;
        bestLen = na.length;
      }
    }
  }
  return best;
}

function splitHeaderAndRows(grid) {
  let headerIdx = 0;
  for (let i = 0; i < Math.min(grid.length, 8); i++) {
    const hits = (grid[i] || []).filter((c) => guessAdmitField(c)).length;
    if (hits >= 2) { headerIdx = i; break; }
  }
  const headers = (grid[headerIdx] || []).map((h) => String(h ?? '').trim());
  const rows = grid
    .slice(headerIdx + 1)
    .filter((r) => r.some((c) => String(c ?? '').trim() !== ''));
  return { headers, rows };
}

export async function parseAdmitExcel(file) {
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

export function mapAdmitRows(headers, rows, mapping) {
  return rows
    .map((r, idx) => {
      const obj = {
        roll_no: String(idx + 1),
        student_name: '',
        father_name: '',
        mother_name: '',
        mobile: '',
        class_section: '',
        dob: '',
        gender: '',
        enrollment_no: '',
        photo_url: '',
      };
      headers.forEach((_, i) => {
        const field = mapping[i];
        if (!field) return;
        obj[field] = String(r[i] ?? '').trim();
      });
      return obj;
    })
    .filter((s) => {
      const n = String(s.student_name || '').toLowerCase();
      if (n.includes('कुल योग') || n.includes('total') || n.includes('grand total')) return false;
      return s.student_name || s.mobile || s.roll_no;
    });
}