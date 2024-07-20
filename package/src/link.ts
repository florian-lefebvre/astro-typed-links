export interface AstroTypedLinks
  extends Record<string, Record<string, string> | never> {}

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

export const link = <TPath extends keyof AstroTypedLinks>(
  path: TPath,
  ...[opts]: AstroTypedLinks[TPath] extends never
    ? [opts?: Opts<AstroTypedLinks[TPath]>]
    : [opts: Opts<AstroTypedLinks[TPath]>]
) => {
  let newPath = path as string;
  if (opts?.params) {
    for (const [key, value] of Object.entries(opts.params)) {
      newPath = newPath.replace(`[${key}]`, value);
    }
  }
  if (opts?.searchParams) {
    const searchParams =
      opts.searchParams instanceof URLSearchParams
        ? opts.searchParams
        : new URLSearchParams(opts.searchParams);
    newPath += `?${searchParams}`;
  }
  if (opts?.hash) {
    newPath += `#${opts.hash}`;
  }
  return newPath;
};
