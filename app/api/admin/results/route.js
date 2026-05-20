export async function POST(request) {
  try {
    await verifyAdminToken(request);
    const body = await request.json();

    const { data: result, error } = await supabaseAdmin
      .from('results')
      .insert({
        student_name: body.student_name,
        father_name: body.father_name,
        class: body.class,
        roll_number: body.roll_number,
        dob: body.dob,
        exam_type: body.exam_type,
        subjects: body.subjects,
        total: body.total,
        percentage: body.percentage,
        grade: body.grade,
        email: body.email || null,
      })
      .single();

    if (error) throw error;
    return NextResponse.json({ result }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
