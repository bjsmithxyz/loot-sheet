/**
 * Fetches boss loot from mmo4ever drop lists and Wowhead tooltips,
 * then writes src/data/loot.json entries for the requested bosses.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOOT_PATH = path.join(__dirname, '../src/data/loot.json');

const BOSS_NPCS = {
  attumen: [15550],
  moroes: [15687],
  maiden: [16457],
  opera: [17521, 18168, 17533, 17534],
  curator: [15691],
  illhoof: [15688],
  shade: [16524],
  netherspite: [15689],
  prince: [15690],
  nightbane: [17225],
  maulgar: [18831],
  gruul: [19044],
  magtheridon: [17257],
  hydross: [21216],
  lurker: [21217],
  leotheras: [21215],
  karathress: [21213],
  morogrim: [21214],
  vashj: [21212],
  alar: [19514],
  voidreaver: [19516],
  solarian: [18805],
  kaelthas: [19622],
};

const EXCLUDED_ITEM_IDS = new Set([
  29434, // Badge of Justice
]);

const EXCLUDED_NAME_PREFIXES = [
  'Pattern:',
  'Plans:',
  'Formula:',
  'Design:',
  'Schematic:',
];

const QUALITY_MAP = {
  0: 'Poor',
  1: 'Common',
  2: 'Uncommon',
  3: 'Rare',
  4: 'Epic',
  5: 'Legendary',
};

const SLOT_TYPE = {
  1: 'Head',
  2: 'Neck',
  3: 'Shoulder',
  4: 'Shirt',
  5: 'Chest',
  6: 'Waist',
  7: 'Legs',
  8: 'Feet',
  9: 'Wrist',
  10: 'Hands',
  11: 'Finger',
  12: 'Trinket',
  13: 'One-Hand',
  14: 'Shield',
  15: 'Ranged',
  16: 'Back',
  17: 'Two-Hand',
  20: 'Robe',
  21: 'Main Hand',
  22: 'Off Hand',
  23: 'Held In Off-hand',
  25: 'Thrown',
  26: 'Ranged',
  28: 'Relic',
};

const SUBCLASS = {
  0: { 0: 'Miscellaneous', 1: 'Cloth', 2: 'Leather', 3: 'Mail', 4: 'Plate', 5: 'Bucklers', 6: 'Shields', 7: 'Librams', 8: 'Idols', 9: 'Totems', 10: 'Sigils' },
  2: { 0: 'One-Handed Axes', 1: 'Two-Handed Axes', 2: 'Bows', 3: 'Guns', 4: 'One-Handed Maces', 5: 'Two-Handed Maces', 6: 'Polearms', 7: 'One-Handed Swords', 8: 'Two-Handed Swords', 9: 'Obsolete', 10: 'Staves', 13: 'Fist Weapons', 15: 'Daggers', 16: 'Thrown', 18: 'Crossbows', 19: 'Wands', 20: 'Fishing Poles' },
  4: { 0: 'Miscellaneous', 1: 'Cloth', 2: 'Leather', 3: 'Mail', 4: 'Plate', 5: 'Mail', 6: 'Shield', 7: 'Libram', 8: 'Idol', 9: 'Totem', 10: 'Sigil' },
};

const SLOT_TYPE_VALUES = new Set(Object.values(SLOT_TYPE));
const ARMOR_TYPE_VALUES = new Set(['Cloth', 'Leather', 'Mail', 'Plate', 'Miscellaneous', 'Shield', 'Libram', 'Idol', 'Totem', 'Sigil']);

function acronym(name) {
  const skip = new Set(['of', 'the', 'a', 'an', 'and', 'for', 'in', 'on', 'to']);
  return name
    .split(/\s+/)
    .filter((word) => word && !skip.has(word.toLowerCase()))
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<\/th>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim();
}

function extractWeaponFields(tooltip) {
  const handMatch = tooltip.match(/<tr><td>(One-Hand|Two-Hand|Main Hand|Off Hand|Ranged|Held In Off-hand|Thrown)<\/td>/);
  const typeMatch = tooltip.match(/<!--scstart(?:2|4):\d+-->[\s\S]*?<span class="q1">([^<]+)<\/span>/);
  const damageMatch = tooltip.match(/<!--dmg-->([^<]+)/);
  const speedMatch = tooltip.match(/Speed <!--spd-->([\d.]+)/);
  const dpsMatch = tooltip.match(/<!--dps-->\(([^)]+)\)/);

  if (!handMatch && !damageMatch) return null;

  const weaponType = typeMatch?.[1]?.trim() || null;
  const isShield = weaponType === 'Shield';
  const isWeapon = Boolean(damageMatch) || isShield;
  if (!isWeapon) return null;

  const fields = {};
  if (handMatch) fields.hand = handMatch[1];
  if (weaponType) fields.weaponType = weaponType;
  if (damageMatch) fields.damage = damageMatch[1].trim();
  if (speedMatch) fields.speed = parseFloat(speedMatch[1]);
  if (dpsMatch) fields.dps = dpsMatch[1].trim();
  return fields;
}

function parseTooltip(tooltip, quality, name) {
  const weaponFields = extractWeaponFields(tooltip);
  const text = stripTags(tooltip);
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const item = {
    name,
    rarity: QUALITY_MAP[quality] ?? 'Epic',
    ilevel: null,
    stats: [],
    equip: '',
    use: null,
    flavor: null,
    acronym: acronym(name),
    req: null,
  };

  if (weaponFields) Object.assign(item, weaponFields);

  const equipParts = [];
  let inFlavor = false;

  for (const line of lines) {
    if (line === name || line.startsWith(name)) continue;
    if (/^Phase \d+$/.test(line)) continue;
    if (line.startsWith('Item Level')) {
      item.ilevel = parseInt(line.replace('Item Level', '').trim(), 10);
      continue;
    }
    if (line.startsWith('Requires Level')) {
      item.req = parseInt(line.replace('Requires Level', '').trim(), 10);
      continue;
    }
    if (line.startsWith('Requires ')) continue;
    if (line.startsWith('Binds when')) continue;
    if (SLOT_TYPE_VALUES.has(line)) continue;
    if (ARMOR_TYPE_VALUES.has(line)) continue;
    if (line.startsWith('Quest Item')) continue;
    if (line.startsWith('Unique')) continue;
    if (line.startsWith('Durability')) continue;
    if (line.startsWith('Sell Price')) continue;
    if (line.startsWith('Dropped by')) continue;
    if (line.startsWith('Drop Chance')) continue;
    if (line.startsWith('Socket Bonus')) continue;
    if (/Socket$/.test(line)) continue;
    if (line.startsWith('Equip:')) {
      equipParts.push(line.replace(/^Equip:\s*/, ''));
      continue;
    }
    if (line.startsWith('Use:')) {
      item.use = line.replace(/^Use:\s*/, '');
      continue;
    }
    if (line.startsWith('"') || inFlavor) {
      item.flavor = line.replace(/^"|"$/g, '');
      inFlavor = true;
      continue;
    }
    if (line.endsWith('Armor') || line.endsWith('Block')) {
      item.stats.push(line);
      continue;
    }
    if (line.startsWith('+') || line.startsWith('-')) {
      item.stats.push(line);
      continue;
    }
    if (line.startsWith('Improves ') || line.startsWith('Increases ')) {
      equipParts.push(line);
      continue;
    }
  }

  item.equip = equipParts.join(' ');
  return item;
}

