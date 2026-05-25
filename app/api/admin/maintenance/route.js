export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const { enabled } = await request.json();

    // Use upsert so the row is created if missing
    const { error } = await supabaseAdmin
      .from('homepage_content')
      .upsert(
        { section: 'maintenance_mode', content: enabled ? 'true' : 'false' },
        { onConflict: 'section' }   // assumes 'section' is unique
      );

    if (error) throw error;
    return NextResponse.json({ success: true, maintenance_mode: enabled });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}