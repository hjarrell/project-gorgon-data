#!/usr/bin/env npx tsx
/**
 * Analyze a JSON data file to discover all fields, types, and optionality.
 *
 * Usage:
 *   npx tsx scripts/analyze-json.ts <file>
 *
 * Examples:
 *   npx tsx scripts/analyze-json.ts src/data/skills.json
 *   npx tsx scripts/analyze-json.ts src/data/effects.json
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const file = process.argv[2];
if (!file) {
  console.error('Usage: npx tsx scripts/analyze-json.ts <path-to-json>');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(resolve(file), 'utf-8'));

function typeOf(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

function analyzeRecord(entries: [string, Record<string, unknown>][], depth = 0) {
  const total = entries.length;
  const fieldMap = new Map<
    string,
    { count: number; types: Set<string>; elemTypes: Set<string>; subEntries: [string, Record<string, unknown>][] }
  >();

  for (const [, obj] of entries) {
    for (const [key, val] of Object.entries(obj)) {
      if (!fieldMap.has(key)) {
        fieldMap.set(key, { count: 0, types: new Set(), elemTypes: new Set(), subEntries: [] });
      }
      const info = fieldMap.get(key)!;
      info.count++;
      const t = typeOf(val);
      info.types.add(t);

      if (t === 'array') {
        for (const elem of val as unknown[]) {
          info.elemTypes.add(typeOf(elem));
        }
      }
      if (t === 'object' && !Array.isArray(val) && val !== null) {
        // Collect sub-object values for nested analysis
        // For record-style objects (varying keys), collect the values
        const sub = val as Record<string, unknown>;
        const valueTypes = new Set(Object.values(sub).map(typeOf));
        if (valueTypes.has('object')) {
          for (const sv of Object.values(sub)) {
            if (typeOf(sv) === 'object') {
              info.subEntries.push(['', sv as Record<string, unknown>]);
            }
          }
        }
      }
    }
  }

  const indent = '  '.repeat(depth);
  const sorted = [...fieldMap.entries()].sort(([a], [b]) => a.localeCompare(b));

  // Split into required and optional
  const required = sorted.filter(([, info]) => info.count === total);
  const optional = sorted.filter(([, info]) => info.count < total);

  if (required.length > 0) {
    console.log(`${indent}Required fields (${required.length}):`);
    for (const [key, info] of required) {
      printField(key, info, total, indent);
    }
  }
  if (optional.length > 0) {
    console.log(`${indent}Optional fields (${optional.length}):`);
    for (const [key, info] of optional) {
      printField(key, info, total, indent);
    }
  }

  // Print nested object analysis
  for (const [key, info] of sorted) {
    if (info.subEntries.length > 0) {
      console.log(`\n${indent}--- Nested: ${key} ---`);
      analyzeRecord(info.subEntries, depth + 1);
    }
  }
}

function printField(
  key: string,
  info: { count: number; types: Set<string>; elemTypes: Set<string> },
  total: number,
  indent: string,
) {
  const types = [...info.types].join(' | ');
  const countStr = info.count < total ? ` (${info.count}/${total})` : '';
  let extra = '';

  if (info.types.has('array') && info.elemTypes.size > 0) {
    extra = `  -- elements: ${[...info.elemTypes].join(' | ')}`;
  }

  console.log(`${indent}  ${key}: ${types}${countStr}${extra}`);
}

// Detect top-level shape
if (Array.isArray(raw)) {
  console.log(`Top-level: array (${raw.length} elements)\n`);
  const elemTypes = new Set(raw.map(typeOf));
  if (elemTypes.has('object')) {
    const objectEntries = raw
      .filter((v: unknown) => typeOf(v) === 'object')
      .map((v: unknown, i: number) => [String(i), v] as [string, Record<string, unknown>]);
    analyzeRecord(objectEntries);
  } else {
    console.log(`Element types: ${[...elemTypes].join(' | ')}`);
  }
} else if (typeOf(raw) === 'object') {
  const entries = Object.entries(raw) as [string, unknown][];
  console.log(`Top-level: record (${entries.length} entries)\n`);

  // Check if values are all the same type
  const valueTypes = new Set(entries.map(([, v]) => typeOf(v)));
  if (valueTypes.has('object')) {
    const objectEntries = entries
      .filter(([, v]) => typeOf(v) === 'object')
      .map(([k, v]) => [k, v] as [string, Record<string, unknown>]);
    analyzeRecord(objectEntries);
  } else {
    console.log(`Value types: ${[...valueTypes].join(' | ')}`);
  }
} else {
  console.log(`Top-level: ${typeOf(raw)}`);
}
