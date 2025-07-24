import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getServerSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function setUserIdSessionVar(
  supabase: SupabaseClient,
  userId: string
) {
  await supabase.rpc("set_config", {
    key: "request.user.id",
    value: userId,
    is_local: true,
  });
}
