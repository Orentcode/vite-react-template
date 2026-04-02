import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AuthActionButton } from "./components/AuthActionButton";
import { PhoneLoginForm } from "./components/PhoneLoginForm";
import { HomeOnboardingFlow } from "../onboarding/HomeOnboardingFlow";
import {
	clearAuthReturnToFromUrl,
	getAuthReturnToFromUrl,
	getSupabaseRedirectUrl,
	isSupabaseConfigured,
	supabase,
} from "../../../../shared/lib/supabase";
import { primarySiteUrl } from "../../../../shared/config/links";
import { getAuthenticatedViewer } from "../../../../shared/models/user";
import logoGeminiPng from "../../../../shared/assets/icons/Gemini_Generated_Image_pzainepzainepzai-white-transparent.svg";

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
	const intent =
		new URLSearchParams(window.location.search).get("intent") === "signup"
			? "signup"
			: "login";
	const [stage, setStage] = useState<"auth" | "profile" | "onboarding">("auth");
	const [session, setSession] = useState<Session | null>(null);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [passcode, setPasscode] = useState("");
	const [firstNameInput, setFirstNameInput] = useState("");
	const [lastNameInput, setLastNameInput] = useState("");
	const [isCodeSent, setIsCodeSent] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const [statusMessage, setStatusMessage] = useState(
		"Choose the easiest way to sign in. Passwords are not part of the Phase 1 flow.",
	);
	const viewer = useMemo(
		() => (session ? getAuthenticatedViewer(session) : null),
		[session],
	);

	function maybeRestoreAuthReturnTo() {
		const returnTo = getAuthReturnToFromUrl();
		clearAuthReturnToFromUrl();

		if (!returnTo) {
			return;
		}

		const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

		if (returnTo !== currentPath) {
			window.history.replaceState({}, "", returnTo);
		}
	}

	function resolvePostAuthStage(nextSession: Session) {
		const metadata = nextSession.user.user_metadata as Record<string, unknown> | undefined;
		const hasCompletedProfile = metadata?.profile_completed === true;

		if (!hasCompletedProfile) {
			const fullName =
				typeof metadata?.full_name === "string" && metadata.full_name.trim()
					? metadata.full_name.trim()
					: "";
			const [first = "", ...rest] = fullName.split(" ");
			setFirstNameInput(first);
			setLastNameInput(rest.join(" "));
			setStage("profile");
			return;
		}

		setStage("onboarding");
	}

	useEffect(() => {
		if (!supabase) {
			return;
		}

		void supabase.auth.getSession().then(({ data }) => {
			if (data.session) {
				setSession(data.session);
				maybeRestoreAuthReturnTo();
				resolvePostAuthStage(data.session);
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" && session) {
				setSession(session);
				maybeRestoreAuthReturnTo();
				resolvePostAuthStage(session);
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
				viewer={viewer}
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

	async function handleProfileCompletion() {
		if (!session || !supabase) {
			setStage("onboarding");
			return;
		}

		const fullName = [firstNameInput.trim(), lastNameInput.trim()].filter(Boolean).join(" ");

		if (!fullName) {
			setStatusMessage("Add your name so we can personalize your household setup.");
			return;
		}

		setIsSavingProfile(true);
		setStatusMessage("Saving your profile...");

		const { error } = await supabase.auth.updateUser({
			data: {
				full_name: fullName,
				profile_completed: true,
			},
		});

		if (error) {
			setStatusMessage(error.message);
			setIsSavingProfile(false);
			return;
		}

		const { data } = await supabase.auth.getSession();
		if (data.session) {
			setSession(data.session);
		}

		setIsSavingProfile(false);
		setStatusMessage("Profile saved. Welcome to Vidnavi Home.");
		setStage("onboarding");
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
				redirectTo: getSupabaseRedirectUrl(intent),
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
					<a className="auth-brand" href={primarySiteUrl} rel="noreferrer">
						<img src={logoGeminiPng} alt="Vidnavi logo" className="auth-brand-logo" />
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
						<li>Built for calm, home-first monitoring workflows</li>
					</ul>
				</div>

				<div className="auth-panel">
					{stage === "profile" ? (
						<>
							<div className="auth-panel-header">
								<p className="eyebrow">Finish profile</p>
								<h2>Complete your account setup</h2>
								<p>
									One quick step before we start household onboarding.
								</p>
							</div>
							<div className="auth-profile-card">
								<label className="auth-field">
									<span>First name</span>
									<input
										value={firstNameInput}
										onChange={(event) => setFirstNameInput(event.target.value)}
										placeholder="Maya"
									/>
								</label>
								<label className="auth-field">
									<span>Last name</span>
									<input
										value={lastNameInput}
										onChange={(event) => setLastNameInput(event.target.value)}
										placeholder="Rivera"
									/>
								</label>
								<button
									type="button"
									className="auth-profile-submit"
									disabled={isSavingProfile}
									onClick={() => void handleProfileCompletion()}
								>
									{isSavingProfile ? "Saving..." : "Save and continue"}
								</button>
							</div>
						</>
					) : (
						<>
							<div className="auth-panel-header">
								<p className="eyebrow">Sign in</p>
								<h2>
									{intent === "signup"
										? "Create your home account"
										: "Continue to the home app"}
								</h2>
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
									disabled={isLoading}
									onClick={() => void handleOAuthSignIn("google")}
								/>
								<AuthActionButton
									icon={<AppleMark />}
									label="Continue with Apple"
									hint="Important for future iPhone app support"
									disabled={isLoading}
									onClick={() => void handleOAuthSignIn("apple")}
								/>
								<AuthActionButton
									icon={<PhoneMark />}
									label="Continue with phone"
									hint="Passwordless with a one-time passcode"
									disabled={isLoading}
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
						</>
					)}

					<div className="auth-status-banner" role="status">
						{isLoading ? "Opening provider sign-in..." : statusMessage}
					</div>
				</div>
			</section>
		</main>
	);
}
