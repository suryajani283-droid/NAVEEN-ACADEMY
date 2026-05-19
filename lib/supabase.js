import { createClient } from '@supabase/supabase-js'

// पब्लिक क्लाइंट (ब्राउज़र से सेफ)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// एडमिन क्लाइंट (सिर्फ सर्वर साइड – API रूट में)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
