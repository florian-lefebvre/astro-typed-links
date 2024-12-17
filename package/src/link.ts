// biome-ignore lint/suspicious/noEmptyInterface: used for augmentation
export interface AstroTypedLinks {}

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
	}
	if (opts?.searchParams) {
		const searchParams =
			opts.searchParams instanceof URLSearchParams
				? opts.searchParams
				: new URLSearchParams(opts.searchParams);
		newPath += `?${searchParams.toString()}`;
	}
	if (opts?.hash) {
		newPath += `#${opts.hash}`;
	}
	return newPath;
};
