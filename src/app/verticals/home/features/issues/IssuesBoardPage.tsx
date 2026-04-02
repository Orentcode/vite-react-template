import { useEffect, useMemo, useState } from "react";

type IssueRow = {
	issue: string;
	title: string;
	priority: "p0" | "p1" | "p2";
	status: string;
	consensus: string;
	userSignOff: string;
	ticket: string;
	owner: string;
	nextAction: string;
	updated: string;
};

type UserSignOff =
	| "pending"
	| "approved"
	| "revision_requested"
	| "declined";

type ReviewState = Record<
	string,
	{
		signOff: UserSignOff;
		note: string;
		reviewedAt: string;
	}
>;

const REVIEW_STORAGE_KEY = "vidnavi.issueBoard.reviews.v1";

const ISSUE_ROWS: IssueRow[] = [
	{
		issue: "I-1",
		title: "Canonical home onboarding flow",
		priority: "p0",
		status: "consensus_ready",
		consensus: "codex:agree gemini:agree copilot:agree",
		userSignOff: "pending",
		ticket: "-",
		owner: "codex",
		nextAction: "User approve or request revision",
		updated: "2026-04-01",
	},
	{
		issue: "I-2",
		title: "Trust Moat baseline pipeline",
		priority: "p0",
		status: "consensus_ready",
		consensus: "codex:agree gemini:agree copilot:agree",
		userSignOff: "pending",
		ticket: "-",
		owner: "gemini",
		nextAction: "User approve or request revision",
		updated: "2026-04-01",
	},
	{
		issue: "I-3",
		title: "Wearable enrichment support",
		priority: "p1",
		status: "in_discussion",
		consensus: "codex:pending gemini:pending copilot:pending",
		userSignOff: "pending",
		ticket: "-",
		owner: "user+copilot",
		nextAction: "Propose S-3 scope candidate",
		updated: "2026-04-01",
	},
	{
		issue: "I-4",
		title: "Vertical picker in onboarding",
		priority: "p2",
		status: "closed (deferred)",
		consensus: "codex:agree gemini:agree copilot:agree",
		userSignOff: "approved",
		ticket: "-",
		owner: "codex",
		nextAction: "Track as future multi-vertical item",
		updated: "2026-04-01",
	},
];

