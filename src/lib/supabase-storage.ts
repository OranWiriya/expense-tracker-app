// src/lib/supabase-storage.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseStorage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPERBASE_SERVICE_ROLE_KEY!,
);
