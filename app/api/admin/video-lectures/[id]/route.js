import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyAdminToken } from '../../../../../lib/auth';

export async function DELETE(request, { params }) {
  try {
    const payload = await verifyAdminToken(request);

    if (payload.role === 'teacher' && payload.class) {
      const { data: existing } = await supabaseAdmin
        .from('video_lectures')
        .select('class')
        .eq('id', params.id)
        .single();

      if (!existing || (existing.class !== null && String(existing.class) !== String(payload.class))) {
        return NextResponse.json(
          { error: 'You can only delete lectures for your own class' },
          { status: 403 }
        );
      }
    }

    const { error } = await supabaseAdmin
      .from('video_lectures')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}