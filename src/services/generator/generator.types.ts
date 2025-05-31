export type PromptGeneratorOptions = {
	model?: string;
	theme?: Theme;
};

export type PromptGenerator = (
	options?: PromptGeneratorOptions,
) => Promise<string>;

export type ImageGeneratorOptions = {
	model?: string;
};

export type ImageGenerator = (
	prompt: string,
	options?: ImageGeneratorOptions,
) => Promise<{
	bytes: () => Promise<Uint8Array>;
	contentType: string;
}>;

export type Generators = {
	prompt: PromptGenerator;
	image: ImageGenerator;
};

export type Theme = {
	name: string;
	messages: Array<{
		role: "system" | "user" | "assistant";
		content: string;
	}>;
};
