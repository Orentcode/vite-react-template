import "../../styles/App.css";
import { HomeAuthScreen } from "./features/auth/HomeAuthScreen";
import { IssuesBoardPage } from "./features/issues/IssuesBoardPage";
import { MarketingLanding } from "./features/marketing/MarketingLanding";

function resolveSurface(hostname: string, pathname: string, search: string) {
	const params = new URLSearchParams(search);

	if (params.get("surface") === "issues") {
		return "issues";
	}

	if (params.get("surface") === "home") {
		return "home";
	}

	if (pathname.startsWith("/issues")) {
		return "issues";
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

	if (surface === "issues") {
		return <IssuesBoardPage />;
	}

	if (surface === "home") {
		return <HomeAuthScreen />;
	}

	return <MarketingLanding />;
}

export default App;
