'use client';

import { useEffect, useState } from 'react';
import { rowTotal, rowDue } from '@/lib/feePerforma';
import FeeImportModal from '@/components/FeeImportModal';
import FeeDepositModal from '@/components/FeeDepositModal';

const blankRow = (sno) => ({
  sno,
  name: '',
  mobile: '',
  route: '',
  previous_due: 0,
  admission_fee: 0,
  tuition_fee: 0,
  vehicle_fee: 0,
  paid: 0,
  phone_date: '',
  father_name: '',
  mother_name: '',
  class_section: '',
  sr_no: '',
  dob: '',
});

export default function AdminFeePerformaPage() {
  const [sheets, setSheets] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [className, setClassName] = useState('');
  const [session, setSession] = useState('2025-26');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  /* Load list of class sheets on mount */
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/fee-performa');
      const data = await res.json();
      setSheets(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  async function openSheet(id) {
    setLoading(true);
    const res = await fetch(`/api/admin/fee-performa/${id}`);
    const data = await res.json();
    setActiveId(id);
    setClassName(data.class_name || '');
    setSession(data.session || '2025-26');
    setRows(data.students?.length ? data.students : [blankRow(1)]);
    setLoading(false);
  }

  async function createSheet() {
    const name = window.prompt('कक्षा का नाम लिखें (जैसे: 9th A):');
    if (!name) return;
    const res = await fetch('/api/admin/fee-performa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_name: name, session, students: [] }),
    });
    const sheet = await res.json();
    setSheets((s) => [...s, sheet]);
    openSheet(sheet.id);
  }

  async function deleteSheet(id) {
    if (!confirm('क्या आप यह पूरा फीस प्रपत्र हटाना चाहते हैं?')) return;
    await fetch(`/api/admin/fee-performa/${id}`, { method: 'DELETE' });
    setSheets((s) => s.filter((x) => x.id !== id));
    if (activeId === id) {
      setActiveId('');
      setRows([]);
      setClassName('');
    }
  }

  function updateCell(idx, key, value) {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r))
    );
  }

  function addRow() {
    setRows((prev) => [...prev, blankRow(prev.length + 1)]);
  }

  function deleteRow(idx) {
    if (!confirm('इस पंक्ति को हटाना है?')) return;
    setRows((prev) =>
      prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, sno: i + 1 }))
    );
  }

  /* --- Excel import handler --- */
  function handleImported(imported, mode) {
    setRows((prev) => {
      const base = mode === 'replace' ? [] : prev;
      const merged = [...base, ...imported];
      return merged.map((r, i) => ({ ...r, sno: i + 1 }));
    });
    setToast(`✓ ${imported.length} छात्र जोड़े गए — सेव करें`);
    setTimeout(() => setToast(''), 3000);
  }

  /* --- Fee deposit modal --- */
  function openFeeModal(row) {
    if (!row.id) {
      setToast('⚠️ पहले डेटा सेव करें, फिर फीस जमा करें');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    setSelectedStudent({ ...row, performa_id: activeId });
    setFeeModalOpen(true);
  }

  /* Payment add/delete होने पर paid field update करें */
  function handlePaidChange(studentId, newPaid) {
    setRows((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, paid: newPaid } : s))
    );
  }

  /* Modal में student details (father, mother, sr_no, dob) save होने पर */
  function handleStudentChange(studentId, updatedStudent) {
    setRows((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updatedStudent } : s))
    );
    setSelectedStudent((prev) =>
      prev && prev.id === studentId ? { ...prev, ...updatedStudent } : prev
    );
  }

  async function save() {
    if (!activeId) return;
    setSaving(true);
    const res = await fetch(`/api/admin/fee-performa/${activeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_name: className, session, students: rows }),
    });
    setSaving(false);
    if (res.ok) {
      setToast('✓ सुरक्षित हो गया!');
      /* Reload to get stable IDs for new rows */
      const fresh = await fetch(`/api/admin/fee-performa/${activeId}`);
      const data = await fresh.json();
      if (data.students) setRows(data.students);
    } else {
      setToast('✗ सेव नहीं हुआ');
    }
    setTimeout(() => setToast(''), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <style jsx global>{`
        .fee-table { width: 100%; border-collapse: collapse; font-size: 12px; color: #000; table-layout: fixed; }
        .fee-table th, .fee-table td {
          border: 1px solid #000; padding: 4px 6px; text-align: center; vertical-align: middle;
          word-break: break-word; overflow-wrap: break-word;
        }
        .fee-table th { background: #f8f9fa; font-weight: 700; }
        .fee-table input {
          width: 100%; border: none; outline: none; background: transparent;
          font-size: 12px; text-align: center; padding: 0;
        }
        .fee-table input.text-left { text-align: left; }
        .fee-table input:focus { background: #e8f0fe; }
        .bg-total { background: #f1f3f5; font-weight: bold; }
        .bg-due { background: #fff0f0; color: #b00000; font-weight: bold; }

        @media print {
          @page { size: A4 landscape; margin: 6mm; }

          html, body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .no-print { display: none !important; }

          .print-area {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          .print-area .overflow-x-auto { overflow: visible !important; }

          .fee-table {
            width: 100% !important;
            table-layout: fixed !important;
            font-size: 9px !important;
          }

          .fee-table th, .fee-table td {
            padding: 1.5px 2px !important;
            border: 1px solid #000 !important;
            font-size: 9px !important;
            line-height: 1.15 !important;
            word-break: break-word;
          }

          .fee-table input {
            border: none !important;
            background: transparent !important;
            color: #000 !important;
            font-size: 9px !important;
            padding: 0 !important;
            width: 100% !important;
          }

          .print-area h1 { font-size: 14px !important; margin: 0 0 2px 0 !important; }
          .print-area h2 { font-size: 10.5px !important; margin: 0 0 5px 0 !important; }

          .fee-table tr { page-break-inside: avoid !important; }
          .fee-table thead { display: table-header-group !important; }
        }
      `}</style>

      {/* ============ ACTION BAR ============ */}
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-300 bg-slate-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <strong className="text-slate-800">फीस अपडेशन प्रपत्र</strong>
          {toast && (
            <span className="text-sm font-semibold text-green-700">{toast}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={save}
            disabled={!activeId || saving}
            className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            💾 {saving ? 'सेव हो रहा है...' : 'डेटा सेव करें'}
          </button>
          <button
            onClick={() => setImportOpen(true)}
            disabled={!activeId}
            className="rounded bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
          >
            📥 Excel से आयात करें
          </button>
          <button
            onClick={addRow}
            className="rounded bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            ➕ नया छात्र जोड़ें
          </button>
          <button
            onClick={() => window.print()}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            📄 PDF / प्रिंट
          </button>
        </div>
      </div>

      {/* ============ CLASS SELECTOR ============ */}
      <div className="no-print mb-5 rounded-lg border border-slate-300 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold">कक्षा चुनें:</label>
          <select
            value={activeId}
            onChange={(e) => e.target.value && openSheet(e.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">-- चुनें --</option>
            {sheets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.class_name} ({s.session})
              </option>
            ))}
          </select>

          <button
            onClick={createSheet}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            ➕ नई कक्षा जोड़ें
          </button>

          {activeId && (
            <button
              onClick={() => deleteSheet(activeId)}
              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              🗑️ यह प्रपत्र हटाएं
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <label className="mr-2 font-semibold">कक्षा:</label>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="rounded border border-slate-300 px-2 py-1"
            />
          </div>
          <div>
            <label className="mr-2 font-semibold">सत्र:</label>
            <input
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="rounded border border-slate-300 px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* ============ SHEET ============ */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">लोड हो रहा है...</div>
      ) : !activeId ? (
        <div className="py-20 text-center text-slate-500">
          ऊपर से कक्षा चुनें या नई कक्षा जोड़ें
        </div>
      ) : (
        <div className="print-area rounded-lg bg-white p-6 shadow">
          <div className="mb-4 text-center">
            <h1 className="text-xl font-bold md:text-2xl">
              नवीन एकेडेमी उच्च माध्यमिक विद्यालय, चौहटन
            </h1>
            <h2 className="mt-1 flex flex-wrap items-center justify-center gap-2 text-base font-semibold md:text-lg">
              <span>फीस अपडेशन प्रपत्र</span>
              <span>कक्षा- <b>{className || '________'}</b></span>
              <span className="text-sm text-slate-600">सत्र: {session}</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="fee-table">
              <thead>
                <tr>
                  <th rowSpan={2} style={{ width: '3%' }}>क्र.सं.</th>
                  <th rowSpan={2} style={{ width: '20%' }}>नाम / पिता का नाम</th>
                  <th rowSpan={2} style={{ width: '9%' }}>मो. नं.</th>
                  <th rowSpan={2} style={{ width: '8%' }}>रूट नाम</th>
                  <th rowSpan={2} style={{ width: '7%' }}>पिछला</th>
                  <th rowSpan={2} style={{ width: '7%' }}>प्रवेश शुल्क</th>
                  <th rowSpan={2} style={{ width: '7%' }}>शिक्षण शुल्क</th>
                  <th rowSpan={2} style={{ width: '7%' }}>वाहन शुल्क</th>
                  <th rowSpan={2} style={{ width: '7%' }}>योग</th>
                  <th colSpan={2} style={{ fontSize: 10, fontStyle: 'italic', fontWeight: 'normal' }}>
                    पेंसिल से भरें
                  </th>
                  <th rowSpan={2} style={{ width: '9%' }}>दूरभाष दिनांक</th>
                  <th rowSpan={2} className="no-print" style={{ width: '5%' }}>#</th>
                </tr>
                <tr>
                  <th style={{ width: '7%' }}>कुल जमा</th>
                  <th style={{ width: '7%' }}>कुल बकाया</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const total = rowTotal(r);
                  const due = rowDue(r);
                  return (
                    <tr key={idx}>
                      <td>
                        <input
                          value={r.sno}
                          onChange={(e) => updateCell(idx, 'sno', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="text-left"
                          value={r.name}
                          onChange={(e) => updateCell(idx, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          value={r.mobile}
                          onChange={(e) => updateCell(idx, 'mobile', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          value={r.route}
                          onChange={(e) => updateCell(idx, 'route', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={r.previous_due}
                          onChange={(e) => updateCell(idx, 'previous_due', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={r.admission_fee}
                          onChange={(e) => updateCell(idx, 'admission_fee', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={r.tuition_fee}
                          onChange={(e) => updateCell(idx, 'tuition_fee', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={r.vehicle_fee}
                          onChange={(e) => updateCell(idx, 'vehicle_fee', e.target.value)}
                        />
                      </td>
                      <td className="bg-total">{total}</td>
                      <td>
                        <input
                          type="number"
                          value={r.paid}
                          onChange={(e) => updateCell(idx, 'paid', e.target.value)}
                        />
                      </td>
                      <td className="bg-due">{due}</td>
                      <td>
                        <input
                          value={r.phone_date}
                          placeholder="DD/MM/YYYY"
                          onChange={(e) => updateCell(idx, 'phone_date', e.target.value)}
                        />
                      </td>
                      <td className="no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openFeeModal(r)}
                            className="rounded bg-indigo-600 px-1.5 py-0.5 text-xs font-bold text-white hover:bg-indigo-700"
                            title="फीस जमा करें"
                          >
                            💰
                          </button>
                          <button
                            onClick={() => deleteRow(idx)}
                            className="font-bold text-red-600 hover:text-red-800"
                            title="हटाएं"
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ EXCEL IMPORT MODAL ============ */}
      <FeeImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImported}
      />

      {/* ============ FEE DEPOSIT MODAL ============ */}
      <FeeDepositModal
        open={feeModalOpen}
        onClose={() => {
          setFeeModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        className={className}
        session={session}
        onPaidChange={handlePaidChange}
        onStudentChange={handleStudentChange}
      />
    </div>
  );
}