import { defineConfig } from "tsdown";
export default defineConfig({
	dts: true,
	entry: ["./src/app/app.ts"],
	format: "esm",
	sourcemap: "inline",
	hash: false,
});
