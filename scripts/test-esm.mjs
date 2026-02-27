/**
 * Integration test: verifies every subpath export resolves under Node's native
 * ESM resolver (no bundler). tsdown bundles JSON inline so all imports should
 * work without import attributes.
 */
import { pathToFileURL } from 'url';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const resolve = (sub) => pathToFileURL(join(root, sub)).href;

const subpaths = [
  'dist/index.mjs',
  'dist/schemas/index.mjs',
  'dist/data/index.mjs',
  'dist/data/items.mjs',
  'dist/data/recipes.mjs',
  'dist/data/skills.mjs',
  'dist/data/abilities.mjs',
  'dist/data/npcs.mjs',
  'dist/data/areas.mjs',
  'dist/data/sources.mjs',
  'dist/planner/index.mjs',
  'dist/helpers/index.mjs',
  'dist/match3/index.mjs',
];

let failed = 0;

for (const sub of subpaths) {
  try {
    await import(resolve(sub));
    console.log(`  ok  ${sub}`);
  } catch (err) {
    console.error(`  FAIL  ${sub}`);
    console.error(`        ${err.message}`);
    failed++;
  }
}

console.log();
if (failed) {
  console.error(`${failed}/${subpaths.length} ESM import(s) failed`);
  process.exit(1);
} else {
  console.log(`All ${subpaths.length} ESM imports OK`);
}
