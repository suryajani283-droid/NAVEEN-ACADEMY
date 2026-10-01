export const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

export const rowTotal = (r) =>
  num(r.previous_due) + num(r.admission_fee) + num(r.tuition_fee) + num(r.vehicle_fee);

export const rowDue = (r) => rowTotal(r) - num(r.paid);

export function normalizeStudent(s = {}, index = 0) {
  return {
    sno: Number(s.sno) || index + 1,
    name: s.name ?? '',
    mobile: s.mobile ?? '',
    route: s.route ?? '',
    previous_due: num(s.previous_due),
    admission_fee: num(s.admission_fee),
    tuition_fee: num(s.tuition_fee),
    vehicle_fee: num(s.vehicle_fee),
    paid: num(s.paid),
    phone_date: s.phone_date ?? '',
  };
}