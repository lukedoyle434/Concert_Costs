import { UpcomingConcerts } from "@/components/UpcomingConcerts";

export default function UpcomingPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Upcoming US Concerts</h2>
      <p className="text-base-content/60 mb-6 text-sm">
        A handful of real shows coming soon — powered by Ticketmaster. Great inspiration for your next log entry.
      </p>
      <UpcomingConcerts />
    </div>
  );
}
