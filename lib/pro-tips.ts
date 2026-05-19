import { createClient } from "@/lib/supabase/server";
import type { ProTipRow } from "@/types/pro-tip";

export async function getProTips(): Promise<ProTipRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pro_tips")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load pro tips:", error.message);
    return [];
  }

  return (data ?? []) as ProTipRow[];
}
