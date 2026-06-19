import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Check, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubscribePage,
});

type State = "loading" | "valid" | "already" | "invalid" | "done" | "error";

function UnsubscribePage() {
  const [state, setState] = useState<State>("loading");
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
    if (!t) {
      setState("invalid");
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) setState("valid");
        else if (d.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, []);

  async function confirm() {
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await res.json().catch(() => ({}));
      if (d.success) setState("done");
      else if (d.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch {
      setState("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/60 p-8 text-center backdrop-blur-sm">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-orange">
          SHUTTY
        </p>

        {state === "loading" && (
          <div className="flex flex-col items-center gap-3 py-6 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Checking your link…</p>
          </div>
        )}

        {state === "valid" && (
          <>
            <h1 className="text-2xl font-semibold text-foreground">Unsubscribe?</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              You'll stop receiving SHUTTY emails, including launch updates and
              first-user perks.
            </p>
            <button
              onClick={confirm}
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-orange bg-orange px-6 py-3 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-all hover:shadow-[0_0_30px_-4px_var(--orange-glow)] disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Confirm unsubscribe
            </button>
          </>
        )}

        {state === "done" && (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange/40 bg-orange/10 text-orange">
              <Check className="h-7 w-7" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-foreground">
              You're unsubscribed
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              You won't receive any more emails from SHUTTY.
            </p>
          </>
        )}

        {state === "already" && (
          <>
            <h1 className="text-2xl font-semibold text-foreground">Already unsubscribed</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              This email is already opted out — no further action needed.
            </p>
          </>
        )}

        {(state === "invalid" || state === "error") && (
          <>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary/40 text-muted-foreground">
              <AlertTriangle className="h-7 w-7" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold text-foreground">
              {state === "invalid" ? "Invalid link" : "Something went wrong"}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {state === "invalid"
                ? "This unsubscribe link is invalid or has expired."
                : "Please try again in a moment."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
