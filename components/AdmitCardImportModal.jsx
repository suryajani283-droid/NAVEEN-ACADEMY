'use client';

import { useState } from 'react';
import { parseAdmitExcel, guessAdmitField, mapAdmitRows } from '@/lib/admitCardExcelParser';

const FIELD_LABELS = {
  roll_no:       'रोल नंबर',
  student_name:  'छात्र का नाम',
  father_name:   'पिता का नाम',
  mother_name:   'माता का नाम',
  mobile:        'मोबाइल',
  class_section: 'कक्षा',
  dob:           'जन्म तिथि',
  gender:        'लिंग',
  enrollment_no: 'नामांकन क्रमांक',
  photo_url:     'फोटो URL',
};

export default function AdmitCardImportModal({ open, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [mode, setMode] = useState('replace');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  async function handleFile(f) {
    setBusy(true); setError('');
    try {
      const { headers, rows } = await parseAdmitExcel(f);
      if (!headers.length || !rows.length) {
        throw new Error('फ़ाइल में कोई डेटा नहीं मिला।');
      }
      setFile(f);
      setHeaders(headers);
      setRawRows(rows);

      const auto = {};
      const used = new Set();
      headers.forEach((h, i) => {
        const g = guessAdmitField(h);
        if (g && !used.has(g)) { auto[i] = g; used.add(g); }
      });
      setMapping(auto);
    } catch (e) {
      setError('फ़ाइल पढ़ने में त्रुटि: ' + e.message);
    } finally {
      setBusy(false);
    }
  }

  function doImport() {
    const students = mapAdmitRows(headers, rawRows, mapping);
    if (!students.length) {
      setError('कोई मान्य पंक्ति नहीं मिली। कॉलम मैपिंग जांचें।');
      return;
    }
    onImport(students, mode);
    closeAndReset();
  }

  function closeAndReset() {
    setFile(null); setHeaders([]); setRawRows([]);
    setMapping({}); setMode('replace'); setError('');
    onClose();
  }

  const preview = rawRows.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">📊 Excel से छात्र आयात करें</h2>
          <button onClick={closeAndReset} className="text-2xl leading-none text-slate-500 hover:text-black">×</button>
        </div>

        {!file && (
          <div className="rounded border-2 border-dashed border-slate-300 p-10 text-center">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="mx-auto block"
            />
            <p className="mt-3 text-sm text-slate-500">
              Excel (.xlsx, .xls) या CSV — छात्र details की file चुनें।
            </p>
            <p className="mt-1 text-xs text-slate-400">
              कॉलम: रोल नं, नाम, पिता का नाम, माता, मोबाइल, कक्षा, जन्म तिथि, लिंग, नामांकन
            </p>
            {busy && <p className="mt-3 text-sm text-blue-600">पढ़ा जा रहा है...</p>}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        )}

        {file && (
          <>
            <div className="mb-4 rounded bg-slate-50 p-3 text-sm">
              📄 <b>{file.name}</b> — {rawRows.length} पंक्तियाँ मिलीं
            </div>

            <div className="mb-5">
              <h3 className="mb-2 font-semibold">कॉलम मैपिंग (auto — ज़रूरत हो तो बदलें)</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {headers.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-32 truncate rounded bg-slate-100 px-2 py-1" title={h}>
                      {h || `Column ${i + 1}`}
                    </span>
                    <span>→</span>
                    <select
                      value={mapping[i] ?? ''}
                      onChange={(e) => {
                        const v = e.target.value;
                        setMapping((m) => {
                          const next = { ...m };
                          if (v) {
                            Object.keys(next).forEach((k) => {
                              if (next[k] === v) delete next[k];
                            });
                            next[i] = v;
                          } else {
                            delete next[i];
                          }
                          return next;
                        });
                      }}
                      className="flex-1 rounded border border-slate-300 px-2 py-1"
                    >
                      <option value="">— छोड़ें —</option>
                      {Object.entries(FIELD_LABELS).map(([k, label]) => (
                        <option key={k} value={k}>{label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="mb-2 font-semibold">पूर्वावलोकन (पहली 5 पंक्तियाँ)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      {headers.map((h, i) => (
                        <th key={i} className="border bg-slate-100 px-2 py-1 text-left">
                          <div>{h || `Col ${i + 1}`}</div>
                          <div className="text-[10px] font-normal text-blue-600">
                            {mapping[i] ? `→ ${FIELD_LABELS[mapping[i]]}` : '—'}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((r, ri) => (
                      <tr key={ri}>
                        {headers.map((_, ci) => (
                          <td key={ci} className="border px-2 py-1">
                            {String(r[ci] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" checked={mode === 'append'} onChange={() => setMode('append')} />
                मौजूदा सूची में जोड़ें
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={mode === 'replace'} onChange={() => setMode('replace')} />
                मौजूदा सूची बदलें
              </label>
            </div>

            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2">
              <button onClick={closeAndReset} className="rounded border border-slate-300 px-4 py-2 text-sm">
                रद्द करें
              </button>
              <button
                onClick={doImport}
                className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                ✓ आयात करें
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}