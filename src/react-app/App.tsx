import "./App.css";
import { HomeAuthScreen } from "./features/auth/HomeAuthScreen";
import { MarketingLanding } from "./features/marketing/MarketingLanding";

function resolveSurface(hostname: string, pathname: string, search: string) {
	const params = new URLSearchParams(search);

	if (params.get("surface") === "home") {
		return "home";
	}

	if (hostname.startsWith("home.") || pathname.startsWith("/app")) {
		return "home";
	}

	return "marketing";
}

function App() {
	const surface = resolveSurface(
		window.location.hostname,
		window.location.pathname,
		window.location.search,
	);

	if (surface === "home") {
		return <HomeAuthScreen />;
	}

	return <MarketingLanding />;
}

export default App;
