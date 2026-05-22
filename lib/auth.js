import { jwtVerify } from 'jose';

export async function verifyAdminToken(request) {
  const token = request.cookies.get('adminToken')?.value;
  if (!token) throw new Error('Unauthorized');
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  if (payload.role !== 'admin' && payload.role !== 'teacher') throw new Error('Forbidden');
  return payload;
}
