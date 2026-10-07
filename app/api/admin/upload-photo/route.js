import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const key = String(formData.get('key') || Date.now());

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
    const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${safeKey}-${Date.now()}.${ext}`;

    const buf = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabaseAdmin.storage
      .from('student-photos')
      .upload(fileName, buf, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (upErr) throw upErr;

    const { data: pub } = supabaseAdmin.storage
      .from('student-photos')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: pub.publicUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}