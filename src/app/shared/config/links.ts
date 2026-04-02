const FALLBACK_DEV_URL = "https://dev.vidnavi.com";

export const primarySiteUrl =
	import.meta.env.VITE_PRIMARY_SITE_URL ?? FALLBACK_DEV_URL;

export const homeAppUrl = import.meta.env.VITE_HOME_APP_URL ?? FALLBACK_DEV_URL;
