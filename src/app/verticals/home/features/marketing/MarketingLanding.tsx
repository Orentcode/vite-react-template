import { useEffect, useState } from "react";
import sunMoonIcon from "../../../../shared/assets/icons/sun-moon.svg";
import logoWordmarkWhite from "../../../../shared/assets/icons/vidnavi-wordmark-d-white.svg";
import logoWordmarkBlack from "../../../../shared/assets/icons/vidnavi-wordmark-d-black.svg";
import {
	getSupabaseRedirectUrl,
	isSupabaseConfigured,
	supabase,
} from "../../../../shared/lib/supabase";

const signupEntryUrl = "/?surface=home&intent=signup";
const loginEntryUrl = "/?surface=home&intent=login";

function GoogleIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				fill="#4285F4"
				d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.8c2.2-2 3.6-5 3.6-8.8Z"
			/>
			<path
				fill="#34A853"
				d="M12 24c3.2 0 5.9-1 7.9-2.8l-3.8-3a7.2 7.2 0 0 1-10.7-3.8H1.4v3.1A12 12 0 0 0 12 24Z"
			/>
			<path
				fill="#FBBC05"
				d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.7l4-3Z"
			/>
			<path
				fill="#EA4335"
				d="M12 4.8c1.8 0 3.4.6 4.7 1.8l3.5-3.5A12 12 0 0 0 1.4 6.7l4 3A7.2 7.2 0 0 1 12 4.8Z"
			/>
		</svg>
	);
}

function AppleIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				fill="currentColor"
				d="M17.6 12.7c0-2 1.7-3 1.8-3-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.5-.7-2.5-.6-1.3 0-2.4.7-3 1.8-1.3 2.2-.3 5.5.9 7.1.6.8 1.3 1.7 2.2 1.7.9 0 1.2-.5 2.3-.5 1 0 1.3.5 2.3.5 1 0 1.6-.8 2.2-1.6.7-1 1-2 1-2.1 0 0-1.9-.7-1.9-3.4Zm-1.9-5.8c.5-.6.8-1.4.7-2.2-.7 0-1.6.5-2.1 1.1-.4.5-.8 1.4-.7 2.2.8.1 1.6-.4 2.1-1.1Z"
			/>
		</svg>
	);
}

function PhoneIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				fill="currentColor"
				d="M7.6 2.5h8.8c1 0 1.8.8 1.8 1.8v15.4c0 1-.8 1.8-1.8 1.8H7.6c-1 0-1.8-.8-1.8-1.8V4.3c0-1 .8-1.8 1.8-1.8Zm.1 2v14.9h8.6V4.5H7.7Zm3.3 13.3h2c.3 0 .6.3.6.6s-.3.6-.6.6h-2c-.3 0-.6-.3-.6-.6s.3-.6.6-.6Z"
			/>
		</svg>
	);
}

