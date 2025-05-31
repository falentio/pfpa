import { createRng } from "@falentio/rng";
import type { Collection } from "./collection.types";
import { prefixStorage, type Storage } from "unstorage";
import type { GeneratorService } from "../generator/generator.service.ts";
import { LazyFile } from "@mjackson/lazy-file";
import { FriendlyError } from "../../commons/error.ts";

export class CollectionService {
	constructor(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		private readonly storage: Storage<any>,
		private readonly r2: R2Bucket,
		private readonly generatorService: GeneratorService,
	) {}

	private get collectionStorage() {
		return prefixStorage<Collection>(this.storage, "collections");
	}

	async createCollection(collection: Collection) {
		const exists = await this.collectionStorage.hasItem(collection.name);
		if (exists) {
			throw new FriendlyError({
				// conflict
				status: 409,
				message: {
					public: "Collection already exists",
					internal: `Collection "${collection.name}" already exists`,
				},
			});
		}
		await this.collectionStorage.setItem(collection.name, collection);
	}

	async getId(collectionName: string, seed: string) {
		const [collection, rng] = await Promise.all([
			this.collectionStorage.getItem(collectionName),
			createRng(`${collectionName}:${seed}`),
		]);
		if (!collection) {
			throw new FriendlyError({
				status: 404,
				message: {
					public: "Collection not found",
					internal: `Collection "${collectionName}" not found`,
				},
			});
		}
		return rng.range(0, collection.maxImage);
	}

	async getInfo(collectionName: string, id: number) {
		const key = `${collectionName}/${id}`;
		const [collection, image] = await Promise.all([
			this.collectionStorage.getItem(collectionName),
			this.r2.head(key),
		]);
		if (!collection) {
			throw new FriendlyError({
				status: 404,
				message: {
					public: "Collection not found",
					internal: `Collection ${collectionName} not found`,
				},
			});
		}
		if (!image) {
			throw new FriendlyError({
				status: 404,
				message: {
					public: "Image not found",
					internal: `Image ${key} not found`,
				},
			});
		}
		return {
			prompt: image.customMetadata?.prompt,
		};
	}

	async getImage(
		collectionName: string,
		id: number,
		seed: string,
	): Promise<LazyFile> {
		const key = `${collectionName}/${id}`;
		const [collection, image] = await Promise.all([
			this.collectionStorage.getItem(collectionName),
			this.r2.get(key),
		]);
		if (!collection) {
			throw new FriendlyError({
				status: 404,
				message: {
					public: "Collection not found",
					internal: `Collection "${collectionName}" not found`,
				},
			});
		}
		if (image) {
			const file = new LazyFile(
				{
					byteLength: image.size,
					stream(start, end) {
						return image.body;
					},
				},
				id.toString(),
				{ type: image.httpMetadata?.contentType },
			);
			return file;
		}
		const expectedId = await this.getId(collectionName, seed);
		if (expectedId !== id) {
			throw new FriendlyError({
				status: 400,
				message: {
					public: "Bad Request",
					internal: "cant generate image without seed",
				},
			});
		}

		const created = await this.generatorService.generate({
			image: {
				model: collection.imageModel,
			},
			prompt: {
				model: collection.promptModel,
			},
		});
		const bytes = await created.image.bytes();
		await this.r2.put(`${collectionName}/${id}`, bytes, {
			httpMetadata: {
				contentType: created.image.contentType,
			},
			customMetadata: {
				prompt: created.prompt,
			},
		});
		return new LazyFile(
			{
				byteLength: bytes.length,
				stream() {
					return new ReadableStream({
						start(controller) {
							controller.enqueue(bytes);
							controller.close();
						},
					});
				},
			},
			id.toString(),
			{ type: created.image.contentType },
		);
	}
}
