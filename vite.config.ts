/// <reference types="vitest" />
import * as path from "node:path";
import { defineConfig } from "vite";

function isExternal(id: string) {
	return !id.startsWith(".") && !path.isAbsolute(id);
}

export default defineConfig({
	test: {
		globals: true,
		clearMocks: true,
	},
	build: {
		outDir: "dist",
		lib: {
			entry: "lib/index.ts",
			formats: ["es"],
		},
		target: "node18",
		rollupOptions: {
			external: isExternal,
		},
	},
});
