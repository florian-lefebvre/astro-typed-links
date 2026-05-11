---
"astro-typed-links": major
---

Removes deprecated `link` export from `astro-typed-links`. Use `astro-typed-links/link` instead:

```diff
-import { link } from "astro-typed-links"
+import { link } from "astro-typed-links/link"
```
