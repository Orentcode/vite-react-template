import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { File as NodeFile } from "node:buffer";

if (typeof globalThis.File === "undefined") {
	globalThis.File = NodeFile as typeof File;
}

export default defineConfig(async () => {
	const { cloudflare } = await import("@cloudflare/vite-plugin");

	return {
		plugins: [react(), cloudflare({ inspectorPort: false })],
	};
});
