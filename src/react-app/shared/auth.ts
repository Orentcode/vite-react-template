export type AuthProvider = "google" | "apple" | "phone";

export type AuthProviderDescriptor = {
	id: AuthProvider;
	label: string;
	description: string;
};

export const authProviders: AuthProviderDescriptor[] = [
	{
		id: "google",
		label: "Continue with Google",
		description: "Fastest for web sign-in",
	},
	{
		id: "apple",
		label: "Continue with Apple",
		description: "Needed when the iPhone app ships",
	},
	{
		id: "phone",
		label: "Continue with phone",
		description: "Passwordless sign-in with a one-time passcode",
	},
];
