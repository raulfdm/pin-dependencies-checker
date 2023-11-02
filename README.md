# Pin Dependencies Checker CLI

> Sometimes you need some reminder for boring tasks

## Table of Contents

- [Why](#why)
- [How it works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Why

When we install dependencies without specifying a version, by default the package managers (yarn, npm, pnpm, etc.) will install the latest published version with a caret `^`:

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

This is called "ranged" version.

In the lock file, it'll be registered that `lodash` is installed on version `4.17.21` OR HIGHER... and here is where the problem starts.

Let's say lodash `4.18.0` is released and it removes or changes an API our code base relies on. If I need to regenerate my `lockfile` for any reason, the package manager will try to, again, get the latest version 4 of `lodash`, but instead installing the `4.17.21`, it'll install the new `4.18.0`.

If we have unit tests/build/etc, most likely we'll start having problems without even realizing why's that. Our package.json haven't changed, right? But the `lockfile` is the one who determines which dependencies will be installed.

One way to ensure we'll ALWAYS have the exact same version is to avoid installing ranged version, and this could be achieved in some ways depending on the package manager you use.

We can specify to install the latest version and save it exact:

```bash
pnpm add --save-exact lodash
```

Or (still using pnpm), we can define it in our `.npmrc`:

```
save-prefix=''
```

> [!IMPORTANT]  
> Renovate has an [extensive article](https://docs.renovatebot.com/dependency-pinning/) explaining the problems with ranged version. I do recommend the reading.

Or... you can use this tools as a pre-commit reminder to evaluate all dependencies you have installed and check for ranged versions. 😅

## How it works

The idea is simple. It'll:

1. Scan all `package.json` you have in the current work directory;
2. It'll scan all dependencies which has caret (`^`);
3. If some was found, then it'll inform those and exit the CLI with error;
4. ...Otherwise it'll exit with success.

## Getting started

You can use this CLI directly from registry via [`npx`](https://docs.npmjs.com/cli/v8/commands/npx) or [`pnpm dlx`](https://pnpm.io/cli/dlx):

```bash
pnpm dlx pin-dependencies-checker

# OR using npm

npx pin-dependencies-checker
```

Or you can add it as your project's dev dependencies:

```bash
pnpm add --save-exact --save-dev pin-dependencies-checker
# Or your package manager equivalent
```

Then you can run:

```bash
pnpm pin-checker
# Or for npm or yarn
npx pin-checker
```

### Git hooks

You can also execute the CLI in an automated way via git hook (e.g., pre-commit).

Most of JS projects uses [`husky`](https://github.com/typicode/husky) to implement this mechanism.

All you'll need is to go to your `pre-commit` script or command and run the binary:

```bash
# Other commands and setup
pnpm pin-checker

# Or using npx
npx pin-checker
```

## Arguments

By default, this CLI will only scan for `dependencies` and `devDependencies`. You can change this behavior by using CLI arguments.

### `--no-deps`

> Default: false

If present, it'll skip the `dependencies` evaluation:

```bash
pnpm pin-checker --no-deps
```

### `--no-dev-deps`

> Default: false

If present, it'll skip the `devDependencies` evaluation:

```bash
pnpm pin-checker --no-dev-deps
```

### `--peer-deps`

> Default: false

If present, it'll evaluate `peerDependencies`

> **NOTE**
> Peer deps are mostly for libraries and it's useful for telling the package manager that this lib expects a version X or higher so it can work properly. You probably don't want to check that.

```bash
pnpm pin-checker --per-deps
```

### `--optional-deps`

> Default: false

If present, it'll evaluate [`optionalDependencies`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#optionaldependencies)

```bash
pnpm pin-checker --optional-deps
```

## Contributing

To run this project you need:

- Node20 or higher;
- pnpm

Once you clone it, install the dependencies:

```bash
pnpm install
```

Now you can either link globally the package, or run the command:

```bash
pnpm run dev
```

This will evaluate the current repository. It might be good for quick tests.

To run unit tests:

```bash
pnpm run test
```

## License

[MIT](./LICENSE)
