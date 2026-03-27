import type { Session, User } from "@supabase/supabase-js";

export type AuthenticatedViewer = {
	email: string | null;
	displayName: string;
	firstName: string;
};

function getNameFromUser(user: User) {
	const metadata = user.user_metadata;
	const fullName =
		typeof metadata.full_name === "string" && metadata.full_name.trim()
			? metadata.full_name.trim()
			: typeof metadata.name === "string" && metadata.name.trim()
				? metadata.name.trim()
				: null;

	if (fullName) {
		const [firstName] = fullName.split(" ");

		return {
			displayName: fullName,
			firstName: firstName ?? fullName,
		};
	}

	if (user.email) {
		const [localPart] = user.email.split("@");
		const normalized = localPart.replace(/[._-]+/g, " ").trim();
		const firstName = normalized.split(" ")[0] ?? normalized;

		return {
			displayName: normalized || user.email,
			firstName: firstName || user.email,
		};
	}

	return {
		displayName: "there",
		firstName: "there",
	};
}

export function getAuthenticatedViewer(session: Session): AuthenticatedViewer {
	const { displayName, firstName } = getNameFromUser(session.user);

	return {
		email: session.user.email ?? null,
		displayName,
		firstName,
	};
}
