import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyAdminToken } from '../../../../../lib/auth';

export async function DELETE(request, { params }) {
  try {
    await verifyAdminToken(request);
    const { error } = await supabaseAdmin
      .from('downloads')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
