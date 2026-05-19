import { AddConcertForm } from "@/components/AddConcertForm";

export default function AddConcertPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Add Concert</h2>
      <p className="text-base-content/60 mb-6 text-sm">
        Log a show you attended — costs add up automatically.
      </p>
      <AddConcertForm />
    </div>
  );
}
