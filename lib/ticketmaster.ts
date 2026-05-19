import type { UpcomingConcert } from "@/types/ticketmaster";

type TicketmasterEvent = {
  id: string;
  name: string;
  url?: string;
  dates?: { start?: { localDate?: string; localTime?: string } };
  images?: { url: string; width: number }[];
  _embedded?: {
    venues?: { name?: string; city?: { name?: string }; state?: { stateCode?: string } }[];
    attractions?: { name?: string }[];
  };
};

type TicketmasterResponse = {
  _embedded?: { events?: TicketmasterEvent[] };
};

export async function fetchUpcomingUsConcerts(limit = 6): Promise<UpcomingConcert[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    apikey: apiKey,
    countryCode: "US",
    classificationName: "music",
    sort: "date,asc",
    size: String(limit),
  });

  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${params}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    console.error("Ticketmaster API error:", res.status, await res.text());
    return [];
  }

  const data = (await res.json()) as TicketmasterResponse;
  const events = data._embedded?.events ?? [];

  return events.map((event) => {
    const venue = event._embedded?.venues?.[0];
    const artist =
      event._embedded?.attractions?.[0]?.name ?? event.name ?? "Live music";
    const images = [...(event.images ?? [])].sort((a, b) => b.width - a.width);
    const imageUrl = images[0]?.url ?? null;

    return {
      id: event.id,
      name: event.name,
      artist,
      venue: venue?.name ?? "Venue TBA",
      city: venue?.city?.name ?? "",
      state: venue?.state?.stateCode ?? "",
      date: event.dates?.start?.localDate ?? "",
      time: event.dates?.start?.localTime ?? null,
      url: event.url ?? null,
      imageUrl,
    };
  });
}
