import type { ImageService } from "./image.service.ts";
import { Hono } from "hono";

export function imageRouter(imageService: ImageService) {
	return new Hono().get("/:seed", async (c) => {
		const seed = c.req.param("seed");
		const image = await imageService.getImage(seed);
		for (const [key, value] of image.getHeaders()) {
			c.header(key, value);
		}
		return c.body(image.body);
	});
}
