import type {
	Generators,
	ImageGeneratorOptions,
	PromptGeneratorOptions,
} from "./generator.types";

export type GenerateOptions = {
	prompt?: PromptGeneratorOptions;
	image?: ImageGeneratorOptions;
};

export class GeneratorService {
	constructor(private readonly generators: Generators) {}

	async generate(opts?: GenerateOptions) {
		const prompt = await this.generators.prompt(opts?.prompt);
		const image = await this.generators.image(prompt, opts?.image);
		console.log(prompt);
		return { prompt, image };
	}
}
