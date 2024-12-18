---
"astro-typed-links": minor
---

Updates how `link` should be imported

Importing `link` from `astro-typed-links` is deprecated, `astro-typed-links/link` should now be used. This change was necessary because code from the integration was leaking when used client side:

```diff
-import { link } from "astro-typed-links"
+import { link } from "astro-typed-links/link"
```