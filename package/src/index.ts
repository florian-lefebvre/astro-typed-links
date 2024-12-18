import { integration } from "./integration.js";
import { link as _link } from "./link.js";

/**
 * @deprecated Use `link` exported from `astro-typed-links/link` instead. Importing this
 * function client-side will cause the build to fail. It will be removed in the next major
 */
export const link = _link;

export default integration;

// biome-ignore lint/suspicious/noEmptyInterface: used for augmentation
export interface AstroTypedLinks {}
