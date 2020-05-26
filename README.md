# Pin Dependencies Checker CLI <!-- omit in toc -->

[![License](https://img.shields.io/npm/l/pin-dependencies-checker.svg)](./LICENSE)
[![npm](https://img.shields.io/npm/v/pin-dependencies-checker.svg)](https://www.npmjs.com/package/pin-dependencies-checker)
[![Badge](https://github.com/raulfdm/pin-dependencies-checker/workflows/Checker%20and%20Deploy/badge.svg)](https://github.com/raulfdm/pin-dependencies-checker/actions?query=branch%3Amaster)
[![Maintainability](https://api.codeclimate.com/v1/badges/d6c846b63dc5456e3794/maintainability)](https://codeclimate.com/github/raulfdm/pin-dependencies-checker/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/d6c846b63dc5456e3794/test_coverage)](https://codeclimate.com/github/raulfdm/pin-dependencies-checker/test_coverage)

> Sometimes you need some reminder for boring tasks

## Table of Contents <!-- omit in toc -->

- [Why](#why)
- [How it works](#how-it-works)
- [Getting started](#getting-started)
  - [Global](#global)
  - [From registry (npx)](#from-registry-npx)
  - [Local](#local)
  - [Git hooks](#git-hooks)
- [Arguments](#arguments)
  - [`--peerDeps`](#--peerdeps)
  - [`--deps`](#--deps)
  - [`--devDeps`](#--devdeps)
- [TODOS](#todos)
- [License](#license)

## Why

The development world is wild. Every team has its own ways to do things.

Some, trust that those open source libraries always strictly follow semantic versing and when installing dependencies, just accept that the `caret` (^) will be fine. But some... want to have max control about everything and like to have all dependencies under their control.

Personally, I don't mind and don't judge. Both approaches have pros and cons. [At Renovate's blog, they wrote an entire post](https://docs.renovatebot.com/dependency-pinning/) explaining when we should pin dependencies version.

What I do mind is having to remember to pin a dependency version every time I install one. Also when my PR is almost ready to be merged and I receive a comment message like:

> "Hey, you forgot to pin this dependency. (;"

So then I've decided to automate this process. :)

## How it works

The idea is quite simple. This CLI:

1. Reads a `package.json` file from the folder you're calling it;
2. Based on the config (default or args passed), it'll search in each dependency version if it has caret (`^`);
3. If so, it'll print a list of all dependencies unpinned and exit with error (`process.exit(1)`), otherwise no errors and exit with `process.exit(0)`

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

### From registry (npx)

An alternative from installing it globally it might be using it via `npx`. If you're not familiar with this concept [check this blog post](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) but in a nutshell, it can execute packages directly from the registry.

It's good for CLI environments where you can create a step to run this CLI and based on the output, it'll fail or not your pipeline.

```bash
npx pin-dependencies-checker
```

### Local

If you want to have it as part of your project:

```bash
yarn global add pin-dependencies-checker

# Or via npm...

npm install -g pin-dependencies-checker
```

Then, in your project root dir (where the package.json file is located), you can just call

```bash
yarn pin-checker
```

### Git hooks

The goal of this project is automating a boring task, right? So you can add as a pre-commit hook using [`husky`](https://github.com/typicode/husky).

For that, install `husky` as `devDependency`:

```bash
yarn add -D husky

# Or via npm...

npm install --save-dev husky
```

After that, open your `package.json` file and add husky config with pre-commit:

```json
{
  "husky": {
    "pre-commit": "pin-checker"
  }
}
```

## Arguments

Maybe you only want to check for `devDependency` or only for `dependency`. You can customize that via cli args:

> Note: you can combine multiple args.

### `--peerDeps`

> Default: false

To enable `peerDependencies`:

```bash
yarn pin-checker --peerDeps=true
```

All `perDependencies`, `dependencies`, and `devDependencies` will be evaluated.

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

## TODOS

- Accept `--path` for a custom `package.json` path
- Maybe check for `tilde` by default and other characters like `<`, `>` via arguments

## License

MIT
