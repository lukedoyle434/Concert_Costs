import { DashboardView } from "@/components/DashboardView";
import { getUserConcerts } from "@/lib/concerts";

export default async function DashboardPage() {
  const concerts = await getUserConcerts();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
      <p className="text-base-content/60 mb-6 text-sm">
        See how much you have spent and which concerts gave you the best bang for your buck.
      </p>
      <DashboardView concerts={concerts} />
    </div>
  );
}
