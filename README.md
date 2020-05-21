# Pin Dependencies Checker CLI

> Sometimes you need some reminder for boring tasks

## Why

Development world is wild. Every team has its own ways to do things.

Some, trust that open source libraries always strict follow semantic versing and when install dependencies, just accept that the `caret` (^) will be fine. But some... want to have max control about everything and like to have all dependencies under their control.

Personally, I don't mind and don't judge. Both approaches have pros and cons. [At Renovate's blog, they wrote a entire post](https://docs.renovatebot.com/dependency-pinning/) explaining when we should pin dependencies version.

What I do mind is having to remember to pin a dependency version every time I install one. Also when my PR is almost ready to be merged and I receive a comment message like:

> Hey, you forgot to pin this dependency.

So then I decided automate this process. :)

## Getting started

You can use this CLI globally or as a project dependency.

### Global

```bash
yarn global add pin-dependencies-checker

## Or

npm install -g pin-dependencies-checker
```

Then, in your project root dir (where the package.json file is located), you can just call

```bash
pin-checker
```

### Local

If you want to have it as part of your project:

```bash
yarn global add pin-dependencies-checker

## Or

npm install -g pin-dependencies-checker
```

Then, in your project root dir (where the package.json file is located), you can just call

```bash
yarn pin-checker
```

### Git hooks

The goal from the project is automating boring tasks, right? So you can add as a pre-commit hook using `husky`.

For that, install `husky` as `devDependency`:

```bash
yarn add -D husky

# or

npm install --save-dev husky
```

After that, open your package.json file and add husky config with pre-commit:

```json
{
  "husky": {
    "pre-commit": "pin-checker"
  }
}
```

## Params

Maybe you only want to check for devDependency or only for dependency. You can customize that via cli args:

> Note: you can combine multiple args.

### `--perDeps`

> Default: false

To enable `peerDependencies`:

```bash
yarn pin-checker --perDeps=true
```

All `perDependencies`, `dependencies` and `devDependencies` will be evaluated.

### `--deps`

> Default: true

To disable dev dependencies:

```bash
yarn pin-checker --deps=false
```

Only `devDependencies` will be evaluated.

### `--devDeps`

> Default: true

To disable dev dependencies:

```bash
yarn pin-checker --devDeps=false
```

Only `dependencies` will be evaluated.
