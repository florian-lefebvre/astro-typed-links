# `astro-typed-links`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that automatically get typed links to your pages.

## Usage

### Prerequisites

TODO:

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-typed-links
```

```bash
npx astro add astro-typed-links
```

```bash
yarn astro add astro-typed-links
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-typed-links
```

```bash
npm install astro-typed-links
```

```bash
yarn add astro-typed-links
```

2. Add the integration to your astro config

```diff
+import integration from "astro-typed-links";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:configuration

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/florian-lefebvre/astro-typed-links/blob/main/LICENSE). Made with ❤️ by [Florian Lefebvre](https://github.com/florian-lefebvre).
