'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ExamsListPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    class_name: '',
    session: '2025-26',
    exam_type: 'Half Yearly',
    instructions: '',
  });

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/exams');
    const data = await res.json();
    setExams(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createExam() {
    if (!form.name || !form.class_name) {
      alert('परीक्षा का नाम और कक्षा ज़रूरी है');
      return;
    }
    const res = await fetch('/api/admin/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) { alert('बनाने में त्रुटि'); return; }
    setForm({ name: '', class_name: '', session: '2025-26', exam_type: 'Half Yearly', instructions: '' });
    setShowForm(false);
    load();
  }

  async function deleteExam(id, name) {
    if (!confirm(`"${name}" हटाना है?`)) return;
    await fetch(`/api/admin/exams/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">📝 परीक्षा प्रबंधन</h1>
            <p className="text-xs text-slate-500">Admit Card बनाएँ और प्रिंट करें</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {showForm ? '✕ बंद करें' : '➕ नई परीक्षा'}
          </button>
        </div>

        {showForm && (
          <div className="mb-5 rounded-lg border border-slate-300 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">परीक्षा का नाम *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="अर्धवार्षिक परीक्षा 2025-26"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">कक्षा *</label>
                <input
                  value={form.class_name}
                  onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                  placeholder="10th A / 11th Science"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">सत्र</label>
                <input
                  value={form.session}
                  onChange={(e) => setForm({ ...form, session: e.target.value })}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">परीक्षा प्रकार</label>
                <select
                  value={form.exam_type}
                  onChange={(e) => setForm({ ...form, exam_type: e.target.value })}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  <option>Half Yearly</option>
                  <option>Annual</option>
                  <option>Unit Test</option>
                  <option>Quarterly</option>
                  <option>Pre-Board</option>
                  <option>Monthly Test</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  निर्देश (हर line एक निर्देश — खाली छोड़ें तो default आएँगे)
                </label>
                <textarea
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  rows={4}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="परीक्षा से 15 मिनट पूर्व कक्ष में प्रवेश करें..."
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="rounded border border-slate-300 px-4 py-2 text-sm"
              >
                रद्द करें
              </button>
              <button
                onClick={createExam}
                className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                ✓ बनाएँ
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-lg bg-white py-20 text-center text-slate-500">लोड हो रहा है...</div>
        ) : !exams.length ? (
          <div className="rounded-lg bg-white py-20 text-center text-slate-500">
            कोई परीक्षा नहीं है — ऊपर से नई परीक्षा बनाएँ
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {exams.map((e) => (
              <div key={e.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2">
                  <h3 className="font-bold text-slate-800">{e.name}</h3>
                  <p className="text-xs text-slate-500">
                    {e.class_name} • {e.session} • {e.exam_type}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/exams/${e.id}`}
                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    ✏️ खोलें
                  </Link>
                  <button
                    onClick={() => deleteExam(e.id, e.name)}
                    className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    🗑️ हटाएँ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}