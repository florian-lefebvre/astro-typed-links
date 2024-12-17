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
	const data: Array<{ route: string; params: Array<string> }> = [];

	for (const { pattern, params } of routes) {
		const route = `${withoutTrailingSlash(base)}${pattern}`;
		if (trailingSlash === "always") {
			data.push({ route: withTrailingSlash(route), params });
		} else if (trailingSlash === "never") {
			data.push({ route, params });
		} else {
			const r = withTrailingSlash(route);
			data.push({ route, params });
			if (route !== r) {
				data.push({ route: r, params });
			}
		}
	}

	let types = "";
	for (const { route, params } of data) {
		types += `    "${route}": ${
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
