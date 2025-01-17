import type { AstroTypedLinks } from "./index.js";

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type Opts<T> = Prettify<
	([T] extends [never]
		? {
				params?: never;
			}
		: {
				params: T;
			}) & {
		searchParams?: Record<string, string> | URLSearchParams;
		hash?: string;
	}
>;

/**
 * Get type-safe links to your Astro routes.
 */
export const link = <TPath extends keyof AstroTypedLinks>(
	path: TPath,
	...[opts]: AstroTypedLinks[TPath] extends never
		? [opts?: Opts<AstroTypedLinks[TPath]>]
		: [opts: Opts<AstroTypedLinks[TPath]>]
) => {
	let newPath = path as string;
	if (opts?.params) {
		for (const [key, value] of Object.entries(
			opts.params as Record<string, string | undefined>,
		)) {
			newPath = newPath
				.replace(`[${key}]`, value ?? "")
				.replace(`[...${key}]`, value ?? "");
		}
		// When using spread parameters with a trailing slash, it results in invalid //
		// We clean that up
		newPath = newPath.replace(/\/\//g, "/");
	}
	if (opts?.searchParams) {
		if (opts.searchParams instanceof URLSearchParams) {
			newPath += `?${opts.searchParams.toString()}`;
		} else {
			// We need custom handling to avoid encoding
			const entries = Object.entries(opts.searchParams);
			for (let i = 0; i < entries.length; i++) {
				// biome-ignore lint/style/noNonNullAssertion: we know the element exists for this index
				const [key, value] = entries[i]!;
				newPath += `${i === 0 ? "?" : "&"}${key}=${value}`;
			}
		}
	}
	if (opts?.hash) {
		newPath += `#${opts.hash}`;
	}
	return newPath;
};
