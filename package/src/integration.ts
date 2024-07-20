import { defineIntegration } from "astro-integration-kit";

export const integration = defineIntegration({
	name: "astro-typed-links",
	setup() {
		return {
			hooks: {},
		};
	},
});
