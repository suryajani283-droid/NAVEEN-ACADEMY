import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyAdminToken } from '../../../../../lib/auth';

export async function DELETE(request, { params }) {
  try {
    const payload = await verifyAdminToken(request);

    // If teacher, ensure they own this lecture (same class)
    if (payload.role === 'teacher' && payload.class) {
      const { data: existing } = await supabaseAdmin
        .from('video_lectures')
        .select('class')
        .eq('id', params.id)
        .single();

      // Allow deletion if:
      // - The lecture belongs to the teacher's class, OR
      // - The lecture is for "All classes" (class = null) – if you want to restrict this too, remove the second condition
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