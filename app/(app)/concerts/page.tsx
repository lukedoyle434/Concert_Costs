import { ConcertList } from "@/components/ConcertList";
import { getUserConcerts } from "@/lib/concerts";

export default async function ConcertsPage() {
  const concerts = await getUserConcerts();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">My Concerts</h2>
      <p className="text-base-content/60 mb-6 text-sm">
        Every show you have logged, with costs and fun scores.
      </p>
      <ConcertList concerts={concerts} />
    </div>
  );
}
