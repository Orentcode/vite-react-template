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

export function getSupabaseRedirectUrl() {
	if (import.meta.env.VITE_SUPABASE_REDIRECT_URL) {
		return import.meta.env.VITE_SUPABASE_REDIRECT_URL;
	}

	return `${window.location.origin}${window.location.pathname}?surface=home`;
}
