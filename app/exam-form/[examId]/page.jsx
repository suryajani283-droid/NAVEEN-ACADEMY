'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

/* ---------- Image compression → under 10 KB ---------- */
async function compressImage(file, maxKB = 10) {
  const maxBytes = maxKB * 1024;

  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const tryEncode = (dim, quality) => {
    const ratio = img.width / img.height;
    let w, h;
    if (ratio > 1) { w = dim; h = Math.round(dim / ratio); }
    else { h = dim; w = Math.round(dim * ratio); }

    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  };

  let blob = null;
  for (let dim = 200; dim >= 50; dim -= 20) {
    for (let q = 0.75; q >= 0.1; q -= 0.1) {
      blob = await tryEncode(dim, q);
      if (blob && blob.size <= maxBytes) {
        URL.revokeObjectURL(img.src);
        return blob;
      }
    }
  }
  URL.revokeObjectURL(img.src);
  return blob; // best effort
}

export default function PublicExamFormPage() {
  const { examId } = useParams();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState('login'); // login | form | done

  const [loginClass, setLoginClass] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginDob, setLoginDob] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);

  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({
    father_name: '', mother_name: '', mobile: '',
    dob: '', gender: '', class_section: '',
    sr_no: '', photo_url: '', selected_subjects: [],
  });
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMsg, setPhotoMsg] = useState('');
  const [submitBusy, setSubmitBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/public/exam-form/${examId}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || 'फॉर्म उपलब्ध नहीं');
      else setExam(data);
      setLoading(false);
    })();
  }, [examId]);

  async function doLogin() {
    if (!loginClass) { setError('कृपया कक्षा चुनें'); return; }
    if (!loginName.trim()) { setError('कृपया नाम भरें'); return; }

    setLoginBusy(true); setError('');
    try {
      const res = await fetch(`/api/public/exam-form/${examId}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: loginName, dob: loginDob, class_name: loginClass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'लॉगिन fail');

      setStudent(data);
      setForm({
        father_name: data.father_name || '',
        mother_name: data.mother_name || '',
        mobile: data.mobile || '',
        dob: data.dob || '',
        gender: data.gender || '',
        class_section: data.confirmed_class || data.class_section || loginClass,
        sr_no: data.sr_no || '',
        photo_url: data.photo_url || '',
        selected_subjects: Array.isArray(data.selected_subjects) ? data.selected_subjects : [],
      });
      setStep('form');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoginBusy(false);
    }
  }

  async function handlePhoto(file) {
    if (!file) return;
    setPhotoBusy(true); setPhotoMsg(''); setError('');
    try {
      // client-side compress to under 10 KB
      const blob = await compressImage(file, 10);
      const kb = (blob.size / 1024).toFixed(1);
      setPhotoMsg(`📦 Compress किया: ${kb} KB`);

      if (blob.size > 10 * 1024) {
        throw new Error(`फोटो ${kb} KB है — 10 KB से कम नहीं हो पाई। कोई सादी / कम resolution वाली फोटो चुनें।`);
      }

      const compressedFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      const fd = new FormData();
      fd.append('file', compressedFile);
      fd.append('key', student.id);

      const res = await fetch('/api/public/upload-photo', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload fail');

      setForm((p) => ({ ...p, photo_url: data.url }));
      setPhotoMsg(`✓ फोटो अपलोड (${kb} KB)`);
    } catch (e) {
      setError(e.message);
      setPhotoMsg('');
    } finally {
      setPhotoBusy(false);
    }
  }

  function toggleSubject(s) {
    setForm((p) => {
      const has = p.selected_subjects.includes(s);
      return {
        ...p,
        selected_subjects: has
          ? p.selected_subjects.filter((x) => x !== s)
          : [...p.selected_subjects, s],
      };
    });
  }

  async function doSubmit() {
    if (!form.father_name.trim()) { setError('पिता का नाम ज़रूरी है'); return; }
    if (!form.mother_name.trim()) { setError('माता का नाम ज़रूरी है'); return; }
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) {
      setError('मोबाइल नंबर 10 अंकों का होना चाहिए'); return;
    }
    if (!form.dob) { setError('जन्म तिथि ज़रूरी है'); return; }
    if (!form.gender) { setError('लिंग चुनें'); return; }
    if (!form.sr_no.trim()) { setError('SR नंबर ज़रूरी है'); return; }
    if (!form.photo_url) { setError('कृपया फोटो अपलोड करें'); return; }
    if (!form.selected_subjects.length) { setError('कम से कम एक विषय चुनें'); return; }

    setSubmitBusy(true); setError('');
    try {
      const res = await fetch(`/api/public/exam-form/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: student.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit fail');
      setStep('done');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitBusy(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">लोड हो रहा है...</div>;
  }

  if (!exam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md rounded-lg bg-white p-6 text-center shadow">
          <div className="mb-3 text-4xl">🚫</div>
          <h1 className="mb-2 text-lg font-bold text-slate-800">फॉर्म उपलब्ध नहीं</h1>
          <p className="text-sm text-slate-600">{error || 'स्कूल से संपर्क करें'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6">
      <div className="mx-auto max-w-md">
        <div className="mb-4 rounded-lg bg-white px-4 py-3 shadow-sm">
          <h1 className="text-center text-base font-bold text-slate-800">
            नवीन एकेडेमी उच्च माध्यमिक विद्यालय, चौहटन
          </h1>
          <p className="mt-1 text-center text-xs text-slate-500">
            {exam.name} • {exam.session}
          </p>
        </div>

        {/* ============ LOGIN ============ */}
        {step === 'login' && (
          <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="mb-1 text-center text-lg font-bold text-slate-800">छात्र लॉगिन</h2>
            <p className="mb-4 text-center text-xs text-slate-500">
              पहले कक्षा चुनें, फिर नाम व जन्म तिथि भरें
            </p>

            <label className="mb-1 block text-xs font-semibold text-slate-700">कक्षा *</label>
            <select
              value={loginClass}
              onChange={(e) => setLoginClass(e.target.value)}
              className="mb-3 w-full rounded border border-slate-300 px-3 py-3 text-sm"
            >
              <option value="">-- कक्षा चुनें --</option>
              {(exam.classes || []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label className="mb-1 block text-xs font-semibold text-slate-700">छात्र का नाम *</label>
            <input
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              placeholder="पूरा नाम (जैसा स्कूल रिकॉर्ड में)"
              className="mb-3 w-full rounded border border-slate-300 px-3 py-3 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700">
              जन्म तिथि (DD/MM/YYYY)
            </label>
            <input
              type="date"
              value={loginDob}
              onChange={(e) => setLoginDob(e.target.value)}
              className="mb-4 w-full rounded border border-slate-300 px-3 py-3 text-sm"
            />

            {error && (
              <div className="mb-3 rounded bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
            )}

            <button
              onClick={doLogin}
              disabled={loginBusy}
              className="w-full rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loginBusy ? 'जाँच हो रही है...' : '→ आगे बढ़ें'}
            </button>

            <p className="mt-4 text-center text-[11px] text-slate-400">
              नाम न मिले तो स्कूल कार्यालय में संपर्क करें
            </p>
          </div>
        )}

        {/* ============ FORM ============ */}
        {step === 'form' && student && (
          <div className="rounded-lg bg-white p-5 shadow">
            <div className="mb-4 rounded bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              ✓ छात्र मिला: <b>{student.student_name}</b>
              {form.class_section && <> • {form.class_section}</>}
            </div>

            <h2 className="mb-3 text-base font-bold text-slate-800">विवरण भरें</h2>

            {/* PHOTO */}
            <div className="mb-5 flex flex-col items-center">
              {form.photo_url ? (
                <img
                  src={form.photo_url}
                  alt=""
                  className="mb-2 h-32 w-24 border-2 border-slate-300 object-cover"
                />
              ) : (
                <div className="mb-2 flex h-32 w-24 items-center justify-center border-2 border-dashed border-slate-300 text-xs text-slate-400">
                  फोटो
                </div>
              )}
              <label className="cursor-pointer rounded bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                {photoBusy ? 'अपलोड हो रहा है...' : form.photo_url ? '📷 फोटो बदलें' : '📷 फोटो अपलोड करें'}
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  disabled={photoBusy}
                  onChange={(e) => handlePhoto(e.target.files?.[0])}
                />
              </label>
              <p className="mt-1 text-center text-[10px] text-slate-500">
                📸 पासपोर्ट साइज़ फोटो • फोटो auto-compress होकर 10 KB से कम होगी
              </p>
              {photoMsg && (
                <p className="mt-1 text-[10px] font-semibold text-emerald-700">{photoMsg}</p>
              )}
            </div>

            {/* SR */}
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              SR नंबर * <span className="text-[10px] font-normal text-slate-400">(स्कूल रिकॉर्ड में जो SR नंबर है)</span>
            </label>
            <input
              value={form.sr_no}
              onChange={(e) => setForm({ ...form, sr_no: e.target.value })}
              placeholder="e.g. 12345"
              className="mb-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700">पिता का नाम *</label>
            <input
              value={form.father_name}
              onChange={(e) => setForm({ ...form, father_name: e.target.value })}
              className="mb-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700">माता का नाम *</label>
            <input
              value={form.mother_name}
              onChange={(e) => setForm({ ...form, mother_name: e.target.value })}
              className="mb-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700">मोबाइल नंबर *</label>
            <input
              type="tel"
              inputMode="numeric"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="10 अंकों का नंबर"
              className="mb-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700">जन्म तिथि *</label>
            <input
              type="date"
              value={form.dob && /^\d{4}-\d{2}-\d{2}$/.test(form.dob) ? form.dob : ''}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              className="mb-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="mb-1 block text-xs font-semibold text-slate-700">लिंग *</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="mb-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">— चुनें —</option>
              <option value="पुरुष / Male">पुरुष</option>
              <option value="महिला / Female">महिला</option>
              <option value="अन्य / Other">अन्य</option>
            </select>

            <label className="mb-1 block text-xs font-semibold text-slate-700">कक्षा</label>
            <input
              value={form.class_section}
              onChange={(e) => setForm({ ...form, class_section: e.target.value })}
              className="mb-4 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />

            {/* SUBJECTS */}
            {exam.subject_options?.length > 0 && (
              <div className="mb-4">
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  विषय चुनें * <span className="text-[10px] font-normal text-slate-400">(जो विषय आप देंगे)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {exam.subject_options.map((s) => {
                    const checked = form.selected_subjects.includes(s);
                    return (
                      <label
                        key={s}
                        className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-xs ${
                          checked ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSubject(s)}
                        />
                        <span className="font-medium">{s}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-3 rounded bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
            )}

            <button
              onClick={doSubmit}
              disabled={submitBusy}
              className="w-full rounded bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitBusy ? 'सेव हो रहा है...' : '✓ जानकारी सेव करें'}
            </button>

            <button
              onClick={() => { setStep('login'); setError(''); }}
              className="mt-2 w-full rounded border border-slate-300 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
            >
              ← वापस जाएँ
            </button>
          </div>
        )}

        {/* ============ DONE ============ */}
        {step === 'done' && (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <div className="mb-3 text-5xl">✅</div>
            <h2 className="mb-2 text-lg font-bold text-emerald-700">
              जानकारी सफलतापूर्वक सेव हो गई!
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              आपका विवरण विद्यालय को मिल गया है। Admit Card प्रिंट होकर आपको मिल जाएगा।
            </p>
            <div className="rounded bg-slate-50 px-3 py-2 text-xs text-slate-600">
              नाम: <b>{student?.student_name}</b><br />
              कक्षा: <b>{form.class_section}</b><br />
              विषय: <b>{form.selected_subjects.join(', ') || '—'}</b>
            </div>
            <button
              onClick={() => window.close()}
              className="mt-5 rounded border border-slate-300 px-4 py-2 text-xs text-slate-600"
            >
              बंद करें
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-[10px] text-slate-400">
          नवीन एकेडेमी उच्च माध्यमिक विद्यालय, चौहटन
        </p>
      </div>
    </div>
  );
}