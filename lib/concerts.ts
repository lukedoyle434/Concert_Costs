import { createClient } from "@/lib/supabase/server";
import { enrichConcert } from "@/lib/concert-math";
import type { ConcertRow } from "@/types/concert";

export async function getUserConcerts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("concert_date", { ascending: false });

  if (error) {
    console.error("Failed to load concerts:", error.message);
    return [];
  }

  return (data as ConcertRow[]).map(enrichConcert);
}
