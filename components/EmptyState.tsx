import { Music } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  message = "No concerts logged yet. Add your first concert to start seeing your dashboard.",
  showAddLink = true,
}: {
  message?: string;
  showAddLink?: boolean;
}) {
  return (
    <div className="card bg-base-100 border border-dashed border-base-300 shadow-sm">
      <div className="card-body items-center text-center py-12">
        <Music className="h-12 w-12 text-base-content/30 mb-2" />
        <p className="text-base-content/70 max-w-md">{message}</p>
        {showAddLink && (
          <Link href="/add" className="btn btn-primary btn-sm mt-4">
            Add your first concert
          </Link>
        )}
      </div>
    </div>
  );
}


