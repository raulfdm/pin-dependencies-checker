/// <reference types="vitest" />
import { defineConfig } from "vite";

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
	},
});
