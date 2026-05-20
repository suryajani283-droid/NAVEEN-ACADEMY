import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { pin, serial, roll } = await request.json();

    // PIN और serial से जुड़ा result_id ढूँढें
    const { data: pinData, error: pinError } = await supabaseAdmin
      .from('pins')
      .select('result_id')
      .eq('code', pin)
      .eq('serial_number', serial)
      .single();

    if (pinError || !pinData) {
      return NextResponse.json({ error: 'Invalid PIN or serial number' }, { status: 404 });
    }

    // result_id से पूरा रिजल्ट लें और roll_number भी मिलाएँ
    const { data: result, error: resultError } = await supabaseAdmin
      .from('results')
      .select('*')
      .eq('id', pinData.result_id)
      .eq('roll_number', roll)
      .single();

    if (resultError || !result) {
      return NextResponse.json({ error: 'No result found for this roll number' }, { status: 404 });
    }

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
