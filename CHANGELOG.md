## 2.0.0

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
