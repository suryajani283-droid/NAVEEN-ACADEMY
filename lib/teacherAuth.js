import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function verifyTeacherSession(request) {
  // Get the Supabase session cookie
  const token = request.cookies.get('sb-access-token')?.value;
  if (!token) throw new Error('Unauthorized');

  // Get user from Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error('Invalid session');

  // Check teachers table
  const { data: teacher, error: teacherError } = await supabase
    .from('teachers')
    .select('class, id')
    .eq('id', user.id)
    .single();

  if (teacherError || !teacher) throw new Error('Not a teacher');

  return { userId: user.id, class: teacher.class };
}