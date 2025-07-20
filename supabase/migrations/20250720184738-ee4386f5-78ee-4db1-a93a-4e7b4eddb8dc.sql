-- Security hardening: Add explicit search paths to database functions
ALTER FUNCTION public.cleanup_old_rate_limits() SET search_path = public;
ALTER FUNCTION public.trigger_cleanup_rate_limits() SET search_path = public;