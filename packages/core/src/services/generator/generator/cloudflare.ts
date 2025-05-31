import type {
	Generators,
	ImageGenerator,
	ImageGeneratorOptions,
	PromptGenerator,
	PromptGeneratorOptions,
	Theme,
} from "../generator.types.ts";
import { animalTheme } from "../theme/animal.ts";

export function cloudflarePromptGenerator(_ai: Ai): PromptGenerator {
	return async (opts?: PromptGeneratorOptions) => {
		const ai = _ai as unknown as Ai<Record<string, BaseAiTextGeneration>>;
		const {
			model = "@cf/meta/llama-3.1-8b-instruct-awq",
			theme = animalTheme,
		} = opts ?? {};
		const result = await ai.run(model, {
			messages: theme.messages,
			// backend consumption only
			stream: false,
			max_tokens: 512,
		});
		if (!("response" in result) || !result.response) {
			throw new Error("Failed to generate prompt, please try again");
		}
		return result.response;
	};
}

export function cloudflareImageGenerator(ai: Ai): ImageGenerator {
	return async (prompt: string, opts?: ImageGeneratorOptions) => {
		if (opts?.model) {
			throw new Error("can't specify model for cloudflare image generation");
		}
		const result = await ai.run("@cf/black-forest-labs/flux-1-schnell", {
			prompt,
		});
		if (!("image" in result) || !result.image?.[0]) {
			throw new Error("Failed to generate image, please try again");
		}
		const image = result.image;
		return {
			contentType: "image/jpeg",
			bytes: async () => {
				const binaryString = atob(image);
				return Uint8Array.from(binaryString, (m) => m.codePointAt(0) ?? 0);
			},
		};
	};
}

export function cloudflareGenerators(ai: Ai): Generators {
	return {
		prompt: cloudflarePromptGenerator(ai),
		image: cloudflareImageGenerator(ai),
	};
}
