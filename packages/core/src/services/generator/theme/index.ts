import type { Theme } from "../generator.types.ts";
import { animalTheme } from "./animal.ts";
import { elementalCat } from "./elemental-cat.ts";

export const themes = [animalTheme, elementalCat];

export function getTheme(name?: string): Theme {
	const theme = themes.find((theme) => theme.name === name);
	if (theme) return theme;

	console.warn({
		message: `Fallback to animal theme because theme '${name}' not found`,
	});
	return animalTheme;
}
