# Changelog

## 0.1.1

### Bug Fixes

- **match3**: Fix simulation not applying K-type increases during cascades. Collection counters and K are now resolved mid-cascade inside `applyMove` instead of after, so chained collections within a single turn are handled correctly.

### Build

- **ESM**: Fix bare directory imports and missing `.js` extensions in `dist-esm/` output that caused `ERR_UNSUPPORTED_DIR_IMPORT` errors under Node's native ESM resolver. Added `fix-esm-import-path` post-build step and `dist-esm/package.json` with `"type": "module"`.
- Add `test:esm` script to verify ESM subpath exports resolve correctly.

## 0.1.0

Initial release.
