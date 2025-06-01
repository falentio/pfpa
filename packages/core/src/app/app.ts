import type { Storage } from "unstorage";
import type { Generators } from "../services/generator/generator.types.ts";
import type { Collection } from "../services/collection/collection.types.ts";
import { CollectionService } from "../services/collection/collection.service.ts";
import { GeneratorService } from "../services/generator/generator.service.ts";
import { Hono } from "hono";
import { collectionRouter } from "../services/collection/collection.router.ts";

export type ApplicationConfig = {
	initialCollections: Collection[];
};

function lazyFn<T>(fn: () => T) {
	let value: T | null = null;
	return () => {
		if (value === null) {
			value = fn();
		}
		return value;
	};
}

export class Application {
	constructor(
		private r2: R2Bucket,
		private generator: Generators,
		private storage: Storage,
		private config: ApplicationConfig,
	) {}

	initCollection = lazyFn(async () => {
		const collections = this.config.initialCollections;
		for (const collection of collections) {
			await this.services()
				.collection.createCollection(collection)
				.catch(() => {
					console.warn({
						message: `collection with name ${collection.name} already exists`,
					});
				});
		}
	});

	services = lazyFn(() => {
		const generatorService = new GeneratorService(this.generator);
		const collectionService = new CollectionService(
			this.storage,
			this.r2,
			generatorService,
		);
		return {
			generator: generatorService,
			collection: collectionService,
		};
	});

	router(base = "/") {
		return new Hono()
			.basePath(base)
			.route("/", collectionRouter(this.services().collection))
			.post("/init", async (c) => {
				await this.initCollection();
				return c.json({ message: "Collections initialized" });
			});
	}
}

export * from "../services/generator/theme/index.ts";
export * from "../services/generator/generator/index.ts";
