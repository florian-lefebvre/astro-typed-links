---
"astro-typed-links": minor
---

Support Astro v6 hook execution order, backward compatible with v5.

Support Astro v6 hook execution order, where astro:config:done runs before astro:routes:resolved.
The package fails with Astro 6 due to changes in integration hook execution order.
astro:config:done now runs before astro:routes:resolved this caused "routes is not iterable" error when trying to generate types, additionally, the type file directory didn't exist when astro:routes:resolved attempted to write to it.