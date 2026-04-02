import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
	? createClient(supabaseUrl, supabaseAnonKey, {
			auth: {
				persistSession: true,
				autoRefreshToken: true,
				detectSessionInUrl: true,
			},
	})
	: null;

export function getSupabaseRedirectUrl(intent: "signup" | "login" = "login") {
	const localFallback = new URL("/", window.location.origin);
	localFallback.searchParams.set("surface", "home");
	localFallback.searchParams.set("intent", intent);
	const isLocal =
		window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

	if (isLocal) {
		return localFallback.toString();
	}

	if (import.meta.env.VITE_SUPABASE_REDIRECT_URL) {
		const redirect = new URL(import.meta.env.VITE_SUPABASE_REDIRECT_URL, window.location.origin);
		redirect.searchParams.set("surface", "home");
		redirect.searchParams.set("intent", intent);
		return redirect.toString();
	}

	return localFallback.toString();
}
