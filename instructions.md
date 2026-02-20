# Adding a schema for a data file

You are working on a TypeScript library that parses Project Gorgon MMO JSON data with Zod schemas. Look at `src/schemas/areas.ts` (simple) and `src/schemas/items.ts` (complex) for the pattern.

## Steps

1. Pick a JSON file from `src/data/` that doesn't have a schema yet. Run `pnpm analyze src/data/{name}.json` to discover all fields, their types, and whether they're required or optional.

2. Create `src/schemas/{name}.ts`:
   - Import `z` from `'zod'`
   - Define schemas with `.strict()` on all objects
   - Use `z.record()` for Record-type files, `z.array()` for array-type files (abilitydynamicdots, abilitydynamicspecialvalues, abilitykeywords, directedgoals)
   - Export inferred types at the bottom with `z.infer<typeof Schema>`
   - Drop any `Raw` prefix from names

3. Add exports to `src/schemas/index.ts` (schemas and types separately).

4. Add a typed Map export to `src/data/index.ts`:
   - Import the type from `'../schemas'`
   - Create `export const {name} = new Map<string, {Type}>(Object.entries(RAW_{NAME} as Record<string, {Type}>))`

5. Add the schema + data to `VALIDATORS` in `src/validate-lib.ts`.

6. Add a test case to `src/validate.test.ts`.

7. Run `pnpm test` to verify. Fix any `.strict()` failures by adding missing fields to the schema.

8. Run `pnpm run build` to verify no TS errors.
