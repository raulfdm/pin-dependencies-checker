---
"pin-dependencies-checker": minor
---

- made check of unpinned dependencies stricter
  - strings that point to the latest version like `*`, `''`or `latest` are considered as unpinned
  - ranges (`>=1.0.2 <2.1.2` or `3.3.x`) are considered as unpinned
  - larger smaller (`>=1.0.2`) or smaller larger (`< 2.0.1`)  are considered as unpinned
  - local file paths (`file:`) are considered as pinned
  - workspace links (`workspace:*`) are considered as pinned if they are using a valid semver version
  - URLs or GitHub repositories are considered as unpinned if they don't contain a commitish or valid semver string