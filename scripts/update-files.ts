#!/usr/bin/env npx tsx
/**
 * Download fresh game data JSON files from the Project Gorgon CDN.
 *
 * Before downloading, rotates the current raw/ directory to oldRaw/
 * so you can diff them afterwards with `pnpm diff-data`.
 *
 * Usage:
 *   pnpm update-files            # only downloads if version changed
 *   pnpm update-files --force    # downloads regardless of version
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = join(ROOT, 'src', 'data', 'raw');
const OLD_RAW_DIR = join(ROOT, 'src', 'data', 'oldRaw');
const VERSION_FILE = join(RAW_DIR, 'VERSION');

const VERSION_URL = 'http://client.projectgorgon.com/fileversion.txt';
const CDN_BASE = 'https://cdn.projectgorgon.com';

const DELAY_MS = 200;

/** All known CDN data files. Used as fallback when no local files exist yet. */
const KNOWN_FILES = [
  'abilities.json',
  'abilitydynamicdots.json',
  'abilitydynamicspecialvalues.json',
  'abilitykeywords.json',
  'advancementtables.json',
  'ai.json',
  'areas.json',
  'attributes.json',
  'directedgoals.json',
  'effects.json',
  'items.json',
  'itemuses.json',
  'landmarks.json',
  'lorebookinfo.json',
  'lorebooks.json',
  'npcs.json',
  'playertitles.json',
  'quests.json',
  'recipes.json',
  'skills.json',
  'sources_abilities.json',
  'sources_items.json',
  'sources_recipes.json',
  'storagevaults.json',
  'tsysclientinfo.json',
  'tsysprofiles.json',
  'xptables.json',
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getLocalVersion(): string | null {
  if (!existsSync(VERSION_FILE)) return null;
  return readFileSync(VERSION_FILE, 'utf-8').trim();
}

async function getRemoteVersion(): Promise<string> {
  const res = await fetch(VERSION_URL);
  if (!res.ok) throw new Error(`Failed to fetch version: ${res.status} ${res.statusText}`);
  return (await res.text()).trim();
}

function getJsonFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
}

async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buffer);
}

async function main() {
  const force = process.argv.includes('--force');

  const localVersion = getLocalVersion();
  console.log(`Local version:  ${localVersion ?? '(none)'}`);

  const remoteVersion = await getRemoteVersion();
  console.log(`Remote version: ${remoteVersion}`);

  if (!force && localVersion === remoteVersion) {
    console.log('\nAlready up to date. Use --force to re-download.');
    return;
  }

  // Determine which JSON files to download (from current raw/, oldRaw/, or fallback list)
  const sourceDir = existsSync(RAW_DIR) ? RAW_DIR : OLD_RAW_DIR;
  let jsonFiles = getJsonFiles(sourceDir);
  if (jsonFiles.length === 0) {
    console.log('\nNo local JSON files found — using built-in file list.');
    jsonFiles = KNOWN_FILES;
  }

  // Rotate: delete oldRaw if exists, rename raw -> oldRaw
  if (existsSync(OLD_RAW_DIR)) {
    console.log('\nRemoving previous oldRaw/...');
    rmSync(OLD_RAW_DIR, { recursive: true });
  }

  if (existsSync(RAW_DIR)) {
    console.log('Rotating raw/ → oldRaw/...');
    renameSync(RAW_DIR, OLD_RAW_DIR);
  }

  mkdirSync(RAW_DIR, { recursive: true });

  // Download each file
  console.log(`\nDownloading ${jsonFiles.length} files from v${remoteVersion}...\n`);

  let downloaded = 0;
  let failed = 0;

  for (const file of jsonFiles) {
    const url = `${CDN_BASE}/v${remoteVersion}/data/${file}`;
    const dest = join(RAW_DIR, file);
    try {
      process.stdout.write(`  ${file}...`);
      await downloadFile(url, dest);
      downloaded++;
      console.log(' ✓');
    } catch (err) {
      failed++;
      console.log(` ✗ ${err instanceof Error ? err.message : err}`);
    }
    await sleep(DELAY_MS);
  }

  // Write VERSION
  writeFileSync(join(RAW_DIR, 'VERSION'), remoteVersion + '\n');

  console.log(`\nDone. Downloaded: ${downloaded}, Failed: ${failed}`);
  console.log(`Version: ${localVersion ?? '(none)'} → ${remoteVersion}`);

  if (failed > 0) {
    console.log('\nSome files failed. Run with --force to retry.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
