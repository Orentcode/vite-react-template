const FALLBACK_DEV_URL = "https://dev.vidnavi.com";

function getRuntimeFallbackUrl() {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}

	return FALLBACK_DEV_URL;
}

export const primarySiteUrl =
	import.meta.env.VITE_PRIMARY_SITE_URL ?? getRuntimeFallbackUrl();

export const homeAppUrl = import.meta.env.VITE_HOME_APP_URL ?? getRuntimeFallbackUrl();
