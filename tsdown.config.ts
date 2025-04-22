import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["./lib/index.ts"],
	format: ["esm"],
	target: "node18",
});
