import { describe, it, expect, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { GeneratorService } from "./generator.service.ts";
import { mock } from "vitest-mock-extended";
import type { Generators } from "./generator.types.ts";

describe("GeneratorService", () => {
	describe("generate", () => {
		it("should generate prompt and image", async () => {
			const generators = mockDeep<Generators>();
			generators.image.mockResolvedValue({
				contentType: "image/jpeg",
				bytes: async () => new Uint8Array(),
			});
			generators.prompt.mockResolvedValue("test prompt");
			const generatorService = new GeneratorService(generators);
			const { prompt, image } = await generatorService.generate();
			expect(prompt).toBe("test prompt");
			expect(image).toEqual({
				contentType: "image/jpeg",
				bytes: expect.any(Function),
			});
		});
	});
});
