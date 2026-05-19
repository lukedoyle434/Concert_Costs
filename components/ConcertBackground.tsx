type ConcertBackgroundProps = {
  children: React.ReactNode;
  className?: string;
  /** Stronger overlay on login so the form stays readable */
  variant?: "login" | "app";
};

export function ConcertBackground({
  children,
  className = "",
  variant = "app",
}: ConcertBackgroundProps) {
  const overlay =
    variant === "login"
      ? "from-base-300/95 via-base-200/85 to-base-300/90"
      : "from-base-200/92 via-base-200/88 to-base-300/92";

  return (
    <div className={`relative min-h-dvh overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/concert-silhouette.png)" }}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${overlay}`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orange-600/25 via-transparent to-cyan-500/20"
        aria-hidden
      />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-orange-500/30 blur-3xl" aria-hidden />
      <div
        className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-purple-900/40 to-transparent"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

