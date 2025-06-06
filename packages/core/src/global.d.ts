declare global {
	interface Env {
		TEST_AI: string;
		DEEPINFRA_API_KEY: string;
		DB: D1Database;
		R2: R2Bucket;
		AI: Ai;
		KV: KVNamespace;
	}
}

declare module "cloudflare:test" {
	export interface ProvidedEnv extends Env {}
}

export {};
