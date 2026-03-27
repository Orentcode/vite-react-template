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

	return c.json({
		ok: true,
		status: "stubbed",
		message:
			"Phone verification is scaffolded. Next step is session issuance after OTP validation.",
		phoneNumber: body?.phoneNumber ?? null,
		code: body?.code ? "received" : null,
	});
});

export default app;
