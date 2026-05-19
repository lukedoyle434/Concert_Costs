"use client";

import { useEffect, useState } from "react";
import { Calendar, ExternalLink, MapPin, Music } from "lucide-react";
import type { UpcomingConcert } from "@/types/ticketmaster";

function formatShowDate(date: string, time: string | null) {
  if (!date) return "Date TBA";
  const [y, m, d] = date.split("-").map(Number);
  const formatted = new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (!time) return formatted;
  const [hh, mm] = time.split(":");
  const hour = parseInt(hh, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${formatted} · ${h12}:${mm} ${ampm}`;
}

export function UpcomingConcerts() {
  const [events, setEvents] = useState<UpcomingConcert[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/upcoming-concerts");
        const data = await res.json();
        setEvents(data.events ?? []);
        setConfigured(data.configured !== false);
        setMessage(data.message ?? null);
      } catch {
        setMessage("Could not load upcoming shows right now.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="alert alert-info">
        <span>
          Ticketmaster is not connected yet. Add <code className="text-xs">TICKETMASTER_API_KEY</code>{" "}
          in Vercel (and locally in <code className="text-xs">.env.local</code>) to show live US concerts.
          Get a free key at{" "}
          <a
            href="https://developer.ticketmaster.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            developer.ticketmaster.com
          </a>
          .
        </span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="card bg-base-100 border border-dashed border-base-300">
        <div className="card-body items-center text-center">
          <Music className="h-10 w-10 text-base-content/30" />
          <p className="text-base-content/70">
            {message ?? "No upcoming shows found right now. Try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <article
          key={event.id}
          className="card bg-base-100/95 shadow-md border border-base-200 overflow-hidden"
        >
          {event.imageUrl && (
            <figure className="h-36 w-full">
              <img
                src={event.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </figure>
          )}
          <div className="card-body gap-2 p-4">
            <h3 className="font-bold leading-tight line-clamp-2">{event.name}</h3>
            <p className="text-sm text-primary font-medium">{event.artist}</p>
            <p className="text-sm text-base-content/70 flex items-start gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {[event.venue, event.city, event.state].filter(Boolean).join(", ")}
            </p>
            <p className="text-sm flex items-center gap-1 text-base-content/70">
              <Calendar className="h-3.5 w-3.5" />
              {formatShowDate(event.date, event.time)}
            </p>
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm gap-1 mt-1 w-fit"
              >
                View on Ticketmaster
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </article>
      ))}
      <p className="text-xs text-base-content/50 col-span-full">
        Concert listings powered by Ticketmaster Discovery API (US music events).
      </p>
    </div>
  );
}
