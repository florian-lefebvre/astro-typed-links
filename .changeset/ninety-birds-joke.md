---
"astro-typed-links": major
---

This update contains **breaking changes**.

- Drops support for Astro 4.0 in favor of 5.0
- Usage is simplified
- Rest parameters must not be provided with the leading `...`

To simplify the usage of the integration, updates have been made in Astro core in 5.0, hence the drop of Astro 4.0 support. The README used to specify changes to your `package.json`, you can revert those changes:

```diff
{
    "scripts": {
-        "sync": "astro build --sync && astro sync"
    }
}
```

When dealing with rest parameters, you must not include the leading `...` anymore:

```diff
link("/[...rest]", {
-    "...rest": "foo/bar"
+    rest: "foo/bar"
})
```