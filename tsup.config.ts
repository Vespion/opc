import { defineConfig } from "tsup";

export default defineConfig({
	target: "es2018",
	format: ["cjs", "esm"],
	splitting: false,
	bundle: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	clean: true,
	dts: true,
	treeshake: "recommended",
	minify: false
});