async function fetchItemIds(npcId) {
  const res = await fetch(`https://mmo4ever.com/wow/creature.php?id=${npcId}`);
  const html = await res.text();
  const ids = [...html.matchAll(/item\.php\?id=(\d+)/g)].map((m) => parseInt(m[1], 10));
  return [...new Set(ids)];
}

async function fetchItem(itemId) {
  const res = await fetch(`https://nether.wowhead.com/tooltip/item/${itemId}?dataEnv=8&locale=0`);
  if (!res.ok) throw new Error(`Wowhead ${itemId}: ${res.status}`);
  const data = await res.json();
  const item = { id: itemId, ...parseTooltip(data.tooltip, data.quality, data.name) };
  if (data.icon) item.icon = data.icon;
  return item;
}

function shouldInclude(item) {
  if (EXCLUDED_ITEM_IDS.has(item.id)) return false;
  if (EXCLUDED_NAME_PREFIXES.some((p) => item.name.startsWith(p))) return false;
  if (item.bind?.includes('Quest Item')) return false;
  if (item.rarity === 'Poor') return false;
  if (item.name === "Medivh's Journal") return false;
  if (item.name === 'Earthen Signet') return false;
  if (item.name === 'Nether Vortex' && item.rarity === 'Rare') return false;
  return true;
}

async function generateBossLoot(bossId) {
  const npcIds = BOSS_NPCS[bossId];
  if (!npcIds?.length) return null;

  const itemIds = new Set();
  for (const npcId of npcIds) {
    const ids = await fetchItemIds(npcId);
    ids.forEach((id) => itemIds.add(id));
  }

  const items = [];
  for (const id of [...itemIds].sort((a, b) => a - b)) {
    try {
      const item = await fetchItem(id);
      if (shouldInclude(item)) items.push(item);
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      console.warn(`  skip ${id}: ${err.message}`);
    }
  }

  return items;
}

async function main() {
  const bosses = process.argv.slice(2);
  const targetBosses = bosses.length ? bosses : Object.keys(BOSS_NPCS);
  const existing = JSON.parse(fs.readFileSync(LOOT_PATH, 'utf8'));
  const output = { ...existing };

  if (output.aran && !output.shade) {
    output.shade = output.aran;
    delete output.aran;
  }

  for (const bossId of targetBosses) {
    if (!BOSS_NPCS[bossId]) {
      console.warn(`Unknown boss: ${bossId}`);
      continue;
    }
    console.log(`Generating ${bossId}...`);
    const items = await generateBossLoot(bossId);
    if (items) {
      output[bossId] = items;
      console.log(`  ${items.length} items`);
    }
  }

  fs.writeFileSync(LOOT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${LOOT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
