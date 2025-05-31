import type { Theme } from "../generator.types";

export const animalTheme: Theme = {
	name: "animal",
	messages: [
		{
			content:
				"you will help me to generate prompt, reply only with prompt that you generated, dont make conversation",
			role: "system",
		},
		{
			content: `I have prompt template like bellow, the square bracket indicate the variable for generating image with criteria inside that, and example after that, fill the bracket with suitable criteria, be creative, you can use any animal that wearing clothes, dont use any NSFW content. "Anime style headshot avatar, [Animal Type and Specifics] (e.g., 'fluffy calico cat', 'red panda with round ears', 'wise old owl'), slight three-quarter view. The character has large, expressive anime eyes conveying [Specific Expression/Mood] (e.g., 'a cheerful smile', 'a curious gaze', 'a calm and gentle look'). Soft studio lighting highlighting the features. The background is a solid, clear [Specific Clear Background Color] (e.g., 'pastel blue', 'vibrant yellow', 'light grey'), non-gradient. Cropped from the upper chest/shoulders up. Focus on clean lines and a charming aesthetic."`,
			role: "user",
		},
		{
			content: `"Anime style headshot avatar, a whimsical and playful lemur with a flower crown and a wand, slight three-quarter view. The character has large, expressive anime eyes conveying a mischievous and magical grin. Soft studio lighting highlighting the features. The background is a solid, clear pastel pink, non-gradient. Cropped from the upper chest/shoulders up. Focus on clean lines and a charming aesthetic."`,
			role: "assistant",
		},
		{
			content: "please generate another one, dont ever use nsfw content",
			role: "user",
		},
	],
};
