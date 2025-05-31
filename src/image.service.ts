import { createRng } from "@falentio/rng";
import type { GeneratorService } from "./generator.service.ts";

const MAXIMUM_GENERATED_IMAGES = 100;
// helps to make easier if I wont to implement collection
const NAMESPACE = "pfpa";

export class ImageService {
	constructor(
		private readonly r2: R2Bucket,
		private readonly kv: KVNamespace,
		private readonly generatorService: GeneratorService,
	) {}

	async getId(seed: string): Promise<number> {
		const key = `${NAMESPACE}:${seed}`;
		const stored = await this.kv.get(key);
		if (stored) {
			return Number.parseInt(stored, 10);
		}
		const rng = await createRng(seed);
		const generatedId = rng.range(0, MAXIMUM_GENERATED_IMAGES);
		await this.kv.put(key, generatedId.toString());
		return generatedId;
	}

	// TODO: extract some code into persistent layer
	async generateImage(id: number) {
		const path = `/images/${NAMESPACE}/${id}.jpeg`;
		const image = await this.r2.get(path);
		if (image) {
			return image;
		}
		const { imageBytes } = await this.generatorService.generate();
		const result = await this.r2.put(path, imageBytes(), {
			httpMetadata: {
				contentType: "image/jpeg",
				cacheControl: "public, max-age=31536000, immutable",
			},
		});
		if (!result) {
			throw new Error("Failed to generate image, please try again");
		}
		return this.r2.get(path) as Promise<R2ObjectBody>;
	}

	async getImage(seed: string) {
		const id = await this.getId(seed);
		const image = await this.generateImage(id);
		return {
			writeHttpHeaders: (headers: Headers) => {
				image.writeHttpMetadata(headers);
				headers.set("X-Image-Id", id.toString());
			},
			getHeaders() {
				const headers = new Headers();
				headers.set("X-Image-Id", id.toString());
				image.writeHttpMetadata(headers);
				return headers;
			},
			body: image.body,
			id,
			text: () => image.text(),
			[Symbol.asyncDispose]: async () => {
				await image.text();
			},
		};
	}
}
