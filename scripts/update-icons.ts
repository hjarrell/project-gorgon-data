#!/usr/bin/env npx tsx
/**
 * Download game icon PNGs from the Project Gorgon CDN.
 *
 * Scans all JSON data files for IconId/IconID/IconIds fields,
 * then downloads each referenced icon. Skips icons that already
 * exist in the output directory (incremental).
 *
 * Usage:
 *   pnpm update-icons -- --out ../gorgon_tools/public/icons
 *   pnpm update-icons -- --out ./icons --force
 *
 * Options:
 *   --out <path>   Output directory for icon PNGs (required)
 *   --force        Re-download icons even if they already exist
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = join(ROOT, 'src', 'data', 'raw');
const VERSION_FILE = join(RAW_DIR, 'VERSION');

const CDN_BASE = 'https://cdn.projectgorgon.com';

// Rate limiting
const DELAY_BETWEEN_REQUESTS_MS = 50;
const BATCH_SIZE = 20;
const BATCH_PAUSE_MS = 500;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function getVersion(): string {
  if (!existsSync(VERSION_FILE)) {
    console.error('No VERSION file found. Run `pnpm update-files` first.');
    process.exit(1);
  }
  return readFileSync(VERSION_FILE, 'utf-8').trim();
}

function collectIconIds(): Set<number> {
  const ids = new Set<number>();

  function scan(obj: unknown): void {
    if (Array.isArray(obj)) {
      for (const item of obj) scan(item);
      return;
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        if ((key === 'IconId' || key === 'IconID') && typeof value === 'number') {
          ids.add(value);
        } else if (key === 'IconIds' && Array.isArray(value)) {
          for (const v of value) {
            if (typeof v === 'number') ids.add(v);
          }
        } else {
          scan(value);
        }
      }
    }
  }

  const jsonFiles = readdirSync(RAW_DIR).filter((f) => f.endsWith('.json'));
  for (const file of jsonFiles) {
    const data = JSON.parse(readFileSync(join(RAW_DIR, file), 'utf-8'));
    scan(data);
  }

  return ids;
}

async function downloadWithRetry(url: string, dest: string): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 404) return false; // icon doesn't exist on CDN
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      writeFileSync(dest, buffer);
      return true;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const backoff = RETRY_BASE_MS * Math.pow(2, attempt - 1);
        await sleep(backoff);
      } else {
        throw err;
      }
    }
  }
  return false;
}

function parseArgs(): { outDir: string; force: boolean } {
  const args = process.argv.slice(2);
  let outDir = '';
  let force = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out' && i + 1 < args.length) {
      outDir = args[++i];
    } else if (args[i] === '--force') {
      force = true;
    }
  }

  if (!outDir) {
    console.error('Usage: pnpm update-icons -- --out <path>');
    process.exit(1);
  }

  return { outDir: resolve(outDir), force };
}

async function main() {
  const { outDir, force } = parseArgs();
  const version = getVersion();

  console.log(`Scanning JSON files for icon IDs...`);
  const iconIds = collectIconIds();
  iconIds.delete(0); // 0 is a placeholder, not a real icon
  const sorted = [...iconIds].sort((a, b) => a - b);
  console.log(`Found ${sorted.length} unique icon IDs (range: ${sorted[0]}–${sorted[sorted.length - 1]})`);
  console.log(`CDN version: v${version}`);
  console.log(`Output: ${outDir}\n`);

  mkdirSync(outDir, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  let notFound = 0;
  let failed = 0;

  for (let i = 0; i < sorted.length; i++) {
    const id = sorted[i];
    const filename = `icon_${id}.png`;
    const dest = join(outDir, filename);

    if (!force && existsSync(dest)) {
      skipped++;
      continue;
    }

    const url = `${CDN_BASE}/v${version}/icons/${filename}`;
    try {
      const ok = await downloadWithRetry(url, dest);
      if (ok) {
        downloaded++;
      } else {
        notFound++;
      }
    } catch (err) {
      failed++;
      console.error(`  Failed: ${filename} — ${err instanceof Error ? err.message : err}`);
    }

    // Rate limiting
    await sleep(DELAY_BETWEEN_REQUESTS_MS);
    if ((i + 1) % BATCH_SIZE === 0) {
      const pct = Math.round(((i + 1) / sorted.length) * 100);
      process.stdout.write(`  Progress: ${i + 1}/${sorted.length} (${pct}%) — ${downloaded} downloaded, ${skipped} skipped\r`);
      await sleep(BATCH_PAUSE_MS);
    }
  }

  console.log(`\n\nDone.`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Skipped:    ${skipped} (already existed)`);
  console.log(`  Not found:  ${notFound} (404 on CDN)`);
  if (failed > 0) console.log(`  Failed:     ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
