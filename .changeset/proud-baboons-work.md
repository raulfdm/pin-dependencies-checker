---
"pin-dependencies-checker": major
---

refactor entire lib.

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
