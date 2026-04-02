import { useState } from "react";
import { primarySiteUrl } from "../../../../shared/config/links";
import type { AuthenticatedViewer } from "../../../../shared/models/user";
import logoGeminiPng from "../../../../shared/assets/icons/Gemini_Generated_Image_pzainepzainepzai-white-transparent.svg";

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

type CameraOwnership = "have" | "need";
type PlannerBudget = "lean" | "balanced" | "premium";
type InstallComfort = "diy" | "guided";
type HomeArea = "entry" | "living" | "hallway" | "kitchen" | "bedroom";
type HomeEventId =
	| "client_found"
	| "client_fell"
	| "client_not_moving"
	| "medication_taken"
	| "meals_eaten"
	| "bathroom_breaks"
	| "left_home"
	| "left_room";

type EventTier = "starter" | "plus" | "advanced";
type EventDescriptor = {
	id: HomeEventId;
	label: string;
	tier: EventTier;
};

type AreaDescriptor = {
	id: HomeArea;
	label: string;
	angleTip: string;
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
		title: "Plan your cameras and alerts",
		description:
			"Tell us what you already have, what events you care about, and we will recommend the right setup and tier.",
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

const areaOptions: AreaDescriptor[] = [
	{
		id: "entry",
		label: "Main entry",
		angleTip:
			"Mount high, aimed at the door path and threshold so enters/exits are clearly visible.",
	},
	{
		id: "living",
		label: "Living room",
		angleTip:
			"Use a wide corner angle that captures common sitting and walking zones, not just the TV wall.",
	},
	{
		id: "hallway",
		label: "Hallway",
		angleTip:
			"Point down the hallway length to maximize movement context and transition visibility.",
	},
	{
		id: "kitchen",
		label: "Kitchen",
		angleTip:
			"Cover prep and meal activity zones while avoiding direct glare from windows or appliances.",
	},
	{
		id: "bedroom",
		label: "Bedroom",
		angleTip:
			"Aim at the primary movement path (bed to door/bathroom path), not directly at the pillow.",
	},
];

const eventOptions: EventDescriptor[] = [
	{ id: "client_found", label: "Client found", tier: "starter" },
	{ id: "left_room", label: "Left room", tier: "starter" },
	{ id: "left_home", label: "Left home", tier: "starter" },
	{ id: "client_fell", label: "Client fell", tier: "plus" },
	{ id: "client_not_moving", label: "Not moving for prolonged time", tier: "plus" },
	{ id: "medication_taken", label: "Medication taken", tier: "advanced" },
	{ id: "meals_eaten", label: "Meals eaten", tier: "advanced" },
	{ id: "bathroom_breaks", label: "Bathroom breaks", tier: "advanced" },
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
	const [cameraOwnership, setCameraOwnership] = useState<CameraOwnership>("have");
	const [selectedAreas, setSelectedAreas] = useState<HomeArea[]>([
		"entry",
		"living",
		"hallway",
	]);
	const [selectedEvents, setSelectedEvents] = useState<HomeEventId[]>([
		"client_found",
		"left_home",
		"client_fell",
	]);
	const [plannerBudget, setPlannerBudget] = useState<PlannerBudget>("balanced");
	const [installComfort, setInstallComfort] = useState<InstallComfort>("diy");

	const step = onboardingSteps[currentStep];
	const isLastStep = currentStep === onboardingSteps.length - 1;
	const areaCount = selectedAreas.length || 1;
	const suggestedCameraCount = Math.max(2, Math.min(5, areaCount));
	const requiredTier: EventTier = selectedEvents.some(
		(eventId) => eventOptions.find((event) => event.id === eventId)?.tier === "advanced",
	)
		? "advanced"
		: selectedEvents.some(
					(eventId) => eventOptions.find((event) => event.id === eventId)?.tier === "plus",
				)
			? "plus"
			: "starter";
	const hasDetailedEvents = requiredTier !== "starter";
	const planSuggestion =
		cameraOwnership === "need"
			? requiredTier
			: hasDetailedEvents
				? "plus"
				: "starter";

	function toggleArea(areaId: HomeArea) {
		setSelectedAreas((value) =>
			value.includes(areaId) ? value.filter((item) => item !== areaId) : [...value, areaId],
		);
	}

	function toggleEvent(eventId: HomeEventId) {
		setSelectedEvents((value) =>
			value.includes(eventId) ? value.filter((item) => item !== eventId) : [...value, eventId],
		);
	}

	return (
		<main className="app-surface">
			<section className="onboarding-layout">
				<aside className="onboarding-sidebar">
					<a className="auth-brand" href={primarySiteUrl} rel="noreferrer">
						<img src={logoGeminiPng} alt="Vidnavi logo" className="auth-brand-logo" />
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
									system. Keep it warm and obvious.
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
						<div className="onboarding-card-grid">
							<div className="planner-option-grid">
								<button
									type="button"
									className={`planner-option-card ${
										cameraOwnership === "have" ? "planner-option-card--active" : ""
									}`}
									onClick={() => setCameraOwnership("have")}
								>
									<strong>I already have cameras</strong>
									<p>Scan existing cameras and map alerts to supported capabilities.</p>
								</button>
								<button
									type="button"
									className={`planner-option-card ${
										cameraOwnership === "need" ? "planner-option-card--active" : ""
									}`}
									onClick={() => setCameraOwnership("need")}
								>
									<strong>I need help picking cameras</strong>
									<p>
										Recommend camera count, plan tier, and setup approach for my home.
									</p>
								</button>
							</div>

							<div className="info-card">
								<strong>Home areas to cover</strong>
								<div className="planner-chip-group">
									{areaOptions.map((area) => (
										<button
											key={area.id}
											type="button"
											className={`planner-chip ${
												selectedAreas.includes(area.id) ? "planner-chip--active" : ""
											}`}
											onClick={() => toggleArea(area.id)}
										>
											{area.label}
										</button>
									))}
								</div>
								<p>
									Selected areas determine suggested camera count and angle guidance.
								</p>
							</div>

							<div className="info-card">
								<strong>Events you want to monitor</strong>
								<div className="planner-chip-group">
									{eventOptions.map((event) => (
										<button
											key={event.id}
											type="button"
											className={`planner-chip ${
												selectedEvents.includes(event.id)
													? "planner-chip--active"
													: ""
											}`}
											onClick={() => toggleEvent(event.id)}
										>
											{event.label}
										</button>
									))}
								</div>
								<p>
									Advanced behavior events typically require Bridge-assisted setup for
									better reliability.
								</p>
							</div>

							{cameraOwnership === "need" ? (
								<div className="planner-option-grid planner-option-grid--triple">
									<div className="info-card">
										<strong>Budget range</strong>
										<div className="planner-chip-group">
											{(["lean", "balanced", "premium"] as const).map((budget) => (
												<button
													key={budget}
													type="button"
													className={`planner-chip ${
														plannerBudget === budget ? "planner-chip--active" : ""
													}`}
													onClick={() => setPlannerBudget(budget)}
												>
													{budget}
												</button>
											))}
										</div>
									</div>
									<div className="info-card">
										<strong>Install comfort</strong>
										<div className="planner-chip-group">
											{(["diy", "guided"] as const).map((comfort) => (
												<button
													key={comfort}
													type="button"
													className={`planner-chip ${
														installComfort === comfort
															? "planner-chip--active"
															: ""
													}`}
													onClick={() => setInstallComfort(comfort)}
												>
													{comfort}
												</button>
											))}
										</div>
									</div>
									<div className="status-card">
										<span className="status-pill status-pill--online">Suggested kit</span>
										<strong>{suggestedCameraCount}-camera home starter</strong>
										<p>
											{plannerBudget === "lean"
												? "Entry budget with core coverage."
												: plannerBudget === "balanced"
													? "Balanced reliability and image quality."
													: "Premium quality with higher night coverage."}
										</p>
										<p>
											{installComfort === "diy"
												? "DIY setup flow with in-app angle guidance."
												: "Guided install path recommended for faster activation."}
										</p>
									</div>
								</div>
							) : (
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
								</div>
							)}

							<div className="status-card">
								<span className="status-pill status-pill--online">
									Recommended tier
								</span>
								<strong>
									{planSuggestion === "starter"
										? "Starter"
										: planSuggestion === "plus"
											? "Plus"
											: "Advanced"}
								</strong>
								<p>
									{planSuggestion === "starter"
										? "App-only cloud monitoring fits the selected alert set."
										: planSuggestion === "plus"
											? "Bridge-assisted monitoring recommended for stronger event confidence."
											: "Advanced behavior alerts selected. Bridge setup is strongly recommended."}
								</p>
							</div>

							<div className="info-card">
								<strong>Camera angle suggestions for your selected spaces</strong>
								<ul className="planner-angle-list">
									{areaOptions
										.filter((area) => selectedAreas.includes(area.id))
										.map((area) => (
											<li key={area.id}>
												<strong>{area.label}:</strong> {area.angleTip}
											</li>
										))}
								</ul>
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
							<p>
								Planner summary: {cameraOwnership === "need" ? "new camera kit" : "existing cameras"}
								, {selectedAreas.length} area(s), {selectedEvents.length} alert type(s),{" "}
								{planSuggestion} tier recommendation.
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
