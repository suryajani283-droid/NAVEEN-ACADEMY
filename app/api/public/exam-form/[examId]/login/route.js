import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function toISO(s) {
  if (!s) return '';
  const str = String(s).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const m = str.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (m) {
    let [, d, mo, y] = m;
    if (y.length === 2) y = (Number(y) > 50 ? '19' : '20') + y;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return '';
}

function normName(s) {
  return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export async function POST(req, { params }) {
  const { examId } = await params;
  try {
    const { name, dob, class_name } = await req.json();

    if (!class_name) {
      return NextResponse.json({ error: 'कृपया कक्षा चुनें' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'कृपया नाम भरें' }, { status: 400 });
    }

    const { data: exam } = await supabaseAdmin
      .from('exams')
      .select('public_form_open, form_deadline')
      .eq('id', examId)
      .single();

    if (!exam?.public_form_open) {
      return NextResponse.json({ error: 'फॉर्म बंद है' }, { status: 403 });
    }
    if (exam.form_deadline && new Date(exam.form_deadline) < new Date()) {
      return NextResponse.json({ error: 'अंतिम तिथि बीत चुकी है' }, { status: 403 });
    }

    const { data: students, error } = await supabaseAdmin
      .from('exam_students')
      .select('*')
      .eq('exam_id', examId);
    if (error) throw error;

    const inputName = normName(name);
    const inputDob = toISO(dob);
    const inputClass = String(class_name).trim().toLowerCase();

    const matches = students.filter((s) => {
      if (normName(s.student_name) !== inputName) return false;

      // class filter (DB में class_section खाली हो तो skip)
      const dbClass = String(s.class_section || '').trim().toLowerCase();
      if (dbClass && dbClass !== inputClass) return false;

      // dob filter
      const dbDob = toISO(s.dob);
      if (!dbDob) return true;         // DB में dob नहीं → कोई भी match
      if (!inputDob) return false;     // DB में dob है पर student नहीं दे रहा
      return dbDob === inputDob;
    });

    if (!matches.length) {
      return NextResponse.json(
        { error: 'नाम / जन्म तिथि से कोई छात्र नहीं मिला। कृपया स्कूल से संपर्क करें।' },
        { status: 404 }
      );
    }
    if (matches.length > 1) {
      return NextResponse.json(
        { error: 'एक ही नाम के कई छात्र मिले — कृपया जन्म तिथि ध्यान से भरें।' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ...matches[0],
      confirmed_class: class_name,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}