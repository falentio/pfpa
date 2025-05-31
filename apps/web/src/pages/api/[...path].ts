import {
	Application,
	cloudflareGenerators,
	deepInfraGenerators,
} from "@pfpa/core";

import { createStorage } from "unstorage";
import kvDriver from "unstorage/drivers/cloudflare-kv-binding";
import type { APIRoute } from "astro";
function getGenerators(env: Env) {
	if ("DEEPINFRA_API_KEY" in env && typeof env.DEEPINFRA_API_KEY === "string") {
		return deepInfraGenerators(env.DEEPINFRA_API_KEY);
	}
	if ("AI" in env) {
		return cloudflareGenerators(env.AI);
	}
	throw new Error("No generators found");
}

export const prerender = false;

export const ALL: APIRoute = async (context) => {
	const generators = getGenerators(context.locals.runtime.env);
	const storage = createStorage({
		driver: kvDriver({ binding: context.locals.runtime.env.KV }),
	});
	const application = new Application(
		context.locals.runtime.env.R2,
		generators,
		storage,
		{
			initialCollections: [
				{
					name: "animal-v0",
					imageModel: "black-forest-labs/FLUX-1-schnell",
					maxImage: 111,
				},
			],
		},
	);
	return application.router("/api").fetch(context.request);
};
