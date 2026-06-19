-- 1. Remove the overly permissive public insert policy on waitlist.
-- Signups now go exclusively through the validated server API route, which
-- uses service-role credentials (bypassing RLS). Direct Data API inserts by
-- anonymous/authenticated users are no longer needed.
DROP POLICY IF EXISTS "Anyone can join the waitlist" ON public.waitlist;

-- 2. Harden the email-queue SECURITY DEFINER helper functions.
-- They are only ever invoked with service-role credentials from server
-- routes, so revoke direct EXECUTE from anonymous and signed-in users and
-- pin a fixed search_path to prevent search_path hijacking.
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;

GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;