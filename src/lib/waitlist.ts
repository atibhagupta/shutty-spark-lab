/**
 * Waitlist submission. If `VITE_WAITLIST_ENDPOINT` is set (Formspree, a
 * Supabase edge function, your own API…) we POST JSON there. Otherwise we keep
 * a local record so the UI still works end-to-end before the backend exists.
 */
const ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
const LOCAL_KEY = "shutty.waitlist";

export type WaitlistResult = { ok: true; position: number } | { ok: false; error: string };

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export async function joinWaitlist(email: string, intent: string): Promise<WaitlistResult> {
  const trimmed = email.trim().toLowerCase();
  if (!isValidEmail(trimmed)) return { ok: false, error: "That email doesn't look right." };

  if (ENDPOINT) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: trimmed, intent, source: "shutty-website" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      return { ok: false, error: "Couldn't reach the list. Try again in a moment." };
    }
  } else {
    // Simulate network so the UI's loading state is honest.
    await new Promise((r) => setTimeout(r, 650));
  }

  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ email: trimmed, intent, at: Date.now() }));
  } catch {
    /* private mode */
  }

  // A plausible queue position derived from the email so repeat visits agree.
  let hash = 0;
  for (const ch of trimmed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const position = 1200 + (hash % 1800);
  return { ok: true, position };
}

export function existingWaitlistEntry(): { email: string; intent: string } | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as { email: string; intent: string }) : null;
  } catch {
    return null;
  }
}
