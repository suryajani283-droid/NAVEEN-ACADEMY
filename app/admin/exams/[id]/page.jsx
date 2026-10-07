'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdmitCard from '@/components/AdmitCard';
import AdmitCardImportModal from '@/components/AdmitCardImportModal';

export default function ExamEditorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [feeSheets, setFeeSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [tab, setTab] = useState('subjects');
  const [excelImportOpen, setExcelImportOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [examRes, sheetsRes] = await Promise.all([
        fetch(`/api/admin/exams/${id}`),
        fetch('/api/admin/fee-performa'),
      ]);
      const data = await examRes.json();
      const sheets = await sheetsRes.json();
      setExam(data);
      setSubjects(data.subjects || []);
      setStudents(data.students || []);
      setFeeSheets(Array.isArray(sheets) ? sheets : []);
      setLoading(false);
    })();
  }, [id]);

  function updateExam(key, value) {
    setExam((prev) => ({ ...prev, [key]: value }));
  }

  /* ---------- SUBJECTS ---------- */
  function addSubject() {
    setSubjects((s) => [...s, { subject: '', exam_date: '', start_time: '', end_time: '' }]);
  }

  function updateSubject(i, key, value) {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  }

  function deleteSubject(i) {
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  }

  function autoFillPeriods() {
    if (!subjects.length) return;
    if (!confirm('सभी subjects के लिए dates auto-fill करें (3 दिन × 2 shifts)?')) return;
    const base = new Date();
    const days = [0, 0, 1, 1, 2, 2];
    const shifts = [
      { start: '09:00', end: '12:00' },
      { start: '13:00', end: '16:00' },
    ];
    setSubjects((prev) =>
      prev.map((s, i) => {
        const d = new Date(base);
        d.setDate(base.getDate() + (days[i] ?? 0));
        const shift = shifts[i % 2];
        return {
          ...s,
          exam_date: d.toISOString().slice(0, 10),
          start_time: shift.start,
          end_time: shift.end,
        };
      })
    );
  }

  /* ---------- STUDENTS ---------- */
  function addStudent() {
    setStudents((s) => [
      ...s,
      {
        student_name: '', father_name: '', mother_name: '', mobile: '',
        roll_no: String(s.length + 1), enrollment_no: '',
        class_section: exam?.class_name || '', dob: '', gender: '', photo_url: '',
      },
    ]);
  }

  function updateStudent(i, key, value) {
    setStudents((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  }

  function deleteStudent(i) {
    if (!confirm('इस छात्र को हटाएँ?')) return;
    setStudents((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function importFromFee(performaId) {
    if (!performaId) return;
    if (students.length && !confirm('वर्तमान छात्र सूची बदल दी जाएगी — जारी रखें?')) return;
    const res = await fetch(`/api/admin/exams/${id}/import-students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ performa_id: performaId }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || 'Import fail'); return; }
    const examRes = await fetch(`/api/admin/exams/${id}`);
    const examData = await examRes.json();
    setStudents(examData.students || []);
    setToast(`✓ ${data.imported} छात्र Fee Performa से import हुए — सेव करें`);
    setTimeout(() => setToast(''), 3000);
  }

  function handleExcelImported(imported, mode) {
    setStudents((prev) => {
      const base = mode === 'replace' ? [] : prev;
      const merged = [...base, ...imported];
      return merged.map((s, i) => ({
        ...s,
        roll_no: s.roll_no || String(i + 1),
      }));
    });
    setToast(`✓ ${imported.length} छात्र Excel से import हुए — सेव करें`);
    setTimeout(() => setToast(''), 3000);
  }

  function autoFillRollNumbers() {
    if (!students.length) return;
    setStudents((prev) =>
      prev.map((s, i) => ({ ...s, roll_no: s.roll_no || String(i + 1) }))
    );
  }

  /* ---------- SAVE ---------- */
  async function save() {
    if (!exam?.name || !exam?.class_name) {
      alert('परीक्षा का नाम और कक्षा ज़रूरी है');
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/admin/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: exam.name,
        class_name: exam.class_name,
        session: exam.session,
        exam_type: exam.exam_type,
        instructions: exam.instructions,
        subjects,
        students,
      }),
    });
    setSaving(false);
    setToast(res.ok ? '✓ सेव हो गया' : '✗ सेव नहीं हुआ');
    setTimeout(() => setToast(''), 2000);
  }

  const school = useMemo(
    () => ({
      name: 'नवीन एकेडेमी उच्च माध्यमिक विद्यालय, चौहटन',
      address: 'चौहटन, बाड़मेर (राजस्थान)',
      affiliation: 'RBSE Affiliation No: 1730XXX',
    }),
    []
  );

  if (loading || !exam) {
    return <div className="min-h-screen bg-slate-100 py-20 text-center text-slate-500">लोड हो रहा है...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <style jsx global>{`
        /* ===== Admit Card styles ===== */
        .admit-card {
          width: 190mm;
          min-height: 138mm;
          margin: 0 auto 6mm;
          padding: 4mm;
          border: 2px solid #000;
          background: #fff;
          color: #000;
          font-family: 'Noto Sans Devanagari', Arial, sans-serif;
          font-size: 11px;
          box-sizing: border-box;
          page-break-after: always;
        }
        .admit-card:last-child { page-break-after: auto; }

        .ac-header {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 2px solid #000;
          padding-bottom: 4px;
          margin-bottom: 6px;
        }
        .ac-logo-box {
          width: 50px;
          height: 50px;
          border: 1px dashed #666;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #666;
          flex-shrink: 0;
        }
        .ac-header-text { flex: 1; text-align: center; }
        .ac-header-text h1 {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 2px;
          line-height: 1.15;
        }
        .ac-addr { font-size: 10px; margin: 0; }
        .ac-aff { font-size: 9px; margin: 1px 0 0; color: #333; }
        .ac-exam-title {
          font-size: 12px;
          font-weight: 700;
          margin-top: 4px;
          color: #b00000;
        }
        .ac-card-label {
          font-size: 11px;
          font-weight: 700;
          margin-top: 2px;
          text-decoration: underline;
        }

        .ac-body {
          display: flex;
          gap: 6px;
          margin-bottom: 5px;
        }
        .ac-details { flex: 1; }
        .ac-details-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10.5px;
        }
        .ac-details-table td {
          border: 1px solid #000;
          padding: 2px 4px;
          vertical-align: middle;
        }
        .ac-details-table .lbl {
          background: #f1f3f5;
          font-weight: 600;
          width: 24%;
        }
        .ac-details-table .val { width: 26%; }
        .ac-details-table .bold { font-weight: 700; }

        .ac-photo {
          width: 28mm;
          height: 34mm;
          border: 1px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 9px;
          color: #666;
          flex-shrink: 0;
        }
        .ac-photo img { width: 100%; height: 100%; object-fit: cover; }

        .ac-schedule { margin-bottom: 5px; }
        .ac-schedule-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10.5px;
        }
        .ac-schedule-table th {
          background: #f1f3f5;
          border: 1px solid #000;
          padding: 3px 4px;
          font-weight: 700;
        }
        .ac-schedule-table td {
          border: 1px solid #000;
          padding: 3px 4px;
          text-align: center;
        }
        .ac-schedule-table td.left { text-align: left; }

        .ac-instructions {
          border: 1px solid #000;
          padding: 3px 6px;
          margin-bottom: 5px;
          font-size: 9.5px;
        }
        .ac-ins-title { font-weight: 700; margin-bottom: 2px; }
        .ac-instructions ol { margin: 0; padding-left: 16px; }
        .ac-instructions li { line-height: 1.3; }

        .ac-signatures {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 6px;
          margin-bottom: 4px;
        }
        .ac-sign { text-align: center; flex: 1; }
        .ac-sign-line {
          border-bottom: 1px solid #000;
          height: 22px;
          margin-bottom: 2px;
        }
        .ac-sign-label { font-size: 9.5px; }

        .ac-footnote {
          font-size: 8.5px;
          text-align: center;
          border-top: 1px dashed #999;
          padding-top: 3px;
          color: #333;
        }

        /* ===== PRINT ===== */
        @media print {
          @page { size: A4 portrait; margin: 6mm; }
          html, body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav, header, footer, aside,
          [class*="Navbar"], [class*="Footer"], [class*="Marquee"],
          [class*="WhatsApp"], [class*="MobileBottomNav"] {
            display: none !important;
          }
          .no-print { display: none !important; }
          .print-hide { display: none !important; }
          .admit-card {
            width: 100% !important;
            min-height: 0 !important;
            margin: 0 0 4mm !important;
            padding: 3mm !important;
            page-break-after: always;
          }
        }
      `}</style>

      <div className="mx-auto max-w-5xl print-hide">
        {/* HEADER */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3">
          <div>
            <button
              onClick={() => router.push('/admin/exams')}
              className="mb-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              ← सभी परीक्षाएँ
            </button>
            <h1 className="text-lg font-bold text-slate-800">{exam.name}</h1>
            <p className="text-xs text-slate-500">
              {exam.class_name} • {exam.session} • {exam.exam_type}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {toast && <span className="text-sm font-semibold text-green-700">{toast}</span>}
            <button
              onClick={save}
              disabled={saving}
              className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              💾 {saving ? 'सेव...' : 'डेटा सेव करें'}
            </button>
            <button
              onClick={() => window.print()}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              📄 Admit Cards प्रिंट
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-white p-1 shadow-sm">
          {[
            { key: 'subjects', label: `📚 विषय (${subjects.length})` },
            { key: 'students', label: `👥 छात्र (${students.length})` },
            { key: 'print',    label: `🖨️ प्रीव्यू (${students.length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded px-3 py-2 text-sm font-semibold ${
                tab === t.key ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ============ SUBJECTS TAB ============ */}
        {tab === 'subjects' && (
          <div className="rounded-lg border border-slate-300 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-800">विषय व समय-सारणी</h2>
              <button
                onClick={addSubject}
                className="rounded bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700"
              >
                ➕ विषय जोड़ें
              </button>
              <button
                onClick={autoFillPeriods}
                className="rounded bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
              >
                ⚡ Auto dates (3 दिन × 2 shifts)
              </button>
            </div>

            {!subjects.length ? (
              <p className="py-8 text-center text-sm text-slate-500">कोई विषय नहीं — ऊपर से जोड़ें</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border px-2 py-2 w-12">#</th>
                      <th className="border px-2 py-2">विषय</th>
                      <th className="border px-2 py-2 w-40">दिनांक</th>
                      <th className="border px-2 py-2 w-28">समय से</th>
                      <th className="border px-2 py-2 w-28">समय तक</th>
                      <th className="border px-2 py-2 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s, i) => (
                      <tr key={i}>
                        <td className="border px-2 py-1 text-center">{i + 1}</td>
                        <td className="border px-2 py-1">
                          <input
                            value={s.subject}
                            onChange={(e) => updateSubject(i, 'subject', e.target.value)}
                            className="w-full rounded border-0 px-2 py-1 text-sm focus:bg-blue-50"
                            placeholder="हिन्दी / English / गणित"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="date"
                            value={s.exam_date || ''}
                            onChange={(e) => updateSubject(i, 'exam_date', e.target.value)}
                            className="w-full rounded border-0 px-2 py-1 text-sm focus:bg-blue-50"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            value={s.start_time}
                            onChange={(e) => updateSubject(i, 'start_time', e.target.value)}
                            placeholder="09:00"
                            className="w-full rounded border-0 px-2 py-1 text-sm focus:bg-blue-50"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            value={s.end_time}
                            onChange={(e) => updateSubject(i, 'end_time', e.target.value)}
                            placeholder="12:00"
                            className="w-full rounded border-0 px-2 py-1 text-sm focus:bg-blue-50"
                          />
                        </td>
                        <td className="border px-2 py-1 text-center">
                          <button
                            onClick={() => deleteSubject(i)}
                            className="font-bold text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 border-t pt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                निर्देश (हर line एक अलग निर्देश)
              </label>
              <textarea
                value={exam.instructions || ''}
                onChange={(e) => updateExam('instructions', e.target.value)}
                rows={5}
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="खाली छोड़ें → default निर्देश आएँगे"
              />
            </div>
          </div>
        )}

        {/* ============ STUDENTS TAB ============ */}
        {tab === 'students' && (
          <div className="rounded-lg border border-slate-300 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-800">छात्र सूची</h2>
              <button
                onClick={addStudent}
                className="rounded bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700"
              >
                ➕ नया छात्र
              </button>
              <button
                onClick={autoFillRollNumbers}
                className="rounded bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
              >
                🔢 Roll No. auto-fill
              </button>
            </div>

            {/* Excel import */}
            <div className="mb-3 rounded border border-purple-200 bg-purple-50 p-3">
              <p className="mb-2 text-xs font-semibold text-purple-900">
                📊 Excel से छात्र import करें (Admit Card के लिए)
              </p>
              <button
                onClick={() => setExcelImportOpen(true)}
                className="rounded bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700"
              >
                📊 Excel फ़ाइल चुनें
              </button>
              <p className="mt-2 text-[10px] text-purple-700">
                कॉलम: रोल नं, नाम, पिता का नाम, माता, मोबाइल, कक्षा, जन्म तिथि, लिंग, नामांकन
              </p>
            </div>

            {/* Fee Performa import */}
            <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 p-3">
              <p className="mb-2 text-xs font-semibold text-emerald-900">
                📥 Fee Performa से import करें
              </p>
              <select
                onChange={(e) => { if (e.target.value) importFromFee(e.target.value); e.target.value = ''; }}
                className="rounded border border-emerald-300 px-3 py-2 text-sm"
              >
                <option value="">-- कक्षा चुनें (import) --</option>
                {feeSheets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.class_name} ({s.session})
                  </option>
                ))}
              </select>
            </div>

            {!students.length ? (
              <p className="py-8 text-center text-sm text-slate-500">
                कोई छात्र नहीं — ऊपर से Excel/Fee Performa import करें या manual जोड़ें
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w