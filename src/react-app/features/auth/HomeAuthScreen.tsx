import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AuthActionButton } from "./components/AuthActionButton";
import { PhoneLoginForm } from "./components/PhoneLoginForm";
import { HomeOnboardingFlow } from "../onboarding/HomeOnboardingFlow";
import { getSupabaseRedirectUrl, isSupabaseConfigured, supabase } from "../../lib/supabase";
import { getAuthenticatedViewer } from "../../shared/user";

function GoogleMark() {
	return <span className="provider-mark google-mark">G</span>;
}

function AppleMark() {
	return <span className="provider-mark apple-mark">A</span>;
}

function PhoneMark() {
	return <span className="provider-mark phone-mark">#</span>;
}

export function HomeAuthScreen() {
	const [stage, setStage] = useState<"auth" | "onboarding">("auth");
	const [session, setSession] = useState<Session | null>(null);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [passcode, setPasscode] = useState("");
	const [isCodeSent, setIsCodeSent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [statusMessage, setStatusMessage] = useState(
		"Choose the easiest way to sign in. Passwords are not part of the Phase 1 flow.",
	);

	useEffect(() => {
		if (!supabase) {
			return;
		}

		void supabase.auth.getSession().then(({ data }) => {
			if (data.session) {
				setSession(data.session);
				setStage("onboarding");
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" && session) {
				setSession(session);
				setStage("onboarding");
			}

			if (event === "SIGNED_OUT") {
				setSession(null);
				setStage("auth");
				setIsLoading(false);
				setStatusMessage("Signed out. Choose a provider to continue.");
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	if (stage === "onboarding") {
		return (
			<HomeOnboardingFlow
				viewer={session ? getAuthenticatedViewer(session) : null}
				onSignOut={async () => {
					if (!supabase) {
						setSession(null);
						setStage("auth");
						return;
					}

					setIsLoading(true);
					const { error } = await supabase.auth.signOut();

					if (error) {
						setStatusMessage(error.message);
						setIsLoading(false);
					}
				}}
			/>
		);
	}

	async function handleOAuthSignIn(provider: "google" | "apple") {
		if (!supabase) {
			setStatusMessage(
				"Supabase auth is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to start real sign-in.",
			);
			return;
		}

		setIsLoading(true);
		setStatusMessage(`Redirecting to ${provider === "google" ? "Google" : "Apple"} sign-in...`);

		const { error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: getSupabaseRedirectUrl(),
			},
		});

		if (error) {
			setStatusMessage(error.message);
			setIsLoading(false);
		}
	}

	return (
		<main className="app-surface">
			<section className="auth-layout">
				<div className="auth-hero">
					<a className="auth-brand" href="https://vidnavi.com" rel="noreferrer">
						Vidnavi
					</a>
					<p className="auth-kicker">Home monitoring</p>
					<h1>Set up home alerts in minutes, not hours.</h1>
					<p className="auth-description">
						Start with fast account access, then move into bridge pairing, camera
						discovery, and live view setup for your home.
					</p>
					<ul className="auth-checklist">
						<li>No passwords to remember</li>
						<li>Built for family members and caregivers</li>
						<li>Designed to scale into care operations later</li>
					</ul>
				</div>

				<div className="auth-panel">
					<div className="auth-panel-header">
						<p className="eyebrow">Sign in</p>
						<h2>Continue to the home app</h2>
						<p>
							Choose Google, Apple, or a phone passcode. Each provider will plug
							into the same account system.
						</p>
					</div>

					{isSupabaseConfigured ? (
						<div className="auth-config-banner auth-config-banner--ready">
							Supabase is configured. Google and Apple can use real OAuth flows
							once the providers are enabled in your project.
						</div>
					) : (
						<div className="auth-config-banner">
							Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable real
							auth. Until then, this screen stays in scaffold mode.
						</div>
					)}

					<div className="auth-provider-list">
						<AuthActionButton
							icon={<GoogleMark />}
							label="Continue with Google"
							hint="Fastest for web sign-in"
							onClick={() => void handleOAuthSignIn("google")}
						/>
						<AuthActionButton
							icon={<AppleMark />}
							label="Continue with Apple"
							hint="Important for future iPhone app support"
							onClick={() => void handleOAuthSignIn("apple")}
						/>
						<AuthActionButton
							icon={<PhoneMark />}
							label="Continue with phone"
							hint="Passwordless with a one-time passcode"
							onClick={() =>
								setStatusMessage(
									"Phone sign-in is shown below. Next step is wiring SMS delivery and verification through the Worker API.",
								)
							}
						/>
					</div>

					<PhoneLoginForm
						phoneNumber={phoneNumber}
						passcode={passcode}
						isCodeSent={isCodeSent}
						onPhoneNumberChange={setPhoneNumber}
						onPasscodeChange={setPasscode}
						onRequestCode={() => {
							setIsCodeSent(true);
							setStatusMessage(
								"Phone passcode is the next auth step. We still need Twilio Verify and Supabase phone auth configuration before this becomes real.",
							);
						}}
						onVerifyCode={() =>
							setStatusMessage(
								"Phone verification is still stubbed. Once Twilio and Supabase phone auth are wired, this will create a real session.",
							)
						}
					/>

					<div className="auth-status-banner" role="status">
						{isLoading ? "Opening provider sign-in..." : statusMessage}
					</div>
				</div>
			</section>
		</main>
	);
}
