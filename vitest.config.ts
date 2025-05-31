import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
	test: {
		testTimeout: 30e3,
		poolOptions: {
			workers: {
				wrangler: { configPath: "./wrangler.json" },
			},
		},
	},
});
