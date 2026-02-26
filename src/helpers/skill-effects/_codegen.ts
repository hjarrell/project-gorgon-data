#!/usr/bin/env node
/**
 * Code generation script for per-skill effect configs.
 *
 * Usage:
 *   npx tsx src/helpers/skill-effects/_codegen.ts [skillName1] [skillName2] ...
 *
 * If no skill names are given, generates for ALL skills.
 * Output: writes draft .ts files to src/helpers/skill-effects/
 */

import * as fs from 'fs';
import * as path from 'path';

const RAW_PATH = path.resolve(__dirname, '../../data/raw/tsysclientinfo.json');
const RAW: Record<string, any> = JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8'));

const RE2 = /^\{([A-Z_0-9]+)\}\{(-?[\d.]+)\}$/;
const RE3 = /^\{([A-Z_0-9]+)\}\{(-?[\d.]+)\}\{(\w+)\}$/;

function stripIcons(text: string): string {
  return text.replace(/<icon=\d+>/g, '').trim();
}

function toTemplate(text: string): string {
  return stripIcons(text).replace(/-?\d+(\.\d+)?/g, '{N}');
}

function toVarName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '');
}

function toFileName(skill: string): string {
  // e.g. BattleChemistry -> battle-chemistry
  return skill
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// ── Heuristic classifiers ────────────────────────────

interface ClassifiedEffect {
  type: string;
  valuePattern: string; // regex source string
  extra: Record<string, any>;
}

function classifyEffect(text: string): ClassifiedEffect[] {
  const results: ClassifiedEffect[] = [];

  // DoT pattern: "deals +N DamageType damage over Ns"
  const dotMatch = text.match(/deals? \+?(\d+) (\w+) damage (?:to health )?over (\d+) seconds?/i);
  if (dotMatch) {
    results.push({
      type: 'dot',
      valuePattern: `deals? \\+?(\\d+) ${dotMatch[2]} damage`,
      extra: { damageType: dotMatch[2], duration: parseInt(dotMatch[3]) },
    });
  }

  // "ignites...dealing N DamageType damage over Ns"
  const igniteMatch = text.match(/ignites .+?dealing (\d+) (\w+) damage over (\d+) seconds?/i);
  if (igniteMatch) {
    results.push({
      type: 'dot',
      valuePattern: `dealing (\\d+) ${igniteMatch[2]} damage`,
      extra: { damageType: igniteMatch[2], duration: parseInt(igniteMatch[3]) },
    });
  }

  // Percent damage: "deals +N% damage" or "deal +N% damage" or "Damage +N%"
  const pctMatch = text.match(/deals? \+?(\d+)% damage/i) || text.match(/[Dd]amage \+(\d+)%/);
  if (pctMatch && results.length === 0) {
    results.push({
      type: 'percentDamage',
      valuePattern: pctMatch[0].includes('%') ? 'damage[^]*?\\+(\\d+)%' : 'deals? \\+?(\\d+)% damage',
      extra: {},
    });
  }

  // Flat damage: "deals +N damage" or "Damage +N" (not % and not armor)
  const flatMatch = text.match(/deals? \+?(\d+) damage(?! over)/i) || text.match(/[Dd]amage \+(\d+)(?!%)/);
  if (flatMatch && results.length === 0) {
    const isArmor = /armor damage/i.test(text);
    results.push({
      type: isArmor ? 'armorDamage' : 'flatDamage',
      valuePattern: isArmor ? 'deals? \\+?(\\d+) [Aa]rmor damage' : 'deals? \\+?(\\d+) damage',
      extra: {},
    });
  }

  // Power cost: "cost -N" or "Power Cost -N"
  const costMatch = text.match(/[Cc]ost -(\d+)/);
  if (costMatch) {
    results.push({
      type: 'costDelta',
      valuePattern: '[Cc]ost -(\\d+)',
      extra: {},
    });
  }

  // Cooldown: "Reuse Time is -N seconds" or "reuse timer...by N second"
  const cooldownMatch = text.match(/[Rr]euse [Tt]ime (?:is )?-(\d+) seconds?/i)
    || text.match(/reuse timer .+? by (\d+) seconds?/i);
  if (cooldownMatch) {
    results.push({
      type: 'cooldownDelta',
      valuePattern: cooldownMatch[0].includes('Reuse Time')
        ? '[Rr]euse [Tt]ime (?:is )?-(\\d+)'
        : 'by (\\d+) seconds?',
      extra: {},
    });
  }

  // Rage: "reduces N Rage" or "+N Rage" or "Rage -N"
  const rageMatch = text.match(/reduces? (\d+) (?:more )?Rage/i) || text.match(/(\d+) Rage/i);
  if (rageMatch && !results.some(r => r.type === 'rageDelta')) {
    results.push({
      type: 'rageDelta',
      valuePattern: rageMatch[0].includes('reduces')
        ? 'reduces? (\\d+) (?:more )?Rage'
        : '(\\d+) Rage',
      extra: {},
    });
  }

  // Restore: "restore N Resource" or "heals you for N health"
  const restoreMatch = text.match(/(?:restores?|heals? you for) (\d+) (\w+)/i);
  if (restoreMatch) {
    const resourceType = restoreMatch[2];
    results.push({
      type: 'restore',
      valuePattern: `(?:restores?|heals? you for) (\\d+) ${resourceType}`,
      extra: { resourceType },
    });
  }

  // Crit chance: "+N% chance" or "Critical Hit Chance +N%"
  const critChanceMatch = text.match(/[Cc]ritical [Hh]it [Cc]hance \+(\d+)%/);
  if (critChanceMatch) {
    results.push({
      type: 'critChanceDelta',
      valuePattern: '[Cc]ritical [Hh]it [Cc]hance \\+(\\d+)%',
      extra: {},
    });
  }

  // Crit damage: "Critical Hits deal +N% damage" or "+N% critical damage"
  const critDmgMatch = text.match(/[Cc]ritical [Hh]its? deal \+?(\d+)% damage/i)
    || text.match(/\+(\d+)% [Cc]ritical damage/i);
  if (critDmgMatch) {
    results.push({
      type: 'critDamageMod',
      valuePattern: critDmgMatch[0].includes('Critical Hits')
        ? '[Cc]ritical [Hh]its? deal \\+?(\\d+)% damage'
        : '\\+(\\d+)% [Cc]ritical damage',
      extra: {},
    });
  }

  // Taunt: "+N Taunt" or "Taunt +N"
  const tauntMatch = text.match(/[Tt]aunt \+(\d+)/);
  if (tauntMatch) {
    results.push({
      type: 'tauntDelta',
      valuePattern: '[Tt]aunt \\+(\\d+)',
      extra: {},
    });
  }

  // Range: "+N range"
  const rangeMatch = text.match(/\+(\d+) (?:meter )?range/i);
  if (rangeMatch) {
    results.push({
      type: 'rangeDelta',
      valuePattern: '\\+(\\d+) (?:meter )?range',
      extra: {},
    });
  }

  // AoE: "+N AoE" or "meters"
  const aoeMatch = text.match(/(?:within|targets within) (\d+) meters/i);
  if (aoeMatch) {
    results.push({
      type: 'aoeDelta',
      valuePattern: '(?:within|targets within) (\\d+) meters',
      extra: {},
    });
  }

  // If nothing matched, mark as todo
  if (results.length === 0) {
    results.push({
      type: 'todo',
      valuePattern: '',
      extra: {},
    });
  }

  return results;
}

function detectTarget(
  text: string,
  skill: string,
): { kind: 'abilities'; abilities: string[] }
  | { kind: 'skill'; skill: string; except?: string[] }
  | { kind: 'self' } {

  // "All SkillName abilities except X"
  const allExceptMatch = text.match(/^All (\w+) abilities? except (.+?) (?:have|deal|cost|restore)/i);
  if (allExceptMatch) {
    const excepts = allExceptMatch[2]
      .split(/(?:,\s*(?:and\s+)?|\s+and\s+)/)
      .map(s => s.trim())
      .filter(Boolean);
    return { kind: 'skill', skill: allExceptMatch[1], except: excepts };
  }

  // "All SkillName abilities/attacks"
  const allMatch = text.match(/^All (\w+) (?:abilities|attacks)/i);
  if (allMatch) {
    return { kind: 'skill', skill: allMatch[1] };
  }

  // Try to detect ability names at the start of text
  // Common patterns: "AbilityName deals", "AbilityName and AbilityName damage"
  const abilityPrefixMatch = text.match(/^(.+?)(?:\s+deals?\b|\s+[Dd]amage\b|\s+[Rr]euse\b|\s+heals?\b|\s+restores?\b|\s+ignites?\b|\s+has\b|\s+[Cc]ost\b|\s+boosts?\b)/);
  if (abilityPrefixMatch) {
    const names = abilityPrefixMatch[1]
      .split(/(?:,\s*(?:and\s+)?|\s+and\s+)/)
      .map(s => s.trim())
      .filter(Boolean);
    if (names.length > 0 && names.every(n => /^[A-Z]/.test(n))) {
      return { kind: 'abilities', abilities: names };
    }
  }

  return { kind: 'self' };
}

// ── Main ─────────────────────────────────────────────

function generateSkillConfig(skillName: string): string {
  const powers: { powerId: string; power: any }[] = [];

  for (const [powerId, power] of Object.entries(RAW)) {
    if (power.Skill !== skillName) continue;
    if (power.IsUnavailable) continue;

    // Check if any tier has text effects
    let hasText = false;
    for (const tier of Object.values(power.Tiers) as any[]) {
      for (const desc of tier.EffectDescs) {
        const clean = stripIcons(desc);
        if (!RE2.test(clean) && !RE3.test(clean)) {
          hasText = true;
          break;
        }
      }
      if (hasText) break;
    }
    if (hasText) powers.push({ powerId, power });
  }

  powers.sort((a, b) => a.power.InternalName.localeCompare(b.power.InternalName));

  const constName = skillName.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_EFFECTS';
  const lines: string[] = [];

  lines.push(`import type { PowerEffectConfig } from './types';`);
  lines.push('');
  lines.push(`export const ${constName}: PowerEffectConfig[] = [`);

  for (const { powerId, power } of powers) {
    const firstTier = Object.values(power.Tiers)[0] as any;
    if (!firstTier) continue;

    // Get text effect descs from first tier
    const textDescs: string[] = [];
    for (const desc of firstTier.EffectDescs) {
      const clean = stripIcons(desc);
      if (!RE2.test(clean) && !RE3.test(clean)) {
        textDescs.push(clean);
      }
    }
    if (textDescs.length === 0) continue;

    const primaryText = textDescs[0];
    const template = toTemplate(primaryText);
    const target = detectTarget(primaryText, skillName);
    const classified = classifyEffect(primaryText);

    // Also classify subsequent text descs (compound effects from multiple descs)
    for (let i = 1; i < textDescs.length; i++) {
      const extra = classifyEffect(textDescs[i]);
      classified.push(...extra);
    }

    // Deduplicate by type
    const seen = new Set<string>();
    const deduped = classified.filter(c => {
      if (seen.has(c.type)) return false;
      seen.add(c.type);
      return true;
    });

    // Build target string
    let targetStr: string;
    const esc = (s: string) => s.replace(/'/g, "\\'");
    if (target.kind === 'self') {
      targetStr = `'self'`;
    } else if (target.kind === 'skill') {
      if (target.except) {
        targetStr = `{ skill: '${esc(target.skill)}', except: [${target.except.map(e => `'${esc(e)}'`).join(', ')}] }`;
      } else {
        targetStr = `{ skill: '${esc(target.skill)}' }`;
      }
    } else {
      targetStr = `{ abilities: [${target.abilities.map(a => `'${esc(a)}'`).join(', ')}] }`;
    }

    // Build effects array
    const effectLines: string[] = [];
    for (const eff of deduped) {
      if (eff.type === 'todo') {
        effectLines.push(`      { type: 'todo', valuePattern: /(?:)/ },`);
        continue;
      }

      let extraParts = '';
      for (const [k, v] of Object.entries(eff.extra)) {
        if (typeof v === 'string') {
          extraParts += `, ${k}: '${v}'`;
        } else if (typeof v === 'number') {
          extraParts += `, ${k}: ${v}`;
        }
      }

      effectLines.push(`      { type: '${eff.type}', valuePattern: /${eff.valuePattern}/${extraParts} },`);
    }

    lines.push(`  // ${primaryText}`);
    lines.push(`  {`);
    lines.push(`    powerId: '${powerId}',`);
    lines.push(`    name: '${power.InternalName.replace(/'/g, "\\'")}',`);
    lines.push(`    target: ${targetStr},`);
    lines.push(`    effects: [`);
    lines.push(...effectLines);
    lines.push(`    ],`);
    lines.push(`    template: '${template.replace(/'/g, "\\'")}',`);
    lines.push(`  },`);
  }

  lines.push('];');
  lines.push('');

  return lines.join('\n');
}

// ── Entry Point ──────────────────────────────────────

const args = process.argv.slice(2);

// Get all unique skill names from the data
const allSkills = new Set<string>();
for (const power of Object.values(RAW) as any[]) {
  if (power.Skill && power.Skill !== 'AnySkill' && power.Skill !== 'Unknown') {
    allSkills.add(power.Skill);
  }
}

const skillsToGenerate = args.length > 0 ? args : [...allSkills].sort();

const outputDir = path.resolve(__dirname);

const forceOverwrite = process.argv.includes('--force');

for (const skill of skillsToGenerate) {
  if (!allSkills.has(skill)) {
    console.warn(`Warning: skill "${skill}" not found in data, skipping`);
    continue;
  }

  const content = generateSkillConfig(skill);
  const fileName = toFileName(skill) + '.ts';
  const filePath = path.join(outputDir, fileName);

  if (fs.existsSync(filePath) && !forceOverwrite) {
    console.log(`Skipped ${fileName} (already exists, use --force to overwrite)`);
    continue;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Generated ${fileName}`);
}

console.log(`Done! Generated configs for ${skillsToGenerate.length} skills.`);
