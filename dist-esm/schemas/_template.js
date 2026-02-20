"use strict";
// TEMPLATE: Copy this file to add a new schema for a data file.
//
// Steps:
// 1. Copy this file to src/schemas/{name}.ts
// 2. Sample the JSON file to identify all fields and their types.
//    A quick way to find all keys and their frequency:
//
//    python3 -c "
//    import json
//    with open('src/data/{name}.json') as f:
//        data = json.load(f)
//    items = data.values() if isinstance(data, dict) else data
//    all_keys = set()
//    for val in items:
//        all_keys.update(val.keys())
//    total = len(list(data.values() if isinstance(data, dict) else data))
//    for key in sorted(all_keys):
//        count = sum(1 for v in (data.values() if isinstance(data, dict) else data) if key in v)
//        print(f'{key}: {count}/{total}')
//    "
//
// 3. Build the schema following the patterns in:
//    - areas.ts (simple example)
//    - items.ts (complex example with nested objects)
// 4. Add exports to src/schemas/index.ts
// 5. Add a typed Map to src/data/index.ts
// 6. Add to VALIDATORS in src/validate-lib.ts
// 7. Run `pnpm run validate` to verify
//
// For Record-type files (most files):
//   export const {Entity}Schema = z.object({ ... }).strict();
//   export const {Plural}RecordSchema = z.record(z.string(), {Entity}Schema);
//
// For Array-type files (abilitydynamicdots, abilitydynamicspecialvalues,
//                       abilitykeywords, directedgoals):
//   export const {Entity}Schema = z.object({ ... }).strict();
//   export const {Plural}ArraySchema = z.array({Entity}Schema);
//
// Type exports (always at the bottom):
//   export type {Entity} = z.infer<typeof {Entity}Schema>;
//   export type {Collection} = z.infer<typeof {Collection}Schema>;
