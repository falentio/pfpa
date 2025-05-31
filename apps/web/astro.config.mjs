// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';
import path from 'node:path';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@pfp/core": path.resolve("../packages/core/src"),
       ...(import.meta.env.PROD ? { "react-dom/server": "react-dom/server.edge" } : {}),
      }
    }
  },
  security: {
    checkOrigin: false,
  },

  adapter: cloudflare({
    imageService: "passthrough"
  }),
  output: "server",
  integrations: [react()]
});