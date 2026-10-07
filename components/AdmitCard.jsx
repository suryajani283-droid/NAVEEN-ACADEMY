'use client';

export default function AdmitCard({ exam, student, school }) {
  const {
    name: schoolName = 'नवीन एकेडेमी उच्च माध्यमिक विद्यालय, चौहटन',
    address = 'चौहटन, बाड़मेर (राजस्थान)',
    affiliation = 'RBSE Affiliation No: 1730XXX',
  } = school || {};

  const subjects = exam.subjects || [];
  const instructions = (exam.instructions || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  const defaultInstructions = [
    'परीक्षा से 15 मिनट पूर्व परीक्षा कक्ष में प्रवेश करें।',
    'परीक्षा कक्ष में मोबाइल, किताब, नोट्स ले जाना वर्जित है।',
    'प्रवेश पत्र के बिना परीक्षा में प्रवेश नहीं मिलेगा।',
    'प्रश्न पत्र हिन्दी व अंग्रेजी दोनों में उपलब्ध होगा।',
    'उत्तर पुस्तिका पर रोल नंबर व नाम स्पष्ट लिखें।',
  ];

  const insList = instructions.length ? instructions : defaultInstructions;

  const fmtDate = (d) => {
    if (!d) return '—';
    try {
      const dt = new Date(d);
      const dd = String(dt.getDate()).padStart(2, '0');
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}/${dt.getFullYear()}`;
    } catch { return d; }
  };

  return (
    <div className="admit-card">
      {/* HEADER */}
      <div className="ac-header">
        <div className="ac-logo-box">
  <img
    src="https://suryajani28-cejdx.wordpress.com/wp-content/uploads/2026/03/img-20260322-wa0012.jpg"
    alt="School Logo"
  />
</div>
        <div className="ac-header-text">
          <h1>{schoolName}</h1>
          <p className="ac-addr">{address}</p>
          {affiliation && <p className="ac-aff">{affiliation}</p>}
          <div className="ac-exam-title">
            {exam.name || 'परीक्षा'} — {exam.session || ''}
          </div>
          <div className="ac-card-label">प्रवेश पत्र / ADMIT CARD</div>
        </div>
      </div>

      {/* STUDENT DETAILS + PHOTO */}
      <div className="ac-body">
        <div className="ac-details">
          <table className="ac-details-table">
            <tbody>
              <tr>
                <td className="lbl">रोल नंबर / Roll No.</td>
                <td className="val bold">{student.roll_no || '—'}</td>
                <td className="lbl">नामांकन / Enroll. No.</td>
                <td className="val">{student.enrollment_no || '—'}</td>
              </tr>
              <tr>
                <td className="lbl">छात्र का नाम / Name</td>
                <td className="val bold" colSpan={3}>{student.student_name || '—'}</td>
              </tr>
              <tr>
                <td className="lbl">पिता का नाम / Father</td>
                <td className="val">{student.father_name || '—'}</td>
                <td className="lbl">माता का नाम / Mother</td>
                <td className="val">{student.mother_name || '—'}</td>
              </tr>
              <tr>
                <td className="lbl">कक्षा / Class</td>
                <td className="val bold">{student.class_section || exam.class_name || '—'}</td>
                <td className="lbl">जन्म तिथि / DOB</td>
                <td className="val">{student.dob || '—'}</td>
              </tr>
              <tr>
                <td className="lbl">लिंग / Gender</td>
                <td className="val">{student.gender || '—'}</td>
                <td className="lbl">मोबाइल / Mobile</td>
                <td className="val">{student.mobile || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="ac-photo">
          {student.photo_url ? (
            <img src={student.photo_url} alt="photo" />
          ) : (
            <span>फोटो<br />PHOTO</span>
          )}
        </div>
      </div>

      {/* SUBJECT SCHEDULE */}
      <div className="ac-schedule">
        <table className="ac-schedule-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>क्र.</th>
              <th style={{ width: '32%' }}>विषय / Subject</th>
              <th style={{ width: '20%' }}>दिनांक / Date</th>
              <th style={{ width: '20%' }}>समय / Time</th>
              <th style={{ width: '20%' }}>हस्ताक्षर</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td className="left">{s.subject || '—'}</td>
                <td>{fmtDate(s.exam_date)}</td>
                <td>{s.start_time || ''}{s.end_time ? ` - ${s.end_time}` : ''}</td>
                <td></td>
              </tr>
            ))}
            {subjects.length < 6 &&
              Array.from({ length: 6 - subjects.length }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td>&nbsp;</td><td></td><td></td><td></td><td></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* INSTRUCTIONS */}
      <div className="ac-instructions">
        <div className="ac-ins-title">महत्वपूर्ण निर्देश / Important Instructions:</div>
        <ol>
          {insList.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </div>

      {/* SIGNATURES */}
      <div className="ac-signatures">
        <div className="ac-sign">
          <div className="ac-sign-line"></div>
          <div className="ac-sign-label">छात्र हस्ताक्षर</div>
        </div>
        <div className="ac-sign">
          <div className="ac-sign-line"></div>
          <div className="ac-sign-label">कक्षाध्यापक</div>
        </div>
        <div className="ac-sign">
          <div className="ac-sign-line"></div>
          <div className="ac-sign-label">प्राचार्य / Principal</div>
        </div>
      </div>

      <div className="ac-footnote">
        यह प्रवेश पत्र विद्यालय द्वारा जारी किया गया है। किसी भी प्रकार की छेड़छाड़ अनुशासनहीनता मानी जाएगी।
      </div>
    </div>
  );
}