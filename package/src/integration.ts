import { writeFileSync } from "node:fs";
import type {
	AstroConfig,
	AstroIntegration,
	IntegrationResolvedRoute,
} from "astro";

const withTrailingSlash = (path: string) =>
	path.endsWith("/") ? path : `${path}/`;

const withoutTrailingSlash = (path: string) =>
	path.endsWith("/") ? path.slice(0, -1) : path;

function getDtsContent(
	{ base, trailingSlash }: AstroConfig,
	routes: Array<IntegrationResolvedRoute>,
) {
	const data: Array<{ pattern: string; params: Array<string> }> = [];

	for (const route of routes) {
		const { params, type } = route;
		if (!(type === "page" || type === "endpoint")) {
			continue;
		}
		const pattern = `${withoutTrailingSlash(base)}${route.pattern}`;
		const segments = route.segments.flat();
		const shouldApplyTrailingSlash =
			// Page should alwyas respect the setting. It's trickier with endpoints
			type === "page" ||
			// No segments so it's probably an index route
			segments.length === 0 ||
			// If there are no static segments, we apply
			segments.every((seg) => seg.dynamic) ||
			// If the latest static segment has a dot, we don't apply the setting
			// biome-ignore lint/style/noNonNullAssertion: checked earlier
			!segments.findLast((seg) => !seg.dynamic)!.content.includes(".");

		if (trailingSlash === "always") {
			data.push({
				pattern: shouldApplyTrailingSlash
					? withTrailingSlash(pattern)
					: pattern,
				params,
			});
		} else if (trailingSlash === "never") {
			data.push({ pattern, params });
		} else {
			data.push({ pattern, params });
			if (!shouldApplyTrailingSlash) {
				continue;
			}
			const r = withTrailingSlash(pattern);
			if (pattern !== r) {
				data.push({ pattern: r, params });
			}
		}
	}

	let types = "";
	for (const { pattern, params } of data) {
		types += `    "${pattern}": ${
			params.length === 0
				? "never"
				: `{${params
						.map(
							(key) =>
								`"${key.replace("...", "")}": ${
									key.startsWith("...") ? "string | undefined" : "string"
								}`,
						)
						.join("; ")}}`
		};\n`;
	}
	return `declare module "astro-typed-links" {\n  interface AstroTypedLinks {\n${types}  }\n}\n\nexport {}`;
}

export function integration(): AstroIntegration {
	let config: AstroConfig;
	let routes: Array<IntegrationResolvedRoute>;
	let dtsURL: URL;

	return {
		name: "astro-typed-links",
		hooks: {
			"astro:routes:resolved": (params) => {
				routes = params.routes.filter((route) => route.origin !== "internal");
				// In dev, this hook runs on route change
				if (dtsURL) {
					writeFileSync(dtsURL, getDtsContent(config, routes));
				}
			},
			"astro:config:done": (params) => {
				config = params.config;
				dtsURL = params.injectTypes({
					filename: "types.d.ts",
					content: getDtsContent(config, routes),
				});
			},
		},
	};
}
