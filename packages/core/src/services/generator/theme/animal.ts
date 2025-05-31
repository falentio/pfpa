import type { Theme } from "../generator.types";

const animals =
	"Dog,Cat,Horse,Cow,Pig,Sheep,Goat,Chicken,Turkey,Duck,Goose,Rabbit,Hamster,Guinea Pig,Mouse,Rat,Lion,Tiger,Elephant,Giraffe,Zebra,Grizzly Bear,Polar Bear,Panda Bear,Wolf,Fox,Deer,Monkey,Chimpanzee,Gorilla,Orangutan,Kangaroo,Koala,Squirrel,Raccoon,Hedgehog,Bat,Camel,Rhinoceros,Hippopotamus,Leopard,Cheetah,Jaguar,Hyena,Bison,Moose,Reindeer,Badger,Otter,Skunk,Beaver,Armadillo,Sloth,Anteater,Eagle,Hawk,Falcon,Owl,Sparrow,Robin,Blue Jay,Cardinal,Crow,Raven,Pigeon,Dove,Woodpecker,Hummingbird,Ostrich,Emu,Peacock,Flamingo,Penguin,Snake,Cobra,Python,Lizard,Iguana,Chameleon,Gecko,Komodo Dragon,Tortoise,Crocodile,Alligator,Ant,Bee,Butterfly,Grasshopper,Ladybug,Spider,Fly,Mosquito,Cockroach,Snail,Earthworm,Caterpillar,Llama,Alpaca,Ferret,Donkey".split(
		",",
	);
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
			content: `
"Anime style headshot avatar, arctic fox with sleek white fur and striking blue eyes, slight three-quarter view. The character has large, expressive anime eyes conveying a mischievous glint and a sly smirk. Soft studio lighting highlighting the features. The background is a solid, clear icy teal, non-gradient. Cropped from the upper chest/shoulders up. Focus on clean lines and a charming aesthetic."
			`,
			role: "assistant",
		},
		{
			role: "user",
			get content() {
				return `Generate one prompt for ${animals[Math.floor(Math.random() * animals.length)]}`;
			},
		},
	],
};
