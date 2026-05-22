import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyAdminToken } from '../../../../../lib/auth';

export async function DELETE(request, { params }) {
  try {
    await verifyAdminToken(request);
    // Delete from auth first
    await supabaseAdmin.auth.admin.deleteUser(params.id);
    // Cascade will remove from teachers table
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}