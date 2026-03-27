import { useState } from "react";
import type { AuthenticatedViewer } from "../../shared/user";

type OnboardingStepId =
	| "home"
	| "resident"
	| "bridge"
	| "cameras"
	| "ready";

type OnboardingStep = {
	id: OnboardingStepId;
	label: string;
	title: string;
	description: string;
};

const onboardingSteps: OnboardingStep[] = [
	{
		id: "home",
		label: "Home",
		title: "Create your home",
		description: "Name the home so family members know they are setting up the right place.",
	},
	{
		id: "resident",
		label: "Person",
		title: "Who are you setting this up for?",
		description: "Capture the relationship and monitoring context without making this feel clinical.",
	},
	{
		id: "bridge",
		label: "Bridge",
		title: "Set up your Vidnavi Bridge",
		description: "The Bridge connects to cameras inside the home network and keeps setup simple.",
	},
	{
		id: "cameras",
		label: "Cameras",
		title: "Find cameras in the home",
		description: "We scan for compatible cameras first, then only ask for passwords when needed.",
	},
	{
		id: "ready",
		label: "Ready",
		title: "You are ready for live monitoring",
		description: "The next screen will become the live home dashboard once camera sessions are wired.",
	},
];

const discoveredCameras = [
	{
		name: "Living room camera",
		model: "Reolink E1 Pro",
		status: "Needs password",
	},
	{
		name: "Hallway camera",
		model: "Tapo C120",
		status: "Connected",
	},
	{
		name: "Bedroom camera",
		model: "Amcrest IP2M-841",
		status: "Found",
	},
];

type HomeOnboardingFlowProps = {
	viewer: AuthenticatedViewer | null;
	onSignOut: () => void | Promise<void>;
};

export function HomeOnboardingFlow({
	viewer,
	onSignOut,
}: HomeOnboardingFlowProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [homeName, setHomeName] = useState("Maya's home");
	const [residentName, setResidentName] = useState("Maya");
	const [relationship, setRelationship] = useState("Daughter");
	const [bridgeName, setBridgeName] = useState("Kitchen Bridge");

	const step = onboardingSteps[currentStep];
	const isLastStep = currentStep === onboardingSteps.length - 1;

	return (
		<main className="app-surface">
			<section className="onboarding-layout">
				<aside className="onboarding-sidebar">
					<a className="auth-brand" href="https://vidnavi.com" rel="noreferrer">
						Vidnavi
					</a>
					{viewer ? (
						<div className="viewer-badge">
							<span className="viewer-badge-label">Signed in as</span>
							<strong>{viewer.displayName}</strong>
							{viewer.email ? <p>{viewer.email}</p> : null}
							<button className="viewer-signout-button" type="button" onClick={onSignOut}>
								Log out
							</button>
						</div>
					) : null}
					<p className="auth-kicker">Home setup</p>
					<h1>
						{viewer ? `Welcome, ${viewer.firstName}.` : "Bring one home online,"}{" "}
						one clear step at a time.
					</h1>
					<p className="auth-description">
						This first-run flow is designed for family members and caregivers who
						need a calm setup path, not technical networking instructions.
					</p>
					<ol className="onboarding-step-list">
						{onboardingSteps.map((item, index) => {
							const state =
								index === currentStep
									? "current"
									: index < currentStep
										? "complete"
										: "upcoming";

							return (
								<li
									key={item.id}
									className={`onboarding-step-item onboarding-step-item--${state}`}
								>
									<span className="onboarding-step-index">{index + 1}</span>
									<div>
										<strong>{item.label}</strong>
										<p>{item.title}</p>
									</div>
								</li>
							);
						})}
					</ol>
				</aside>

				<div className="onboarding-panel">
					<div className="onboarding-panel-header">
						<p className="eyebrow">{step.label}</p>
						<h2>{step.title}</h2>
						<p>{step.description}</p>
					</div>

					{step.id === "home" ? (
						<div className="onboarding-card-grid">
							<label className="auth-field">
								<span>Home name</span>
								<input
									value={homeName}
									onChange={(event) => setHomeName(event.target.value)}
								/>
							</label>
							<div className="info-card">
								<strong>What users should feel here</strong>
								<p>
									This should feel like naming a household, not configuring a
									facility. Keep it warm and obvious.
								</p>
							</div>
							{viewer ? (
								<div className="info-card">
									<strong>Setup owner</strong>
									<p>
										{viewer.displayName} is the first signed-in household member for
										this setup flow. We can add profile editing next.
									</p>
								</div>
							) : null}
						</div>
					) : null}

					{step.id === "resident" ? (
						<div className="onboarding-card-grid">
							<label className="auth-field">
								<span>Person&apos;s first name</span>
								<input
									value={residentName}
									onChange={(event) => setResidentName(event.target.value)}
								/>
							</label>
							<label className="auth-field">
								<span>Your relationship</span>
								<input
									value={relationship}
									onChange={(event) => setRelationship(event.target.value)}
								/>
							</label>
							<div className="info-card">
								<strong>Phase 1 note</strong>
								<p>
									We can start simple here. Detailed care plans and risk profiles
									should come later, not in first-run setup.
								</p>
							</div>
						</div>
					) : null}

					{step.id === "bridge" ? (
						<div className="onboarding-card-grid">
							<div className="status-card">
								<span className="status-pill status-pill--online">Bridge online</span>
								<strong>{bridgeName}</strong>
								<p>
									The Bridge is what finds cameras on the home network and makes
									live setup manageable for non-technical users.
								</p>
							</div>
							<label className="auth-field">
								<span>Bridge name</span>
								<input
									value={bridgeName}
									onChange={(event) => setBridgeName(event.target.value)}
								/>
							</label>
							<div className="info-card">
								<strong>Next technical step</strong>
								<p>
									This screen will later pair a real local Bridge and show network
									health, firmware, and reachability diagnostics.
								</p>
							</div>
						</div>
					) : null}

					{step.id === "cameras" ? (
						<div className="camera-list">
							{discoveredCameras.map((camera) => (
								<article key={camera.name} className="camera-list-item">
									<div>
										<strong>{camera.name}</strong>
										<p>{camera.model}</p>
									</div>
									<span
										className={`status-pill ${
											camera.status === "Connected"
												? "status-pill--online"
												: camera.status === "Needs password"
													? "status-pill--warning"
													: "status-pill--neutral"
										}`}
									>
										{camera.status}
									</span>
								</article>
							))}
							<div className="info-card">
								<strong>Phase 1 camera rule</strong>
								<p>
									Only show supported, compatible cameras with plain-language
									states like Found, Needs password, Connected, or Unsupported.
								</p>
							</div>
						</div>
					) : null}

					{step.id === "ready" ? (
						<div className="ready-card">
							<strong>{homeName} is ready for the next phase.</strong>
							<p>
								After auth and onboarding, the next surface becomes the live home
								dashboard with alerts, camera health, and connection checks.
							</p>
						</div>
					) : null}

					<div className="onboarding-actions">
						<button
							className="phone-auth-secondary"
							type="button"
							onClick={() => setCurrentStep((value) => Math.max(0, value - 1))}
							disabled={currentStep === 0}
						>
							Back
						</button>
						<button
							className="phone-auth-primary"
							type="button"
							onClick={() =>
								setCurrentStep((value) =>
									isLastStep ? value : Math.min(onboardingSteps.length - 1, value + 1),
								)
							}
						>
							{isLastStep ? "Waiting for dashboard build" : "Continue"}
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}
