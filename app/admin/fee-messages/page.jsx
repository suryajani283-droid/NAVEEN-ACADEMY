'use client';

import { useEffect, useMemo, useState } from 'react';
import { rowTotal, rowDue } from '@/lib/feePerforma';
import { buildFeeReminderMessage, openWhatsApp } from '@/lib/whatsappMessage';

/* localStorage key per day */
const sentKey = (date) => `fee_msgs_sent_${date}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function FeeMessagesPage() {
  const [sheets, setSheets] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [className, setClassName] = useState('');
  const [session, setSession] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({}); // student_id → bool
  const [sentToday, setSentToday] = useState({}); // student_id → timestamp
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('due-desc');
  const [toast, setToast] = useState('');

  const date = todayISO();

  /* Load class list */
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/fee-performa');
      const data = await res.json();
      setSheets(Array.isArray(data) ? data : []);
    })();
  }, []);

  /* Load sent log from localStorage on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(sentKey(date));
      setSentToday(raw ? JSON.parse(raw) : {});
    } catch {
      setSentToday({});
    }
  }, [date]);

  /* Load selected class students */
  useEffect(() => {
    if (!activeId) return;
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/admin/fee-performa/${activeId}`);
      const data = await res.json();
      setClassName(data.class_name || '');
      setSession(data.session || '');
      setStudents(data.students || []);
      setSelected({});
      setLoading(false);
    })();
  }, [activeId]);

  function persistSent(map) {
    setSentToday(map);
    try {
      localStorage.setItem(sentKey(date), JSON.stringify(map));
    } catch {}
  }

  function markSent(studentId) {
    const next = { ...sentToday, [studentId]: Date.now() };
    persistSent(next);
  }

  function clearSentHistory() {
    if (!confirm('आज का भेजा हुआ रिकॉर्ड साफ़ करें?')) return;
    persistSent({});
  }

  /* Enrich students with computed due */
  const enriched = useMemo(() => {
    return students
      .map((s) => ({
        ...s,
        due: rowDue(s),
        total: rowTotal(s),
      }))
      .filter((s) => s.due > 0); // only dues
  }, [students]);

  /* Apply search + sort */
  const filtered = useMemo(() => {
    let list = [...enriched];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          String(s.name || '').toLowerCase().includes(q) ||
          String(s.mobile || '').includes(q)
      );
    }
    if (sortBy === 'due-desc') list.sort((a, b) => b.due - a.due);
    if (sortBy === 'due-asc') list.sort((a, b) => a.due - b.due);
    if (sortBy === 'name') list.sort((a, b) => String(a.name).localeCompare(String(b.name)));

    return list;
  }, [enriched, search, sortBy]);

  /* Stats */
  const stats = useMemo(() => {
    const total = enriched.length;
    const totalDue = enriched.reduce((a, s) => a + s.due, 0);
    const sent = enriched.filter((s) => sentToday[s.id]).length;
    const pending = total - sent;
    return { total, totalDue, sent, pending };
  }, [enriched, sentToday]);

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );
  const selectedDue = useMemo(
    () => filtered.filter((s) => selected[s.id]).reduce((a, s) => a + s.due, 0),
    [filtered, selected]
  );

  function toggleSelect(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function selectAll() {
    const map = {};
    filtered.forEach((s) => { map[s.id] = true; });
    setSelected(map);
  }

  function selectAllPending() {
    const map = {};
    filtered.forEach((s) => { if (!sentToday[s.id]) map[s.id] = true; });
    setSelected(map);
  }

  function clearSelection() {
    setSelected({});
  }

  function sendOne(s) {
    const msg = buildFeeReminderMessage({
      studentName: s.name,
      className,
      due: s.due,
      session,
    });
    openWhatsApp(s.mobile, msg);
    markSent(s.id);
  }

  async function sendSelected() {
    const targets = filtered.filter((s) => selected[s.id]);
    if (!targets.length) {
      alert('कोई छात्र select नहीं किया।');
      return;
    }
    const noMobile = targets.filter((s) => !s.mobile);
    if (noMobile.length && !confirm(`${noMobile.length} छात्रों का मोबाइल नंबर नहीं है — बाकी ${targets.length - noMobile.length} को भेजें?`)) return;

    const valid = targets.filter((s) => s.mobile);
    if (!valid.length) {
      alert('किसी भी selected छात्र का मोबाइल नंबर नहीं है।');
      return;
    }

    setToast(`📱 ${valid.length} message खुल रहे हैं... (एक-एक करके)`);
    // open one by one with small delay so browser popup-blockers allow them
    for (let i = 0; i < valid.length; i++) {
      const s = valid[i];
      setTimeout(() => {
        sendOne(s);
        if (i === valid.length - 1) {
          setToast('✓ सभी message खोल दिए गए');
          setTimeout(() => setToast(''), 2500);
        }
      }, i * 900);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-slate-800">📱 फीस मैसेज भेजें</h1>
            <p className="text-xs text-slate-500">
              सिर्फ fee-performa के बकाया छात्रों को WhatsApp reminder
            </p>
          </div>
          {toast && <span className="text-sm font-semibold text-emerald-700">{toast}</span>}
        </div>

        {/* Selectors + Stats */}
        <div className="mb-4 rounded-lg border border-slate-300 bg-white p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">कक्षा</label>
              <select
                value={activeId}
                onChange={(e) => setActiveId(e.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-sm min-w-[200px]"
              >
                <option value="">-- कक्षा चुनें --</option>
                {sheets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.class_name} ({s.session})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">खोजें</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="नाम या मोबाइल"
                className="rounded border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">क्रम</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="due-desc">ज़्यादा बकाया पहले</option>
                <option value="due-asc">कम बकाया पहले</option>
                <option value="name">नाम अनुसार</option>
              </select>
            </div>

            <button
              onClick={clearSentHistory}
              className="ml-auto rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              title="आज का भेजा हुआ रिकॉर्ड साफ़ करें"
            >
              🔄 History clear
            </button>
          </div>

          {activeId && (
            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              <span className="text-slate-600">कुल बकाया छात्र: <b className="text-slate-800">{stats.total}</b></span>
              <span className="text-slate-600">कुल बकाया: <b className="text-rose-700">₹{stats.totalDue.toLocaleString('en-IN')}</b></span>
              <span className="text-slate-600">आज भेजे: <b className="text-emerald-700">{stats.sent}</b></span>
              <span className="text-slate-600">बाकी: <b className="text-amber-700">{stats.pending}</b></span>
            </div>
          )}
        </div>

        {/* Bulk action bar */}
        {activeId && filtered.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="text-sm font-semibold text-emerald-900">
              चुने गए: {selectedCount} {selectedCount > 0 && <>• ₹{selectedDue.toLocaleString('en-IN')}</>}
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                onClick={selectAll}
                className="rounded border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                सभी चुनें ({filtered.length})
              </button>
              <button
                onClick={selectAllPending}
                className="rounded border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                बाकी सभी चुनें ({stats.pending})
              </button>
              <button
                onClick={clearSelection}
                className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                हटाएँ
              </button>
              <button
                onClick={sendSelected}
                disabled={!selectedCount}
                className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                📱 चुने गए को भेजें ({selectedCount})
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {!activeId ? (
          <div className="rounded-lg bg-white py-20 text-center text-slate-500">
            ऊपर से कक्षा चुनें
          </div>
        ) : loading ? (
          <div className="rounded-lg bg-white py-20 text-center text-slate-500">लोड हो रहा है...</div>
        ) : !filtered.length ? (
          <div className="rounded-lg bg-white py-20 text-center text-slate-500">
            🎉 इस कक्षा में कोई बकाया छात्र नहीं है
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="border px-2 py-2 w-10">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && filtered.every((s) => selected[s.id])}
                      onChange={(e) => (e.target.checked ? selectAll() : clearSelection())}
                    />
                  </th>
                  <th className="border px-3 py-2">नाम</th>
                  <th className="border px-3 py-2">मो. नं.</th>
                  <th className="border px-3 py-2 text-right">बकाया ₹</th>
                  <th className="border px-3 py-2 text-center">Status</th>
                  <th className="border px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const isSent = !!sentToday[s.id];
                  const isSelected = !!selected[s.id];
                  const noMobile = !s.mobile;
                  return (
                    <tr
                      key={s.id}
                      className={
                        isSent
                          ? 'bg-emerald-50/60'
                          : isSelected
                          ? 'bg-amber-50'
                          : ''
                      }
                    >
                      <td className="border px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(s.id)}
                        />
                      </td>
                      <td className="border px-3 py-2 font-medium">{s.name || '—'}</td>
                      <td className={`border px-3 py-2 ${noMobile ? 'text-red-600' : ''}`}>
                        {s.mobile || '—'}
                      </td>
                      <td className="border px-3 py-2 text-right font-semibold text-rose-700">
                        {s.due.toLocaleString('en-IN')}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {isSent ? (
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                            ✓ भेजा
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <button
                          onClick={() => sendOne(s)}
                          disabled={noMobile}
                          className="rounded bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
                          title={noMobile ? 'मोबाइल नंबर नहीं है' : 'WhatsApp भेजें'}
                        >
                          📱 भेजें
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer hint */}
        <p className="mt-4 text-center text-xs text-slate-500">
          💡 Message भेजने पर WhatsApp खुलेगा — वहाँ से "Send" दबाएँ। एक-एक करके भेजें ताकि popup block न हो।
        </p>
      </div>
    </div>
  );
}