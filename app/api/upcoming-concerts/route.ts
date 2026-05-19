import { NextResponse } from "next/server";
import { fetchUpcomingUsConcerts } from "@/lib/ticketmaster";

export async function GET() {
  if (!process.env.TICKETMASTER_API_KEY) {
    return NextResponse.json({
      events: [],
      configured: false,
      message: "Ticketmaster API key is not set on the server.",
    });
  }

  const events = await fetchUpcomingUsConcerts(6);
  return NextResponse.json({ events, configured: true });
}
