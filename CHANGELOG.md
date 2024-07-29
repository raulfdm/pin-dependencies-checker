## 2.0.0

## 2.4.0

### Minor Changes

- aaa7a62: force version bump

## 2.3.0

### Minor Changes

- 13f1724: adds a flag for ignoring versions that begin with "workspace:"
- b39142c: Support checking [package aliases](https://pnpm.io/aliases). For example, `"package-alias": "npm:some-package@2.26.4"`.

### Patch Changes

- 7d7b996: bump @manypkg/get-packages version

## 2.2.0

### Minor Changes

- 4556f54: - made check of unpinned dependencies stricter
  - strings that point to the latest version like `*`, `''`or `latest` are considered as unpinned
  - ranges (`>=1.0.2 <2.1.2` or `3.3.x`) are considered as unpinned
  - larger smaller (`>=1.0.2`) or smaller larger (`< 2.0.1`) are considered as unpinned
  - local file paths (`file:`) are considered as pinned
  - workspace links (`workspace:*`) are considered as pinned if they are using a valid semver version
  - URLs or GitHub repositories are considered as unpinned if they don't contain a commitish or valid semver string

## 2.1.0

### Minor Changes

- a233e70: enhance console log

### Major Changes

- 8206ed7: refactor entire lib.

  ## Description

  This tool is 3 years old and a lot have changed since its creation.

  I got the change to complete refactor with modern tooling and a simplified codebase.

  ## Changes

  - (BREAKING CHANGE) It requires Node18 or higher to run. Now it's full ESM;
  - (BREAKING CHANGE) params were renamed to align with classic CLIs standards
    - Before `--peerDeps` -> Now `--peer-deps`;
    - Before `--deps=false` => Now `--no-deps`;
    - Before `--devDeps=false` => Now `--no-dev-deps`;
  - (NEW) Include new flag to evaluate `optionalDependencies`:
    ```bash
    pnpm pin-checker --optional-deps
    ```
  - (NEW) Now it works in monorepo as well
  - (INTERNAL) Replaces dev tooling

### Patch Changes

- e871893: update readme

### Bug Fixes

- remove process.exit when success ([9e164f4](https://github.com/raulfdm/pin-dependencies-checker/commit/9e164f49c15fcf7a654f7e154aec60d4b2b61d98))

## [1.0.6](https://github.com/raulfdm/pin-dependencies-checker/compare/v1.0.5...v1.0.6) (2021-11-29)

### Bug Fixes

- remove process.exit when success ([9e164f4](https://github.com/raulfdm/pin-dependencies-checker/commit/9e164f49c15fcf7a654f7e154aec60d4b2b61d98))

## [1.0.5](https://github.com/raulfdm/pin-dependencies-checker/compare/v1.0.4...v1.0.5) (2020-06-07)

### Bug Fixes

- **release:** add git plugin to proper generate changelog ([6666c83](https://github.com/raulfdm/pin-dependencies-checker/commit/6666c83eb18a54ca271956516c10c2bc64d45568))
