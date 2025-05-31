import { WorkerEntrypoint } from "cloudflare:workers";
import { Hono } from "hono";
import { deepInfraGenerators } from "./services/generator/generator/deepinfra.ts";
import { GeneratorService } from "./services/generator/generator.service.ts";
import { CollectionService } from "./services/collection/collection.service.ts";

import kv from "unstorage/drivers/cloudflare-kv-binding";
import { createStorage } from "unstorage";
import { collectionRouter } from "./services/collection/collection.router.ts";
import { FriendlyError } from "./commons/error.ts";
import type { StatusCode } from "hono/utils/http-status";

export default class EntryPoint extends WorkerEntrypoint<Env> {
	services() {
		const generatorService = new GeneratorService(deepInfraGenerators(""));
		const collectionService = new CollectionService(
			createStorage({ driver: kv({ binding: this.env.KV }) }),
			this.env.R2,
			generatorService,
		);
		return {
			collectionService,
			generatorService,
		};
	}

	app() {
		const services = this.services();
		return new Hono()
			.route("/", collectionRouter(services.collectionService))
			.onError(async (err, c) => {
				if (err instanceof FriendlyError) {
					console.log(err.internalMessage);
					c.status(err.status as StatusCode);
					return c.json({ message: err.publicMessage });
				}
				console.error(err);
				return c.json({ message: "Internal Server Error" }, 500);
			})
			.post("/init", async (c) => {
				await Promise.all([
					services.collectionService.createCollection({
						maxImage: 1108,
						name: "animal-v1",
						imageModel: "black-forest-labs/FLUX-1-schnell",
					}),
				]);
				return c.json({ success: true });
			});
	}

	async fetch(request: Request): Promise<Response> {
		return this.app().fetch(request);
	}
}
