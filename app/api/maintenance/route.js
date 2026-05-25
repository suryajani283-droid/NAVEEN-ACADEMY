import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('homepage_content')
      .select('content')
      .eq('section', 'maintenance_mode')
      .single();
    if (error) throw error;
    
    return NextResponse.json(
      { maintenance_mode: data?.content === 'true' },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ maintenance_mode: false });
  }
}