import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig } from "astro/config";

const { default: typedLinks } = await import("astro-typed-links");

// https://astro.build/config
export default defineConfig({
	trailingSlash: "always",
	// base: "/docs",
	integrations: [
		tailwind(),
		typedLinks(),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
});
