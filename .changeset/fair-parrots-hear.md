---
"pin-dependencies-checker": minor
---

Add pnpm's catalog support.

Now, you can pass `--ignore-catalog` in case you're using this feature from pnpm.

```json
{
  "dependencies": {
    "my-dep": "catalog:",
    "other-dep": "catalog:depV20"
  }
}
```

```bash
# Fail
pnpx pin-dependencies-checker

# Pass
pnpx pin-dependencies-checker --ignore-catalog
```
