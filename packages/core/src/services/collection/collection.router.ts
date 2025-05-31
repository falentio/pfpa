import { Hono } from "hono";
import type { CollectionService } from "./collection.service.ts";

export function collectionRouter(collectionService: CollectionService) {
	return new Hono()
		.basePath("/collection")
		.get("/:collectionName/:seed", async (c) => {
			const { collectionName, seed } = c.req.param();
			const id = await collectionService.getId(collectionName, seed);
			const type = c.req.queries("info") === undefined ? "image" : "info";
			c.header(
				"Cache-Control",
				"private, max-age=0, no-cache, no-store, no-transform, must-revalidate",
			);
			const base = new URL(c.req.url);
			const target = new URL(`${type}/${id}?seed=${seed}`, base);
			c.header(
				"Cache-Control",
				"public, max-age=3600, immutable, stale-while-revalidate=3600",
			);
			return c.redirect(target.toString(), 307);
		})
		.get("/:collectionName/info/:id", async (c) => {
			const { collectionName, id: idStr } = c.req.param();
			const id = Number.parseInt(idStr, 10);
			const info = await collectionService.getInfo(collectionName, id);
			c.header("Cache-Control", "public, max-age=31536000, immutable");
			return c.json(info);
		})
		.get("/:collectionName/image/:id", async (c) => {
			const { collectionName, id: idStr } = c.req.param();
			const id = Number.parseInt(idStr, 10);
			const seed = c.req.queries("seed")?.[0] ?? "empty";
			const image = await collectionService.getImage(collectionName, id, seed);
			c.header("Content-Type", image.type);
			c.header("Content-Length", image.size.toString());
			c.header("Cache-Control", "public, max-age=31536000, immutable");
			c.header("Content-Disposition", `inline; filename="${image.name}`);
			return c.body(image.stream());
		});
}
