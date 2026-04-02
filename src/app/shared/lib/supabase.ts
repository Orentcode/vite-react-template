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

const authCallbackTransientParams = [
	"code",
	"error",
	"error_description",
	"error_code",
	"state",
	"token_hash",
	"type",
	"provider_token",
	"provider_refresh_token",
	"intent",
	"surface",
	"returnTo",
] as const;

function isLocalHostname(hostname: string) {
	return (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		hostname === "::1" ||
		hostname === "[::1]" ||
		hostname.endsWith(".local")
	);
}

function toSafeRelativeReturnTo(value: string | null | undefined) {
	if (!value) {
		return null;
	}

	if (!value.startsWith("/") || value.startsWith("//")) {
		return null;
	}

	return value;
}

function resolveCurrentReturnTo() {
	const currentUrl = new URL(window.location.href);

	for (const key of authCallbackTransientParams) {
		currentUrl.searchParams.delete(key);
	}

	const relative = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
	return toSafeRelativeReturnTo(relative);
}

export function getSupabaseRedirectUrl(intent: "signup" | "login" = "login") {
	const localFallback = new URL("/", window.location.origin);
	localFallback.searchParams.set("surface", "home");
	localFallback.searchParams.set("intent", intent);
	const returnTo = resolveCurrentReturnTo();

	if (returnTo) {
		localFallback.searchParams.set("returnTo", returnTo);
	}

	const isLocal = isLocalHostname(window.location.hostname);

	if (isLocal) {
		return localFallback.toString();
	}

	if (import.meta.env.VITE_SUPABASE_REDIRECT_URL) {
		const redirect = new URL(import.meta.env.VITE_SUPABASE_REDIRECT_URL, window.location.origin);
		redirect.searchParams.set("surface", "home");
		redirect.searchParams.set("intent", intent);

		if (returnTo) {
			redirect.searchParams.set("returnTo", returnTo);
		}

		return redirect.toString();
	}

	return localFallback.toString();
}

export function getAuthReturnToFromUrl() {
	const params = new URLSearchParams(window.location.search);
	return toSafeRelativeReturnTo(params.get("returnTo"));
}

export function clearAuthReturnToFromUrl() {
	const currentUrl = new URL(window.location.href);

	if (!currentUrl.searchParams.has("returnTo")) {
		return;
	}

	currentUrl.searchParams.delete("returnTo");
	window.history.replaceState(
		{},
		"",
		`${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
	);
}
