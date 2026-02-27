# Changelog

## 0.1.2

### Build

- **Breaking (internal)**: Migrate build toolchain from dual `tsc` to `tsdown` (rolldown). Produces correct ESM (`.mjs`) and CJS (`.cjs`) outputs with proper extensions and no bare directory imports.
- JSON game data is now loaded at runtime via `readFileSync`/`JSON.parse` instead of static `import`, avoiding OOM during bundling of ~45 MB of JSON.
- Remove `fix-esm-import-path`, `tsconfig.esm.json`, and dual-tsc post-processing. Build completes in ~2 seconds.
- Add `tsdown.config.ts` with 13 entry points, dual ESM/CJS format, DTS generation, and `zod` as external.

## 0.1.1

### Bug Fixes

- **match3**: Fix simulation not applying K-type increases during cascades. Collection counters and K are now resolved mid-cascade inside `applyMove` instead of after, so chained collections within a single turn are handled correctly.

### Build

- **ESM**: Fix bare directory imports and missing `.js` extensions in `dist-esm/` output that caused `ERR_UNSUPPORTED_DIR_IMPORT` errors under Node's native ESM resolver. Added `fix-esm-import-path` post-build step and `dist-esm/package.json` with `"type": "module"`.
- Add `test:esm` script to verify ESM subpath exports resolve correctly.

## 0.1.0

Initial release.