export function MarketingLanding() {
	const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
	const [authModal, setAuthModal] = useState<"closed" | "signup" | "login">(
		"closed",
	);
	const isModalOpen = authModal !== "closed";

	useEffect(() => {
		const savedTheme = window.localStorage.getItem("vidnavi.theme");
		if (savedTheme === "light") {
			setThemeMode("light");
			document.documentElement.dataset.theme = "light";
		}
	}, []);

	useEffect(() => {
		document.documentElement.dataset.theme = themeMode;
		window.localStorage.setItem("vidnavi.theme", themeMode);
	}, [themeMode]);

	const headerLogoSrc = themeMode === "light" ? logoWordmarkBlack : logoWordmarkWhite;

	async function handleModalOAuth(provider: "google" | "apple") {
		const intent = authModal === "login" ? "login" : "signup";

		if (!isSupabaseConfigured || !supabase) {
			window.location.href = intent === "login" ? loginEntryUrl : signupEntryUrl;
			return;
		}

		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: getSupabaseRedirectUrl(intent),
			},
		});

		if (error) {
			window.location.href = intent === "login" ? loginEntryUrl : signupEntryUrl;
		}
	}

	return (
		<main className={`landing-page ${isModalOpen ? "landing-page--modal-open" : ""}`}>
			<header className="landing-header" aria-label="Top navigation">
				<a className="landing-logo" href="/" aria-label="Vidnavi home">
					<img src={headerLogoSrc} alt="Vidnavi logo" className="landing-logo-icon" />
				</a>
				<nav className="landing-nav">
					<a href="#how-it-works">How it works</a>
					<button
						type="button"
						className="landing-nav-button"
						onClick={() => setAuthModal("signup")}
					>
						Start
					</button>
					<a className="landing-nav-login" href={loginEntryUrl}>
						Log in
					</a>
					<button
						type="button"
						className="theme-toggle"
						aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`}
						onClick={() =>
							setThemeMode((current) => (current === "dark" ? "light" : "dark"))
						}
					>
						<img src={sunMoonIcon} alt="" aria-hidden="true" className="theme-toggle-icon" />
					</button>
				</nav>
			</header>

			<div className="landing-content">
				<section className="hero">
				<div className="hero-copy">
					<p className="eyebrow">Vidnavi</p>
					<h1>Home care monitoring built for families and fast response.</h1>
					<p className="hero-text">
						Track meaningful care events without watching cameras all day. Start
						with your current setup, then upgrade only when the plan requires it.
					</p>
					<div className="hero-actions">
						<button
							type="button"
							className="primary-action"
							onClick={() => setAuthModal("signup")}
						>
							Get started
						</button>
						<a className="secondary-action" href={loginEntryUrl}>
							Log in
						</a>
					</div>
					<p className="hero-note">
						New users get guided onboarding. Returning users get health status and
						quick actions first.
					</p>
				</div>
				<div className="hero-panel" aria-label="Product preview highlights">
					<div className="signal-card">
						<span className="signal-label">Care events</span>
						<strong>
							Detect falls, prolonged inactivity, exits, and other high-signal
							household events.
						</strong>
					</div>
					<div className="signal-grid">
						<article>
							<span>Existing cameras</span>
							<p>We detect what your current cameras can support before plan lock.</p>
						</article>
						<article>
							<span>Plan fit</span>
							<p>Planner recommends the best tier from your event goals and coverage.</p>
						</article>
						<article>
							<span>Cloud mode</span>
							<p>Start with cloud bridge by default for the easiest onboarding path.</p>
						</article>
						<article>
							<span>Edge mode</span>
							<p>Use an always-on local bridge for richer continuity and lower cloud load.</p>
						</article>
					</div>
				</div>
				</section>

				<section className="info-strip" id="how-it-works">
				<p>
					Home vertical first. Cashier workflows will launch on a separate
					surface.
				</p>
				</section>

				<section className="feature-section">
				<article className="feature-card">
					<p className="feature-kicker">How it works</p>
					<h2>Detect cameras, choose events, get the right plan.</h2>
					<p>
						Step 1: share resident context and event goals. Step 2: run camera
						compatibility and plan recommendation. Step 3: checkout and activate
						monitoring.
					</p>
				</article>
				<article className="feature-card">
					<p className="feature-kicker">User paths</p>
					<h2>One system for both new users and returning households.</h2>
					<p>
						New users get a guided setup from context to activation. Returning
						users land on system health, alerts, and quick actions like re-run
						planner or adjust thresholds.
					</p>
				</article>
				</section>

				<section className="feature-section">
				<article className="feature-card">
					<p className="feature-kicker">Camera compatibility</p>
					<h2>Already have cameras? We fit your plan to your actual setup.</h2>
					<p>
						Each event is classified as supported now, supported with adjustment,
						or upgrade needed. You get transparent tradeoffs before checkout.
					</p>
				</article>
				<article className="feature-card">
					<p className="feature-kicker">Bridge strategy</p>
					<h2>Cloud default with optional edge bridge and automatic fallback.</h2>
					<p>
						Start with cloud mode. Move to edge mode on an always-on local device
						when you want stronger continuity and lower recurring cloud usage.
					</p>
				</article>
				</section>

				<section className="trust-strip">
				<p>
					Trust first: explicit consent gates, explainable recommendations, and
					clear privacy controls for every household.
				</p>
				</section>

				<section className="launch-section" id="launch">
				<p className="feature-kicker">Ready to start</p>
				<h2>Create your home plan or jump back into your monitoring dashboard.</h2>
					<p>
						Use onboarding if you are new. If you already have an account, sign in
						and continue with system health and alert management.
					</p>
					<div className="hero-actions hero-actions--center">
						<button
							type="button"
							className="primary-action"
							onClick={() => setAuthModal("signup")}
						>
							Start setup
						</button>
						<a className="secondary-action" href={loginEntryUrl}>
							Go to login
						</a>
					</div>
				</section>
			</div>

			{isModalOpen ? (
				<div
					className="auth-modal-backdrop"
					role="presentation"
					onClick={() => setAuthModal("closed")}
				>
					<section
						className="auth-modal"
						role="dialog"
						aria-modal="true"
						aria-label="Create your account"
						onClick={(event) => event.stopPropagation()}
					>
						<button
							type="button"
							className="auth-modal-close"
							aria-label="Close"
							onClick={() => setAuthModal("closed")}
						>
							×
						</button>
						<p className="auth-modal-kicker">Join Vidnavi Home</p>
						<h2>Create your account</h2>
						<p className="auth-modal-subtitle">Sign up to join Vidnavi.</p>

						<div className="auth-modal-provider-list">
							<button
								type="button"
								className="auth-modal-provider"
								onClick={() => void handleModalOAuth("google")}
							>
								<span className="auth-modal-provider-icon">
									<GoogleIcon />
								</span>
								<span>Continue with Google</span>
							</button>
							<button
								type="button"
								className="auth-modal-provider"
								onClick={() => void handleModalOAuth("apple")}
							>
								<span className="auth-modal-provider-icon">
									<AppleIcon />
								</span>
								<span>Continue with Apple</span>
							</button>
							<a className="auth-modal-provider" href={signupEntryUrl}>
								<span className="auth-modal-provider-icon">
									<PhoneIcon />
								</span>
								<span>Continue with Phone</span>
							</a>
						</div>

						<p className="auth-modal-legal">
							By signing up, you agree to our <a href="#">Terms</a> and{" "}
							<a href="#">Privacy Policy</a>.
						</p>
						<p className="auth-modal-switch">
							Have an account? <a href={loginEntryUrl}>Log in</a>
						</p>
					</section>
				</div>
			) : null}
		</main>
	);
}
