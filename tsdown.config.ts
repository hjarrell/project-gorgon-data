import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'schemas/index': 'src/schemas/index.ts',
    'data/index': 'src/data/index.ts',
    'data/items': 'src/data/items.ts',
    'data/recipes': 'src/data/recipes.ts',
    'data/skills': 'src/data/skills.ts',
    'data/abilities': 'src/data/abilities.ts',
    'data/npcs': 'src/data/npcs.ts',
    'data/areas': 'src/data/areas.ts',
    'data/sources': 'src/data/sources.ts',
    'planner/index': 'src/planner/index.ts',
    'helpers/index': 'src/helpers/index.ts',
    'match3/index': 'src/match3/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['zod'],
});
