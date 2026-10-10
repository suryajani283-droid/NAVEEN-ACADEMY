'use client';

import { useEffect, useState } from 'react';
import { rowTotal } from '@/lib/feePerforma';

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function FeeDepositModal({
  open,
  onClose,
  student,
  className,
  session,
  onPaidChange,
  onStudentChange,
}) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: '', date: todayISO(), note: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  /* Editable student details */
  const [details, setDetails] = useState({
    father_name: '',
    mother_name: '',
    sr_no: '',
    dob: '',
  });
  const [savingDetails, setSavingDetails] = useState(false);
  const [detailsToast, setDetailsToast] = useState('');

  useEffect(() => {
    if (!open || !student) return;
    setForm({ amount: '', date: todayISO(), note: '' });
    setError('');
    setToast('');
    setDetails({
      father_name: student.father_name || '',
      mother_name: student.mother_name || '',
      sr_no: student.sr_no || '',
      dob: student.dob || '',
    });
    setDetailsToast('');
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, student?.id]);

  async function loadPayments() {
    if (!student) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/fee-performa/payments?student_id=${student.id}`
      );
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      setPayments([]);
    }
    setLoading(false);
  }

  const totalFee = rowTotal(student || {});
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const due = totalFee - totalPaid;

  /* ---------- Save student details ---------- */
  async function saveDetails() {
    if (!student) return;
    setSavingDetails(true);
    setDetailsToast('');
    try {
      const res = await fetch(
        `/api/admin/fee-performa/student/${student.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save fail');

      setDetailsToast('✓ जानकारी सेव हो गई');
      setTimeout(() => setDetailsToast(''), 2500);

      /* Update parent state so table shows new values */
      if (onStudentChange && data.student) {
        onStudentChange(student.id, data.student);
      }
    } catch (e) {
      setDetailsToast('✗ ' + e.message);
      setTimeout(() => setDetailsToast(''), 3000);
    } finally {
      setSavingDetails(false);
    }
  }

  /* ---------- Add payment ---------- */
  async function handleAdd() {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      setError('राशि सही भरें');
      return;
    }
    if (!form.date) {
      setError('दिनांक ज़रूरी है');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/fee-performa/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          performa_id: student.performa_id,
          amount,
          payment_date: form.date,
          note: form.note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save fail');

      setForm({ amount: '', date: todayISO(), note: '' });
      await loadPayments();
      if (onPaidChange) onPaidChange(student.id, Number(data.paid || 0));
      setToast('✓ फीस जमा हो गई');
      setTimeout(() => setToast(''), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(paymentId) {
    if (!confirm('यह payment हटाएँ?')) return;
    try {
      const res = await fetch(`/api/admin/fee-performa/payments/${paymentId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete fail');
      await loadPayments();
      if (onPaidChange) onPaidChange(student.id, Number(data.paid || 0));
      setToast('✓ हटा दिया');
      setTimeout(() => setToast(''), 2000);
    } catch (e) {
      setError(e.message);
    }
  }

  if (!open || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">💰 फीस जमा करें</h2>
            <p className="text-xs text-slate-500">
              {className} {session && <>• {session}</>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-slate-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* ============ STUDENT DETAILS — editable ============ */}
        <div className="mb-3 rounded border border-indigo-200 bg-indigo-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-indigo-900">
              👤 छात्र विवरण (भरें / सुधारें)
            </p>
            {detailsToast && (
              <span className="text-[11px] font-semibold text-emerald-700">
                {detailsToast}
              </span>
            )}
          </div>

          <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* Name — read only */}
            <div className="sm:col-span-2">
              <label className="mb-0.5 block text-[10px] font-semibold text-slate-600">
                छात्र का नाम
              </label>
              <input
                value={student.name || ''}
                readOnly
                className="w-full cursor-not-allowed rounded border border-slate-200 bg-slate-100 px-2 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-slate-600">
                पिता का नाम
              </label>
              <input
                value={details.father_name}
                onChange={(e) =>
                  setDetails({ ...details, father_name: e.target.value })
                }
                placeholder="पिता का नाम"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-slate-600">
                माता का नाम
              </label>
              <input
                value={details.mother_name}
                onChange={(e) =>
                  setDetails({ ...details, mother_name: e.target.value })
                }
                placeholder="माता का नाम"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-slate-600">
                SR नंबर
              </label>
              <input
                value={details.sr_no}
                onChange={(e) =>
                  setDetails({ ...details, sr_no: e.target.value })
                }
                placeholder="जैसे 12345"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-slate-600">
                जन्म तिथि
              </label>
              <input
                type="date"
                value={
                  details.dob && /^\d{4}-\d{2}-\d{2}$/.test(details.dob)
                    ? details.dob
                    : ''
                }
                onChange={(e) => setDetails({ ...details, dob: e.target.value })}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2 text-[11px] text-slate-600">
              <span className="font-semibold">कक्षा:</span>{' '}
              {student.class_section || className || '—'}
              {' • '}
              <span className="font-semibold">मोबाइल:</span>{' '}
              {student.mobile || '—'}
            </div>
          </div>

          <button
            onClick={saveDetails}
            disabled={savingDetails}
            className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {savingDetails ? 'सेव हो रहा है...' : '💾 जानकारी सेव करें'}
          </button>
        </div>

        {/* ============ FEE SUMMARY ============ */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          <div className="rounded border border-slate-200 bg-white p-2 text-center">
            <div className="text-[10px] uppercase text-slate-500">कुल फीस</div>
            <div className="text-lg font-bold text-slate-800">
              ₹{totalFee.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="rounded border border-emerald-200 bg-emerald-50 p-2 text-center">
            <div className="text-[10px] uppercase text-emerald-700">जमा</div>
            <div className="text-lg font-bold text-emerald-700">
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
          </div>
          <div
            className={`rounded border p-2 text-center ${
              due > 0
                ? 'border-rose-200 bg-rose-50'
                : 'border-green-200 bg-green-50'
            }`}
          >
            <div
              className={`text-[10px] uppercase ${
                due > 0 ? 'text-rose-700' : 'text-green-700'
              }`}
            >
              बकाया
            </div>
            <div
              className={`text-lg font-bold ${
                due > 0 ? 'text-rose-700' : 'text-green-700'
              }`}
            >
              ₹{Math.max(0, due).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* ============ ADD PAYMENT ============ */}
        <div className="mb-3 rounded border border-emerald-200 bg-emerald-50 p-3">
          <p className="mb-2 text-xs font-bold text-emerald-900">
            ➕ नई फीस जमा करें
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-slate-600">
                राशि ₹ *
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="जैसे 5000"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-slate-600">
                दिनांक *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-slate-600">
                नोट (optional)
              </label>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="नकद / UPI"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'सेव हो रहा है...' : '✓ फीस जमा करें'}
            </button>
            {toast && (
              <span className="text-xs font-semibold text-green-700">{toast}</span>
            )}
          </div>
        </div>

        {/* ============ HISTORY ============ */}
        <div>
          <p className="mb-2 text-xs font-bold text-slate-700">
            📜 जमा इतिहास ({payments.length})
          </p>
          {loading ? (
            <p className="py-4 text-center text-xs text-slate-500">
              लोड हो रहा है...
            </p>
          ) : !payments.length ? (
            <p className="rounded border border-dashed border-slate-300 py-4 text-center text-xs text-slate-500">
              अभी कोई फीस जमा नहीं हुई
            </p>
          ) : (
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border-b px-2 py-1.5 text-left">दिनांक</th>
                    <th className="border-b px-2 py-1.5 text-right">राशि ₹</th>
                    <th className="border-b px-2 py-1.5 text-left">नोट</th>
                    <th className="w-10 border-b px-2 py-1.5 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="border-b px-2 py-1.5">
                        {p.payment_date || '—'}
                      </td>
                      <td className="border-b px-2 py-1.5 text-right font-semibold text-emerald-700">
                        {Number(p.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="border-b px-2 py-1.5 text-slate-500">
                        {p.note || '—'}
                      </td>
                      <td className="border-b px-2 py-1.5 text-center">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="font-bold text-red-600 hover:text-red-800"
                          title="हटाएँ"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold">
                    <td className="px-2 py-1.5 text-right">कुल:</td>
                    <td className="px-2 py-1.5 text-right text-emerald-700">
                      ₹{totalPaid.toLocaleString('en-IN')}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}