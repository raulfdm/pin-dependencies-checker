/// <reference types="vitest" />
import * as path from "node:path";
import { defineConfig } from "vite";

function isExternal(id: string) {
	return !id.startsWith(".") && !path.isAbsolute(id);
}

export default defineConfig({
	test: {
		globals: true,
	},
	build: {
		outDir: "dist",
		lib: {
			entry: "src/main.ts",
			formats: ["cjs", "es"],
		},
		target: "node18",
		rollupOptions: {
			external: isExternal,
		},
	},
});
