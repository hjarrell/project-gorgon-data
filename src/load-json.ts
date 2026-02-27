import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadJSON<T = unknown>(relativePath: string): T {
  const fullPath = join(__dirname, relativePath);
  return JSON.parse(readFileSync(fullPath, 'utf-8'));
}
