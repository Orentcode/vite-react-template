import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/auth/providers", (c) =>
	c.json({
		providers: [
			{
				id: "google",
				label: "Continue with Google",
				description: "Fastest for web sign-in",
			},
			{
				id: "apple",
				label: "Continue with Apple",
				description: "Important for the future iPhone app",
			},
			{
				id: "phone",
				label: "Continue with phone",
				description: "Passwordless sign-in with a one-time passcode",
			},
		],
	}),
);

app.post("/api/auth/phone/request-code", async (c) => {
	const body = await c.req.json().catch(() => null);

	if (!body?.phoneNumber) {
		return c.json({
			ok: false,
			status: "error",
			message: "Missing phone number payload."
		}, 400);
	}

	return c.json({
		ok: true,
		status: "stubbed",
		message:
			"Phone sign-in is scaffolded. Next step is wiring SMS delivery and OTP storage.",
		phoneNumber: body?.phoneNumber ?? null,
	});
});

app.post("/api/auth/phone/verify-code", async (c) => {
	const body = await c.req.json().catch(() => null);

	if (!body?.phoneNumber || !body?.code) {
		return c.json({
			ok: false,
			status: "error",
			message: "Missing phone number or verification code."
		}, 400);
	}

	return c.json({
		ok: true,
		status: "stubbed",
		message:
			"Phone verification is scaffolded. Next step is session issuance after OTP validation.",
		phoneNumber: body?.phoneNumber ?? null,
		code: body?.code ? "received" : null,
	});
});

// Local/dev and production deep-link support for the home app surface.
// Rewrites /app and /app/* to the SPA entry so client-side routing can resolve.
app.get("/app", async (c) => {
	const url = new URL(c.req.url);
	url.pathname = "/";
	return (c.env as Env & { ASSETS: Fetcher }).ASSETS.fetch(
		new Request(url.toString(), c.req.raw),
	);
});

app.get("/app/*", async (c) => {
	const url = new URL(c.req.url);
	url.pathname = "/";
	return (c.env as Env & { ASSETS: Fetcher }).ASSETS.fetch(
		new Request(url.toString(), c.req.raw),
	);
});

export default app;