export function IssuesBoardPage() {
	const [reviewState, setReviewState] = useState<ReviewState>({});
	const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

	useEffect(() => {
		try {
			const saved = window.localStorage.getItem(REVIEW_STORAGE_KEY);
			if (!saved) {
				return;
			}

			const parsed = JSON.parse(saved) as ReviewState;
			setReviewState(parsed);
		} catch {
			setReviewState({});
		}
	}, []);

	useEffect(() => {
		window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewState));
	}, [reviewState]);

	const rowsWithReviews = useMemo(() => {
		return ISSUE_ROWS.map((row) => {
			const review = reviewState[row.issue];
			return {
				...row,
				userSignOff: review?.signOff ?? row.userSignOff,
				reviewNote: review?.note ?? "",
				reviewedAt: review?.reviewedAt ?? "",
			};
		});
	}, [reviewState]);

	const approvedRows = useMemo(
		() => rowsWithReviews.filter((row) => row.userSignOff === "approved"),
		[rowsWithReviews],
	);
	const revisionRows = useMemo(
		() => rowsWithReviews.filter((row) => row.userSignOff === "revision_requested"),
		[rowsWithReviews],
	);
	const declinedRows = useMemo(
		() => rowsWithReviews.filter((row) => row.userSignOff === "declined"),
		[rowsWithReviews],
	);

	const flowRoundSyncPayload = useMemo(() => {
		const changed = rowsWithReviews.filter(
			(row) =>
				reviewState[row.issue] &&
				reviewState[row.issue].signOff !== "pending",
		);

		if (changed.length === 0) {
			return "No local user sign-off changes yet.";
		}

		const lines: string[] = [
			"# Flow-Round User Review Sync",
			"Apply these updates into flow-round user sign-off blocks:",
			"",
		];

		for (const row of changed) {
			const state = reviewState[row.issue];
			if (!state) {
				continue;
			}

			const suggestedItemStatus =
				state.signOff === "approved"
					? "user_signed_off"
					: state.signOff === "declined"
						? "closed"
						: "in_discussion";
			lines.push(`## ${row.issue} — ${row.title}`);
			lines.push(`- User Sign-Off: ${state.signOff}`);
			lines.push(`- Reviewed at: ${state.reviewedAt}`);
			lines.push(`- User notes: ${state.note || "-"}`);
			lines.push(`- Suggested item status: ${suggestedItemStatus}`);
			lines.push(
				`- Implementation eligibility: ${state.signOff === "approved" ? "eligible" : "not_eligible"}`,
			);
			lines.push("");
		}

		return lines.join("\n");
	}, [rowsWithReviews, reviewState]);

	function updateSignOff(issue: string, signOff: UserSignOff) {
		const existing = reviewState[issue];
		setReviewState((prev) => ({
			...prev,
			[issue]: {
				signOff,
				note: existing?.note ?? "",
				reviewedAt: new Date().toISOString(),
			},
		}));
	}

	function updateNote(issue: string, note: string) {
		const existing = reviewState[issue];
		setReviewState((prev) => ({
			...prev,
			[issue]: {
				signOff: existing?.signOff ?? "pending",
				note,
				reviewedAt: existing?.reviewedAt ?? "",
			},
		}));
	}

	async function copySyncPayload() {
		try {
			await navigator.clipboard.writeText(flowRoundSyncPayload);
			setCopyStatus("copied");
		} catch {
			setCopyStatus("failed");
		}
	}

	return (
		<div className="issues-page">
			<section className="issues-panel">
				<p className="issues-eyebrow">Vidnavi Local Review</p>
				<h1>Issues Board</h1>
				<p>
					This page is a compact review view of active flow-round issues. Canonical
					details live in <code>projects/vidnavi/handoffs/flow-round-2026-04-01.md</code>.
				</p>
				<p className="issues-helper">
					Use <strong>Approve</strong>, <strong>Request Revision</strong>, or
					<strong> Decline</strong> per issue. Only approved issues move to
					implementation.
				</p>
			</section>

			<section className="issues-queues-panel" aria-label="Implementation queues">
				<h2>Implementation Queue</h2>
				<p>Only issues approved by user are eligible for active work.</p>
				<ul className="issues-queue-list">
					{approvedRows.length === 0 ? (
						<li>None approved yet.</li>
					) : (
						approvedRows.map((row) => (
							<li key={`approved-${row.issue}`}>
								<strong>{row.issue}</strong> {row.title}
							</li>
						))
					)}
				</ul>
				<h3>Revision Requested</h3>
				<ul className="issues-queue-list">
					{revisionRows.length === 0 ? (
						<li>None.</li>
					) : (
						revisionRows.map((row) => (
							<li key={`revision-${row.issue}`}>
								<strong>{row.issue}</strong> {row.title}
							</li>
						))
					)}
				</ul>
				<h3>Declined</h3>
				<ul className="issues-queue-list">
					{declinedRows.length === 0 ? (
						<li>None.</li>
					) : (
						declinedRows.map((row) => (
							<li key={`declined-${row.issue}`}>
								<strong>{row.issue}</strong> {row.title}
							</li>
						))
					)}
				</ul>
			</section>

			<section className="issues-table-shell" aria-label="Issue board snapshot">
				<table className="issues-table">
					<thead>
						<tr>
							<th>Issue</th>
							<th>Title</th>
							<th>Priority</th>
							<th>Status</th>
							<th>Consensus</th>
							<th>User Sign-Off</th>
							<th>Ticket</th>
							<th>Owner</th>
							<th>Next Action</th>
							<th>Updated</th>
							<th>Your Review</th>
						</tr>
					</thead>
					<tbody>
						{rowsWithReviews.map((row) => (
							<tr key={row.issue}>
								<td>{row.issue}</td>
								<td>{row.title}</td>
								<td>{row.priority}</td>
								<td>{row.status}</td>
								<td>{row.consensus}</td>
								<td>{row.userSignOff}</td>
								<td>{row.ticket}</td>
								<td>{row.owner}</td>
								<td>{row.nextAction}</td>
								<td>{row.updated}</td>
								<td className="issues-review-cell">
									<div className="issues-review-actions">
										<button
											className="issues-review-approve"
											type="button"
											onClick={() => updateSignOff(row.issue, "approved")}
										>
											Approve
										</button>
										<button
											className="issues-review-revise"
											type="button"
											onClick={() => updateSignOff(row.issue, "revision_requested")}
										>
											Request Revision
										</button>
										<button
											className="issues-review-decline"
											type="button"
											onClick={() => updateSignOff(row.issue, "declined")}
										>
											Decline
										</button>
									</div>
									<textarea
										className="issues-review-note"
										rows={3}
										placeholder="Optional note for flow-round update"
										value={row.reviewNote}
										onChange={(event) => updateNote(row.issue, event.target.value)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>

			<section className="issues-sync-panel">
				<div className="issues-sync-head">
					<h2>Flow-Round Sync Payload</h2>
					<button type="button" className="issues-sync-copy" onClick={copySyncPayload}>
						Copy Payload
					</button>
				</div>
				<p>
					Use this payload to update user sign-off blocks in the canonical flow-round
					file.
				</p>
				{copyStatus === "copied" ? <p className="issues-sync-status">Copied.</p> : null}
				{copyStatus === "failed" ? (
					<p className="issues-sync-status">Copy failed. Select and copy manually.</p>
				) : null}
				<pre className="issues-sync-output">{flowRoundSyncPayload}</pre>
			</section>
		</div>
	);
}
