import type { AstroConfig } from "astro";
import { defineIntegration } from "astro-integration-kit";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const FILENAME = "./.astro/astro-types-routes.d.ts";

const withTrailingSlash = (path: string) =>
  path.endsWith("/") ? path : `${path}/`;

const withoutTrailingSlash = (path: string) =>
  path.endsWith("/") ? path.slice(0, -1) : path;

export const integration = defineIntegration({
  name: "astro-typed-links",
  setup() {
    let typegenFilePath: URL;
    let trailingSlash: AstroConfig["trailingSlash"];
    let base: string;

    return {
      hooks: {
        "astro:config:setup": ({ config, logger }) => {
          typegenFilePath = new URL(FILENAME, config.root);

          try {
            const packageJson = JSON.parse(
              readFileSync(new URL("./package.json", config.root), "utf-8")
            );
            if (!packageJson.scripts?.sync) {
              logger.warn(
                'No "sync" script found in your "package.json". Add `"sync": "astro build --sync && astro sync"`'
              );
              return;
            }

            if (!packageJson.scripts.sync.includes("astro build --sync &&")) {
              logger.warn(
                'The custom sync command for this integration is not added. Prepend your "package.json" "sync" script with "astro build --sync &&"'
              );
              return;
            }
          } catch (_) {
            logger.error(`Failed to parse your "package.json"`);
            return;
          }

          if (!existsSync(typegenFilePath)) {
            logger.warn(
              `"${FILENAME}" does not exist, make sure to execute the "sync" script of your "package.json"`
            );
            return;
          }
        },
        "astro:config:done": ({ config }) => {
          trailingSlash = config.trailingSlash;
          base = config.base;
        },
        "astro:build:done": ({ routes }) => {
          if (!process.argv.includes("--sync")) {
            return;
          }

          const data: Array<{ route: string; params: Array<string> }> = [];

          for (const { route: _route, params } of routes) {
            const route = `${withoutTrailingSlash(base)}${_route}`;
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
            types += `		"${route}": ${
              params.length === 0
                ? "never"
                : `{ ${params
                    .map(
                      (key) =>
                        `"${key}": ${
                          key.startsWith("...")
                            ? "string | undefined"
                            : "string"
                        }`
                    )
                    .join("; ")} }`
            };\n`;
          }
          const content = `
declare module "astro-typed-links" {
	interface AstroTypedLinks {
${types}	}
}`;

          mkdirSync(dirname(fileURLToPath(typegenFilePath)), {
            recursive: true,
          });
          writeFileSync(typegenFilePath, content, "utf-8");
        },
      },
    };
  },
});
