/**
 * Removes phase and enriches weapon/shield items with hand, damage, and DPS from Wowhead.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const LOOT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/loot.json');
const WEAPON_HANDS = new Set(['One-Hand', 'Two-Hand', 'Main Hand', 'Off Hand', 'Ranged', 'Held In Off-hand']);

function parseWeaponFields(tooltip) {
  const handMatch = tooltip.match(/<tr><td>(One-Hand|Two-Hand|Main Hand|Off Hand|Ranged|Held In Off-hand|Thrown)<\/td>/);
  const typeMatch = tooltip.match(/<!--scstart(?:2|4):\d+-->[\s\S]*?<span class="q1">([^<]+)<\/span>/);
  const damageMatch = tooltip.match(/<!--dmg-->([^<]+)/);
  const speedMatch = tooltip.match(/Speed <!--spd-->([\d.]+)/);
  const dpsMatch = tooltip.match(/<!--dps-->\(([^)]+)\)/);

  if (!handMatch && !damageMatch) return null;

  const hand = handMatch?.[1] ?? null;
  const weaponType = typeMatch?.[1]?.trim() || null;
  const isShield = weaponType === 'Shield';
  const isWeapon = Boolean(damageMatch) || isShield;

  if (!isWeapon) return null;

  const fields = {};
  if (hand) fields.hand = hand;
  if (weaponType) fields.weaponType = weaponType;
  if (damageMatch) fields.damage = damageMatch[1].trim();
  if (speedMatch) fields.speed = parseFloat(speedMatch[1]);
  if (dpsMatch) fields.dps = dpsMatch[1].trim();

  return fields;
}

async function fetchWeaponFields(itemId) {
  const res = await fetch(`https://nether.wowhead.com/tooltip/item/${itemId}?dataEnv=8&locale=0`);
  if (!res.ok) throw new Error(`Wowhead ${itemId}: ${res.status}`);
  const data = await res.json();
  return parseWeaponFields(data.tooltip);
}

async function main() {
  const loot = JSON.parse(fs.readFileSync(LOOT_PATH, 'utf8'));
  const itemIds = new Set();
  for (const items of Object.values(loot)) {
    for (const item of items) itemIds.add(item.id);
  }

  const weaponData = new Map();
  for (const id of [...itemIds].sort((a, b) => a - b)) {
    try {
      const fields = await fetchWeaponFields(id);
      if (fields) weaponData.set(id, fields);
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      console.warn(`skip ${id}: ${err.message}`);
    }
  }

  let weaponCount = 0;
  for (const items of Object.values(loot)) {
    for (const item of items) {
      delete item.phase;

      const fields = weaponData.get(item.id);
      if (!fields) {
        delete item.hand;
        delete item.weaponType;
        delete item.damage;
        delete item.speed;
        delete item.dps;
        continue;
      }

      Object.assign(item, fields);
      weaponCount++;
    }
  }

  fs.writeFileSync(LOOT_PATH, `${JSON.stringify(loot, null, 2)}\n`);
  console.log(`Enriched ${weaponData.size} weapon/shield types across ${weaponCount} loot entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
