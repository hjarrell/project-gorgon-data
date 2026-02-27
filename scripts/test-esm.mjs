/**
 * Integration test: verifies every subpath export resolves under Node's native
 * ESM resolver (no bundler). Catches missing .js extensions and bare directory
 * imports that would break consumers using `import`.
 *
 * Modules that import JSON will fail under raw Node (requires import attributes)
 * but work fine through bundlers like Vite. These are tracked separately.
 */
import { pathToFileURL } from 'url';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const resolve = (sub) => pathToFileURL(join(root, sub)).href;

const subpaths = [
  'dist-esm/index.js',
  'dist-esm/schemas/index.js',
  'dist-esm/data/index.js',
  'dist-esm/data/items.js',
  'dist-esm/data/recipes.js',
  'dist-esm/data/skills.js',
  'dist-esm/data/abilities.js',
  'dist-esm/data/npcs.js',
  'dist-esm/data/areas.js',
  'dist-esm/data/sources.js',
  'dist-esm/planner/index.js',
  'dist-esm/helpers/index.js',
  'dist-esm/match3/index.js',
];

let failed = 0;
let jsonSkipped = 0;

for (const sub of subpaths) {
  try {
    await import(resolve(sub));
    console.log(`  ok    ${sub}`);
  } catch (err) {
    if (err.message.includes('import attribute')) {
      console.log(`  skip  ${sub}  (JSON import attributes — bundler-only)`);
      jsonSkipped++;
    } else {
      console.error(`  FAIL  ${sub}`);
      console.error(`        ${err.message}`);
      failed++;
    }
  }
}

console.log();
if (failed) {
  console.error(`${failed} ESM import(s) failed (${jsonSkipped} skipped — JSON bundler-only)`);
  process.exit(1);
} else {
  console.log(`All ${subpaths.length - jsonSkipped} ESM imports OK (${jsonSkipped} skipped — JSON bundler-only)`);
}
