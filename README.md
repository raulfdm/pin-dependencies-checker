# Pin Dependencies Checker CLI

> Sometimes you need a reminder for mundane tasks.

## Table of Contents

- [Why](#why)
- [How it Works](#how-it-works)
- [Getting Started](#getting-started)
- [Arguments](#arguments)
- [Contributing](#contributing)
- [License](#license)

## Why

When installing dependencies without specifying a version, package managers (yarn, npm, pnpm, etc.) will, by default, install the latest published version with a caret `^`:

```bash
pnpm add lodash
```

```json
{
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

This is termed a "ranged" version.

In the lock file, it will be registered that `lodash` is installed on version `4.17.21` OR HIGHER... and this is where issues arise.

Suppose lodash `4.18.0` is released, and it removes or alters an API our codebase depends on. If I need to regenerate my `lockfile` for any reason, the package manager will again fetch the latest version 4 of `lodash`. Instead of installing `4.17.21`, it will fetch the new `4.18.0`.

If we have unit tests, builds, etc., we'll likely encounter issues without understanding the cause. Our package.json hasn't changed, right? However, it's the `lockfile` that determines which dependencies get installed.

One way to ensure consistent versions is to avoid installing ranged versions. This can be achieved in various ways depending on the package manager:

```bash
pnpm add --save-exact lodash
```

Or, using pnpm, it can be defined in `.npmrc`:

```
save-prefix=''
```

Alternatively, you can use this tool as a pre-commit reminder to assess all dependencies you've installed and check for ranged versions. 😅

> [!IMPORTANT]  
> Renovate provides an [extensive article](https://docs.renovatebot.com/dependency-pinning/) detailing the issues with ranged versions. I highly recommend reading it.

## How it Works

The process is straightforward:

1. Scan all `package.json` files in the current work directory.
2. Identify all dependencies that:
   - aren't valid semver versions (e.g. `1.2.3` or `4.5.6.alpha`)
   - are URLs or GitHub repositories and don't contain a commitish string neither a semver string
3. If any are found, the CLI will list them and exit with an error.
4. Otherwise, it will exit successfully.

## Getting Started

You can use this CLI directly from the registry via [`npx`](https://docs.npmjs.com/cli/v8/commands/npx) or [`pnpm dlx`](https://pnpm.io/cli/dlx):

```bash
pnpm dlx pin-dependencies-checker

# OR using npm

npx pin-dependencies-checker
```

Alternatively, add it to your project's dev dependencies:

```bash
pnpm add --save-exact --save-dev pin-dependencies-checker
# Or the equivalent command for your package manager
```

Then run:

```bash
pnpm pin-checker
# Or for npm or yarn
npx pin-checker
```

### Git Hooks

You can automate the CLI execution using a git hook (e.g., pre-commit).

Many JS projects use [`husky`](https://github.com/typicode/husky) for this purpose.

Simply add the command to your `pre-commit` script:

```bash
# Other commands and setup
pnpm pin-checker

# Or using npx
npx pin-checker
```

## Arguments

By default, this CLI scans only `dependencies` and `devDependencies`. This behavior can be modified with CLI arguments.

### `--ignore-workspaces`

> Default: false

Allows versions starting with `workspaces:` to be ignored:

```bash
pnpm pin-checker --ignore-workspaces
```

### `--ignore-catalog`

> Default: false

Allows versions starting with `catalog:` to be ignored:

```bash
pnpm pin-checker --ignore-catalog
```

> [See more about pnpm's catalogs feature](https://pnpm.io/catalogs)

### `--no-deps`

> Default: false

Skips the `dependencies` evaluation:

```bash
pnpm pin-checker --no-deps
```

### `--no-dev-deps`

> Default: false

Skips the `devDependencies` evaluation:

```bash
pnpm pin-checker --no-dev-deps
```

### `--peer-deps`

> Default: false

Evaluates `peerDependencies`:

> **NOTE**
> Peer dependencies are primarily for libraries, indicating to the package manager the necessary version for the library to function correctly. You likely don't want to verify this.

```bash
pnpm pin-checker --peer-deps
```

### `--optional-deps`

> Default: false

Evaluates [`optionalDependencies`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#optionaldependencies):

```bash
pnpm pin-checker --optional-deps
```

## Contributing

To run this project, you'll need:

- bun 1.2.10 or higher

After cloning, install the dependencies:

```bash
bun install
```

You can either link the package globally or run the command:

```bash
bun run dev
```

This will evaluate the current repository, which can be handy for quick tests.

To run unit tests:

```bash
bun run test
```

## License

[MIT](./LICENSE)
