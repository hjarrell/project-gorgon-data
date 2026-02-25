#!/usr/bin/env npx tsx
/**
 * Compare oldRaw/ vs raw/ JSON data locally (no network calls).
 *
 * Run `pnpm update-files` first to populate both directories,
 * then use this to see what changed.
 *
 * Usage:
 *   pnpm diff-data
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = join(ROOT, 'src', 'data', 'raw');
const OLD_RAW_DIR = join(ROOT, 'src', 'data', 'oldRaw');

function readVersion(dir: string): string {
  const versionFile = join(dir, 'VERSION');
  if (!existsSync(versionFile)) return '(unknown)';
  return readFileSync(versionFile, 'utf-8').trim();
}

function loadJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

interface FileDiff {
  file: string;
  status: 'added' | 'removed' | 'changed' | 'unchanged';
  details?: string;
}

function diffFile(file: string): FileDiff {
  const oldPath = join(OLD_RAW_DIR, file);
  const newPath = join(RAW_DIR, file);

  const oldExists = existsSync(oldPath);
  const newExists = existsSync(newPath);

  if (!oldExists && newExists) return { file, status: 'added' };
  if (oldExists && !newExists) return { file, status: 'removed' };
  if (!oldExists && !newExists) return { file, status: 'unchanged' };

  const oldData = loadJson(oldPath);
  const newData = loadJson(newPath);

  // Compare based on data shape
  if (Array.isArray(oldData) && Array.isArray(newData)) {
    const oldLen = oldData.length;
    const newLen = newData.length;
    if (oldLen === newLen) return { file, status: 'unchanged', details: `${newLen} items` };
    const delta = newLen - oldLen;
    const sign = delta > 0 ? '+' : '';
    return { file, status: 'changed', details: `${oldLen} → ${newLen} items (${sign}${delta})` };
  }

  if (typeof oldData === 'object' && oldData !== null && typeof newData === 'object' && newData !== null && !Array.isArray(oldData)) {
    const oldKeys = new Set(Object.keys(oldData as Record<string, unknown>));
    const newKeys = new Set(Object.keys(newData as Record<string, unknown>));

    const added = [...newKeys].filter((k) => !oldKeys.has(k));
    const removed = [...oldKeys].filter((k) => !newKeys.has(k));

    if (added.length === 0 && removed.length === 0) {
      return { file, status: 'unchanged', details: `${newKeys.size} keys` };
    }

    const parts: string[] = [];
    parts.push(`${oldKeys.size} → ${newKeys.size} keys`);
    if (added.length > 0) {
      parts.push(`+${added.length} added`);
      if (added.length <= 5) parts.push(`  (${added.join(', ')})`);
    }
    if (removed.length > 0) {
      parts.push(`-${removed.length} removed`);
      if (removed.length <= 5) parts.push(`  (${removed.join(', ')})`);
    }
    return { file, status: 'changed', details: parts.join(', ') };
  }

  // Fallback: byte comparison
  const oldBuf = readFileSync(join(OLD_RAW_DIR, file));
  const newBuf = readFileSync(join(RAW_DIR, file));
  if (oldBuf.equals(newBuf)) return { file, status: 'unchanged' };
  return { file, status: 'changed', details: 'content differs' };
}

function main() {
  if (!existsSync(OLD_RAW_DIR)) {
    console.log('No oldRaw/ directory found. Run `pnpm update-files` first to create a previous snapshot.');
    process.exit(0);
  }

  if (!existsSync(RAW_DIR)) {
    console.log('No raw/ directory found.');
    process.exit(1);
  }

  const oldVersion = readVersion(OLD_RAW_DIR);
  const newVersion = readVersion(RAW_DIR);
  console.log(`Comparing v${oldVersion} (oldRaw) → v${newVersion} (raw)\n`);

  // Collect all JSON filenames from both dirs
  const allFiles = new Set([
    ...readdirSync(OLD_RAW_DIR).filter((f) => f.endsWith('.json')),
    ...readdirSync(RAW_DIR).filter((f) => f.endsWith('.json')),
  ]);

  const diffs: FileDiff[] = [];
  for (const file of [...allFiles].sort()) {
    diffs.push(diffFile(file));
  }

  const changed = diffs.filter((d) => d.status === 'changed');
  const added = diffs.filter((d) => d.status === 'added');
  const removed = diffs.filter((d) => d.status === 'removed');
  const unchanged = diffs.filter((d) => d.status === 'unchanged');

  if (added.length > 0) {
    console.log('New files:');
    for (const d of added) console.log(`  + ${d.file}`);
    console.log();
  }

  if (removed.length > 0) {
    console.log('Removed files:');
    for (const d of removed) console.log(`  - ${d.file}`);
    console.log();
  }

  if (changed.length > 0) {
    console.log('Changed files:');
    for (const d of changed) console.log(`  ~ ${d.file}: ${d.details}`);
    console.log();
  }

  console.log(`Summary: ${changed.length} changed, ${added.length} added, ${removed.length} removed, ${unchanged.length} unchanged`);

  if (changed.length === 0 && added.length === 0 && removed.length === 0) {
    console.log('No differences found.');
  }
}

main();
