import { WorkerEntrypoint } from "cloudflare:workers";
import { Application } from "./app.ts";
import { createStorage } from "unstorage";
import kvDriver from "unstorage/drivers/cloudflare-kv-binding";
import { deepInfraGenerators } from "../services/generator/generator/deepinfra.ts";

export default class EntryPoint extends WorkerEntrypoint<Env> {
	app = new Application(
		this.env.R2,
		deepInfraGenerators(this.env.DEEPINFRA_API_KEY),
		createStorage({
			driver: kvDriver({ binding: this.env.KV }),
		}),
		{
			initialCollections: [
				{
					imageModel: "black-forest-labs/FLUX-1-schnell",
					name: "animal-v0",
					maxImage: 1108,
				},
			],
		},
	);

	async fetch(request: Request): Promise<Response> {
		return this.app.router().fetch(request);
	}
}
