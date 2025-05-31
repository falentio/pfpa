import { describe, it, expect } from "vitest";
import { GeneratorService } from "./generator.service";
import { env } from "cloudflare:test";

describe.runIf(env.TEST_AI === "true")(
	"GeneratorService",
	{ timeout: 20e3 },
	() => {
		it("should generate prompt", async () => {
			const generatorService = new GeneratorService(env.AI);
			const prompt = await generatorService.generatePrompt();
			expect(prompt).toBeDefined();
		});
		it("should generate image", async () => {
			const generatorService = new GeneratorService(env.AI);
			const prompt = `"Anime style headshot avatar, a stylish sloth in a fedora and matching scarf, slight three-quarter view. The character has large, expressive anime eyes conveying a mischievous grin. Soft studio lighting highlighting the features. The background is a solid, clear mint green, non-gradient. Cropped from the upper chest/shoulders up. Focus on clean lines and a charming aesthetic."`;
			const image = await generatorService.generateImage(prompt);
			expect(image).toBeDefined();
		});
	},
);
