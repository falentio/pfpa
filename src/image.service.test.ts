import { describe, it, expect } from "vitest";
import { ImageService } from "./image.service";
import { mock } from "vitest-mock-extended";
import { GeneratorService } from "./generator.service.ts";
import { env } from "cloudflare:test";

describe("ImageService", () => {
	describe("getId", () => {
		it("should get an id", async () => {
			const imageService = new ImageService(
				env.R2,
				env.KV,
				mock<GeneratorService>(),
			);
			const id = await imageService.getId("test");
			expect(id).toBeDefined();
		});
		it("should generate same id for same seed", async () => {
			const imageService = new ImageService(
				env.R2,
				env.KV,
				mock<GeneratorService>(),
			);
			const id = await imageService.getId("test");
			const id2 = await imageService.getId("test");
			expect(id).toBe(id2);
		});
		it("should generate different id for different seed", async () => {
			const imageService = new ImageService(
				env.R2,
				env.KV,
				mock<GeneratorService>(),
			);
			const id = await imageService.getId("test");
			const id2 = await imageService.getId("test2");
			expect(id).not.toBe(id2);
		});
	});

	describe("generateImage", () => {
		it("should generate image", async () => {
			const generatorService = mock<GeneratorService>();
			generatorService.generate.mockResolvedValue({
				image: "",
				imageBytes: () => new Uint8Array([12, 123, 21, 44, 55, 1]),
				prompt: "",
			});
			const imageService = new ImageService(env.R2, env.KV, generatorService);
			const image = await imageService.generateImage(1);
			expect(image).toBeDefined();
			await image.text();
		});
		it("should generate same image for same id", async () => {
			const generatorService = mock<GeneratorService>();
			generatorService.generate.mockResolvedValue({
				image: "",
				imageBytes: () => new Uint8Array([12, 123, 21, 44, 55, 1]),
				prompt: "",
			});
			const imageService = new ImageService(env.R2, env.KV, generatorService);
			const image = await imageService.generateImage(1);
			const image2 = await imageService.generateImage(1);
			expect(image.key).toBe(image2.key);
			await image.text();
			await image2.text();
		});
	});
});
