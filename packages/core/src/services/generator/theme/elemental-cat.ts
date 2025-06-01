import type { Theme } from "../generator.types.ts";

const elements =
	"Fire, Water, Ice, Lightning, Shadow, Forest, Wind, Earth, Crystal, Magma, Fairy Dust, Toxic Gas, Sound, Dream, Steam, Root, Arcane, Honey, Rust, Air, Smoke, Sand, Dust, Mud, Ash, Plasma, Metal, Iron, Gold, Silver, Copper, Bronze, Quartz, Amethyst, Emerald, Diamond, Stone, Clay, Glass, Mist, Dew, Rain, Cloud, Coral, Brine, Wood, Leaf, Flower, Vine, Moss, Thorn, Fungus, Spore, Seed, Sun, Moon, Star, Aurora, Rainbow, Solar, Lunar, Starlight, Storm, Blizzard, Drought, Monsoon, Tsunami, Quake, Volcano, Vortex, Gale, Breeze, Light, Void, Aura, Spirit, Echo, Kinetic, Gravity, Sonic, Vibration, Psionic, Aether, Cosmic, Time, Space, Warp, Nexus, Portal, Life, Death, Decay, Bone, Blood, Flesh, Illusion, Mind, Gear, Circuit, Static, Flux, Shard, Weave, Poison, Acid, Slime, Venom, Corrosive, Bile".split(
		", ",
	);
function getRandomElement() {
	return elements[Math.floor(Math.random() * elements.length)];
}

export const elementalCat: Theme = {
	name: "elemental-cat",
	messages: [
		{
			role: "user",
			content: `Help me fill this prompt template for generating image, you should use all of your creativity, reply only with your generated prompt
Headshot of a fictional elemental [element, e.g., fire, water, ice, lightning, shadow, forest] cat, simple cartoon style, [solid color non-gradient, e.g., blue,violet,cyan,teal,green,yellow,orange,red,pink,purple,brown,gray,black,white] background. The cat has [specific attributes, e.g., glowing eyes, small horns, fur patterns resembling waves, leaves in its fur, crackling sparks around its ears]. Its expression is [expression, e.g., playful, serene, mischievous, wise, curious].
CRITICAL: DO NOT GENERATE IMAGE`,
		},
		{
			role: "assistant",
			content: `Here are 10 unique prompts based on your template:
Headshot of a fictional elemental water cat, simple cartoon style, blue background. The cat has fur patterns resembling gentle ocean waves and small, translucent fins along its spine. Its expression is serene.
Headshot of a fictional elemental lightning cat, simple cartoon style, violet background. The cat has miniature, harmless lightning bolts arcing between its whiskers and bright, crackling energy in its eyes. Its expression is mischievous.
Headshot of a fictional elemental forest cat, simple cartoon style, yellow background. The cat has delicate, glowing fireflies embedded in its fur and tiny, vibrant mushrooms sprouting from its head. Its expression is curious.
Headshot of a fictional elemental fire cat, simple cartoon style, orange background. The cat has constantly shifting fur patterns that look like flickering flames and smoke subtly curling from its nose. Its expression is playful.
Headshot of a fictional elemental shadow cat, simple cartoon style, dark grey background. The cat has eyes that are pure voids with tiny, distant stars within them and a faint, swirling aura of darkness. Its expression is wise.
Headshot of a fictional elemental ice cat, simple cartoon style, light blue background. The cat has tiny, perfect snowflakes falling from its ears and a crystalline sheen to its fur. Its expression is serene.
Headshot of a fictional elemental wind cat, simple cartoon style, sky blue background. The cat has fur that appears to be gently flowing in an unseen breeze and small, ethereal clouds around its paws. Its expression is playful.
Headshot of a fictional elemental earth cat, simple cartoon style, green background. The cat has patches of moss and tiny wildflowers growing on its fur and eyes that resemble polished river stones. Its expression is wise.
Headshot of a fictional elemental crystal cat, simple cartoon style, purple background. The cat has shimmering, faceted fur that catches the light and small, clear crystal horns. Its expression is curious.
Headshot of a fictional elemental magma cat, simple cartoon style, red background. The cat has glowing cracks in its fur through which molten rock seems to pulse and smoky vapor rising from its back. Its expression is mischievous.`,
		},
		{
			role: "user",
			content: `Create another one with ${getRandomElement()} element, use all of your creativity`,
		},
	],
};
