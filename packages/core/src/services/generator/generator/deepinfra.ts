import type {
	Generators,
	ImageGenerator,
	ImageGeneratorOptions,
	PromptGeneratorOptions,
	Theme,
} from "../generator.types.ts";
import { createDeepInfra } from "@ai-sdk/deepinfra";
import { generateText, generateObject } from "ai";
import { animalTheme } from "../theme/animal.ts";
import { z } from "zod";

type DeepInfraImageRequestBody = {
	prompt: string;
	num_images: number;
	num_inference_steps: number;
	width: number;
	height: number;
	seed: number;
	webhook: string;
};

type DeepInfraImageResponseBody = {
	images: string[];
	nsfw_content_detected: boolean;
	seed: number;
	request_id: string;
	inference_status: {
		status?: "unknown" | "queued" | "running" | "succeeded" | "failed";
		runtime_ms?: number;
		cost: number;
		tokens_generated?: number;
		tokens_input?: number;
	};
};
// todo, maybe extract into ai generator
export function deepInfraPromptGenerator(apikey: string) {
	const deepInfra = createDeepInfra({
		apiKey: apikey,
	});
	return async (opts?: PromptGeneratorOptions) => {
		const { model = "google/gemini-2.5-flash", theme = animalTheme } =
			opts ?? {};
		const result = await generateObject({
			model: deepInfra(model),
			messages: theme.messages,
			maxTokens: 512,
			temperature: 0.8,
			schema: z.object({
				prompt: z.string(),
			}),
		});
		return result.object.prompt;
	};
}

const imagePrefix = "data:image/png;base64,";

export function deepInfraImageGenerator(apikey: string): ImageGenerator {
	return async (prompt: string, opts?: ImageGeneratorOptions) => {
		const { model = "black-forest-labs/FLUX-1-schnell" } = opts ?? {};
		const response = await fetch(
			`https://api.deepinfra.com/v1/inference/${model}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${apikey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt,
					height: 512,
					width: 512,
					num_inference_steps: 4,
				} as DeepInfraImageRequestBody),
			},
		);
		const body: DeepInfraImageResponseBody = await response.json();
		return {
			contentType: "image/png",
			bytes: async () => {
				if (!body.images[0]) {
					throw new Error("Failed to generate image, please try again");
				}
				const binaryString = atob(body.images[0].slice(imagePrefix.length));
				return Uint8Array.from(binaryString, (m) => m.codePointAt(0) ?? 0);
			},
		};
	};
}

export function deepInfraGenerators(apikey: string): Generators {
	return {
		prompt: deepInfraPromptGenerator(apikey),
		image: deepInfraImageGenerator(apikey),
	};
}
