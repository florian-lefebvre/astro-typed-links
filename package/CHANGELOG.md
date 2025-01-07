# astro-typed-links

## 1.1.2

### Patch Changes

- ebc9d41: Fixes a case where `searchParams` provided as an object would be encoded. The object is no longer used within a `URLSearchParams` instance.

  ```js
  // BEFORE
  link("/", { searchParams: { foo: "{BAR}" } }); // /?foo=%7BTEST%7D

  // AFTER
  link("/", { searchParams: { foo: "{BAR}" } }); // /?foo={BAR}

  // To match the old behavior
  link("/", { searchParams: new URLSearchParams({ foo: "{BAR}" }) }); // /?foo=%7BTEST%7D
  ```

## 1.1.1

### Patch Changes

- 0cf982c: Fixes a case where atrailing slash would be incorrectly appended to endpoints patterns ending with file extensions

## 1.1.0

### Minor Changes

- a51742b: Updates how `link` should be imported

  Importing `link` from `astro-typed-links` is deprecated, `astro-typed-links/link` should now be used. This change was necessary because code from the integration was leaking when used client side:

  ```diff
  -import { link } from "astro-typed-links"
  +import { link } from "astro-typed-links/link"
  ```

## 1.0.0

### Major Changes

- 390f225: This update contains **breaking changes**.

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

## 0.1.1

### Patch Changes

- a7a9e48: Improves docs

## 0.1.0

### Minor Changes

- 3370bda: Initial release
