import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const MAX_BYTES = 10 * 1024; // 10 KB

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const key = String(formData.get('key') || Date.now());

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'कोई फोटो नहीं मिली' }, { status: 400 });
    }
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ error: 'केवल image फ़ाइल चलेगी' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `फोटो 10 KB से कम होनी चाहिए (आपकी: ${(file.size / 1024).toFixed(1)} KB)` },
        { status: 400 }
      );
    }

    const fileName = `student-${key.replace(/[^a-zA-Z0-9-_]/g, '_')}-${Date.now()}.jpg`;
    const buf = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabaseAdmin.storage
      .from('student-photos')
      .upload(fileName, buf, {
        contentType: 'image/jpeg',
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