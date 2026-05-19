"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getTotalCost, formatCurrency } from "@/lib/concert-math";
import { emptyConcertForm, type ConcertFormData } from "@/types/concert";

function Field({
  label,
  id,
  children,
  helper,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  helper?: string;
}) {
  return (
    <div className="form-label-fixed">
      <label htmlFor={id}>{label}</label>
      {children}
      {helper && <p className="helper">{helper}</p>}
    </div>
  );
}

export function AddConcertForm() {
  const router = useRouter();
  const [form, setForm] = useState<ConcertFormData>(emptyConcertForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const liveTotal = useMemo(() => {
    return getTotalCost({
      ticket_cost: form.ticket_cost,
      ticket_fees: form.ticket_fees,
      parking_cost: form.parking_cost,
      food_drink_cost: form.food_drink_cost,
      merchandise_cost: form.merchandise_cost,
      lodging_cost: form.lodging_cost,
      travel_cost: form.travel_cost,
      other_cost: form.other_cost,
    });
  }, [form]);

  function update(field: keyof ConcertFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You need to be logged in to save a concert.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("concerts").insert({
      user_id: user.id,
      concert_name: form.concert_name.trim(),
      artist: form.artist.trim(),
      venue: form.venue.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      concert_date: form.concert_date,
      distance_from_home: parseFloat(form.distance_from_home) || 0,
      hours_at_event: parseFloat(form.hours_at_event) || 1,
      ticket_cost: parseFloat(form.ticket_cost) || 0,
      ticket_fees: parseFloat(form.ticket_fees) || 0,
      parking_cost: parseFloat(form.parking_cost) || 0,
      food_drink_cost: parseFloat(form.food_drink_cost) || 0,
      merchandise_cost: parseFloat(form.merchandise_cost) || 0,
      lodging_cost: parseFloat(form.lodging_cost) || 0,
      travel_cost: parseFloat(form.travel_cost) || 0,
      other_cost: parseFloat(form.other_cost) || 0,
      fun_rating: parseInt(form.fun_rating, 10),
      notes: form.notes.trim() || null,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess(true);
      setForm(emptyConcertForm);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div role="alert" className="alert alert-success">
          <span>Concert saved! Your dashboard and list are updated.</span>
        </div>
      )}
      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <section className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body gap-4">
          <h2 className="card-title text-base">Concert details</h2>
          <p className="text-sm text-base-content/60 -mt-2">Tell us about the show you went to.</p>

          <Field label="Concert name" id="concert_name">
            <input
              id="concert_name"
              className="input input-bordered w-full"
              value={form.concert_name}
              onChange={(e) => update("concert_name", e.target.value)}
              required
              placeholder="Summer Nights Tour"
            />
          </Field>
          <Field label="Artist / band" id="artist">
            <input
              id="artist"
              className="input input-bordered w-full"
              value={form.artist}
              onChange={(e) => update("artist", e.target.value)}
              required
            />
          </Field>
          <Field label="Venue" id="venue">
            <input
              id="venue"
              className="input input-bordered w-full"
              value={form.venue}
              onChange={(e) => update("venue", e.target.value)}
              required
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City" id="city">
              <input
                id="city"
                className="input input-bordered w-full"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                required
              />
            </Field>
            <Field label="State" id="state">
              <input
                id="state"
                className="input input-bordered w-full"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                required
                placeholder="CA"
              />
            </Field>
          </div>
          <Field label="Concert date" id="concert_date">
            <input
              id="concert_date"
              type="date"
              className="input input-bordered w-full"
              value={form.concert_date}
              onChange={(e) => update("concert_date", e.target.value)}
              required
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Distance (mi)" id="distance" helper="Miles from home, one way or round trip — your choice, stay consistent.">
              <input
                id="distance"
                type="number"
                min="0"
                step="0.1"
                className="input input-bordered w-full"
                value={form.distance_from_home}
                onChange={(e) => update("distance_from_home", e.target.value)}
              />
            </Field>
            <Field label="Hours at event" id="hours" helper="Include travel time if you want a fuller picture.">
              <input
                id="hours"
                type="number"
                min="0.5"
                step="0.5"
                className="input input-bordered w-full"
                value={form.hours_at_event}
                onChange={(e) => update("hours_at_event", e.target.value)}
                required
              />
            </Field>
          </div>
          <Field label="Notes" id="notes">
            <textarea
              id="notes"
              className="textarea textarea-bordered w-full min-h-[4rem]"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Opening act, weather, favorite song..."
            />
          </Field>
        </div>
      </section>

      <section className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body gap-4">
          <h2 className="card-title text-base">Costs</h2>
          <p className="text-sm text-base-content/60 -mt-2">
            Enter amounts in dollars. Leave blank or 0 if something did not apply.
          </p>

          {(
            [
              ["ticket_cost", "Ticket cost"],
              ["ticket_fees", "Ticket fees"],
              ["parking_cost", "Parking"],
              ["food_drink_cost", "Food & drink"],
              ["merchandise_cost", "Merchandise"],
              ["lodging_cost", "Hotel / lodging"],
              ["travel_cost", "Travel / gas"],
              ["other_cost", "Other"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label} id={key}>
              <input
                id={key}
                type="number"
                min="0"
                step="0.01"
                className="input input-bordered w-full"
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
              />
            </Field>
          ))}

          <div className="alert bg-primary/10 border border-primary/20 mt-2">
            <span className="font-semibold">Total concert cost: {formatCurrency(liveTotal)}</span>
          </div>
        </div>
      </section>

      <section className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body gap-4">
          <h2 className="card-title text-base">How fun was it?</h2>
          <p className="text-sm text-base-content/60 -mt-2">
            Rate from 1 (Terrible Time) to 10 (Best Time Ever).
          </p>
          <Field label={`Fun rating: ${form.fun_rating}`} id="fun_rating">
            <input
              id="fun_rating"
              type="range"
              min={1}
              max={10}
              step={1}
              className="range range-primary w-full"
              value={form.fun_rating}
              onChange={(e) => update("fun_rating", e.target.value)}
            />
          </Field>
          <div className="flex justify-between text-xs text-base-content/60 px-1">
            <span>1 — Terrible Time</span>
            <span>10 — Best Time Ever</span>
          </div>
        </div>
      </section>

      <button type="submit" className="btn btn-primary btn-lg w-full sm:w-auto" disabled={loading}>
        {loading ? <span className="loading loading-spinner" /> : "Save concert"}
      </button>
    </form>
  );
}


