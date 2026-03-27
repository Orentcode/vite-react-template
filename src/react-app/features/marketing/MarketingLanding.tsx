export function MarketingLanding() {
	return (
		<main className="landing-page">
			<section className="hero">
				<div className="hero-copy">
					<p className="eyebrow">Vidnavi</p>
					<h1>AI video monitoring built for safer, calmer care environments.</h1>
					<p className="hero-text">
						We&apos;re building a privacy-conscious monitoring platform that helps
						care teams spot risk earlier, respond faster, and stay focused on
						people instead of screens.
					</p>
					<div className="hero-actions">
						<a
							className="primary-action"
							href="https://home.vidnavi.com"
							rel="noreferrer"
						>
							Open Home App
						</a>
						<a className="secondary-action" href="#vision">
							See the vision
						</a>
					</div>
					<p className="hero-note">
						Home monitoring will launch first, with dedicated onboarding and live
						camera setup at home.vidnavi.com.
					</p>
				</div>
				<div className="hero-panel" aria-label="Product preview highlights">
					<div className="signal-card">
						<span className="signal-label">Live monitoring</span>
						<strong>Detect motion, falls, and unusual patterns in context.</strong>
					</div>
					<div className="signal-grid">
						<article>
							<span>Environment</span>
							<p>Resident rooms, hallways, and shared spaces.</p>
						</article>
						<article>
							<span>Alerts</span>
							<p>Prioritized signals for escalation, not constant noise.</p>
						</article>
						<article>
							<span>Designed for care</span>
							<p>Built around staffing realities and operational workflows.</p>
						</article>
						<article>
							<span>Deployment</span>
							<p>Cloud-connected infrastructure ready for modern facilities.</p>
						</article>
					</div>
				</div>
			</section>

			<section className="info-strip" id="vision">
				<p>
					Launching first for care teams that need earlier visibility into
					safety-critical moments.
				</p>
			</section>

			<section className="feature-section">
				<article className="feature-card">
					<p className="feature-kicker">What Vidnavi will do</p>
					<h2>Turn passive cameras into operational awareness.</h2>
					<p>
						Vidnavi is being designed to surface the events that matter most:
						fall-risk movement, unattended wandering, prolonged inactivity, and
						other patterns that deserve a second look.
					</p>
				</article>
				<article className="feature-card">
					<p className="feature-kicker">Why it matters</p>
					<h2>Support staff without adding another dashboard burden.</h2>
					<p>
						The goal is simple: fewer missed moments, better response times, and
						more confidence across teams responsible for resident safety and
						wellbeing.
					</p>
				</article>
			</section>

			<section className="launch-section" id="launch">
				<p className="feature-kicker">Status</p>
				<h2>Coming soon</h2>
				<p>
					We&apos;re actively shaping the first release of Vidnavi for AI video
					monitoring in care environments.
				</p>
				<a className="launch-link" href="https://home.vidnavi.com" rel="noreferrer">
					Go to the home app entrypoint
				</a>
			</section>
		</main>
	);
}
