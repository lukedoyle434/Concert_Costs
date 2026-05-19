"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ProTipRow } from "@/types/pro-tip";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProTipsBoard({
  tips: initialTips,
  currentUserId,
}: {
  tips: ProTipRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [tips, setTips] = useState(initialTips);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const trimmed = text.trim();
    if (trimmed.length < 10) {
      setError("Please write at least 10 characters so others get something useful.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You need to be logged in to share a tip.");
      setLoading(false);
      return;
    }

    const authorName = user.email?.split("@")[0] ?? "Concert fan";

    const { data, error: insertError } = await supabase
      .from("pro_tips")
      .insert({
        user_id: user.id,
        tip_text: trimmed,
        author_name: authorName,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      setTips((prev) => [data as ProTipRow, ...prev]);
      setText("");
      setSuccess(true);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <section className="card bg-base-100/95 shadow-md border border-base-200">
        <div className="card-body gap-4">
          <h3 className="card-title text-base gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            Share a pro tip
          </h3>
          <p className="text-sm text-base-content/60 -mt-2">
            Help other fans save money, stay safe, or have more fun at their next show.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              className="textarea textarea-bordered w-full min-h-[5rem]"
              placeholder="Example: Buy merch before the headliner plays — lines are shorter and you won't miss the encore."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              required
            />
            <p className="text-xs text-base-content/50">{text.length}/500 characters</p>
            {error && (
              <div role="alert" className="alert alert-error text-sm py-2">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div role="alert" className="alert alert-success text-sm py-2">
                <span>Thanks! Your tip is live for everyone to read.</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Post tip"}
            </button>
          </form>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Community tips
        </h3>
        {tips.length === 0 ? (
          <div className="card bg-base-100/90 border border-dashed border-base-300">
            <div className="card-body text-center text-base-content/70">
              No tips yet. Be the first to share advice for fellow concert-goers!
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {tips.map((tip) => (
              <li
                key={tip.id}
                className="card bg-base-100/95 shadow-sm border border-base-200"
              >
                <div className="card-body py-4 gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                      {tip.author_name}
                      {tip.user_id === currentUserId && (
                        <span className="badge badge-ghost badge-xs ml-2">You</span>
                      )}
                    </span>
                    <time className="text-xs text-base-content/50" dateTime={tip.created_at}>
                      {formatWhen(tip.created_at)}
                    </time>
                  </div>
                  <p className="text-base-content/80">{tip.tip_text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
