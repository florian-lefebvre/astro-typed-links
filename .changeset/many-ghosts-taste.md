---
"astro-typed-links": patch
---

Fixes a case where `searchParams` provided as an object would be encoded. The object is no longer used within a `URLSearchParams` instance.

```js
// BEFORE
link("/", { searchParams: { foo: "{BAR}" } }) // /?foo=%7BTEST%7D

// AFTER
link("/", { searchParams: { foo: "{BAR}" } }) // /?foo={BAR}

// To match the old behavior
link("/", { searchParams: new URLSearchParams({ foo: "{BAR}" }) }) // /?foo=%7BTEST%7D
```
