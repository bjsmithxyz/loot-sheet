/**
 * Fetches curated trash loot tables from Wowhead and writes them to loot.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOOT_PATH = path.join(__dirname, '../src/data/loot.json');

const TRASH_ITEM_IDS = {
  'karazhan-trash': [
    30668, // Grasp of the Dead
    30673, // Inferno Waist Cord
    30644, // Grips of Deftness
    30674, // Zierhut's Lost Treads
    30643, // Belt of the Tracker
    30641, // Boots of Elusion
    30642, // Drape of the Righteous
    30667, // Ring of Unrelenting Storms
    30666, // Ritssyn's Lost Pendant
  ],
  'ssc-trash': [
    30620, // Spyglass of the Hidden Fleet
    30022, // Pendant of the Perilous
    30023, // Totem of the Maelstrom
    30027, // Boots of Courage Unending
    30021, // Wildfury Greatstaff
    30025, // Serpentshrine Shuriken
  ],
  'tk-trash': [
    30030, // Girdle of Fallen Stars
    30024, // Mantle of the Elven Kings
    30026, // Bands of the Celestial Archer
    30028, // Seventh Ring of the Tirisfalen
    30029, // Bark-Gloves of Ancient Wisdom
  ],
};

const QUALITY_MAP = {
  0: 'Poor',
  1: 'Common',
  2: 'Uncommon',
  3: 'Rare',
  4: 'Epic',
  5: 'Legendary',
};

const SLOT_TYPE = {
  1: 'Head', 2: 'Neck', 3: 'Shoulder', 4: 'Shirt', 5: 'Chest', 6: 'Waist', 7: 'Legs',
  8: 'Feet', 9: 'Wrist', 10: 'Hands', 11: 'Finger', 12: 'Trinket', 13: 'One-Hand',
  14: 'Shield', 15: 'Ranged', 16: 'Back', 17: 'Two-Hand', 20: 'Robe', 21: 'Main Hand',
  22: 'Off Hand', 23: 'Held In Off-hand', 25: 'Thrown', 26: 'Ranged', 28: 'Relic',
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
    isQuestItem: false,
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
    if (line.startsWith('Requires Level')) continue;
    if (line.startsWith('Requires ')) continue;
    if (line.startsWith('Binds when')) continue;
    if (SLOT_TYPE_VALUES.has(line)) continue;
    if (ARMOR_TYPE_VALUES.has(line)) continue;
    if (line.startsWith('Quest Item')) {
      item.isQuestItem = true;
      continue;
    }
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
      item.stats.push(line.replace(/Requires Level \d+/gi, '').trim());
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

async function fetchItem(itemId) {
  const res = await fetch(`https://nether.wowhead.com/tooltip/item/${itemId}?dataEnv=8&locale=0`);
  if (!res.ok) throw new Error(`Wowhead ${itemId}: ${res.status}`);
  const data = await res.json();
  const item = { id: itemId, ...parseTooltip(data.tooltip, data.quality, data.name) };
  if (data.icon) item.icon = data.icon;
  return item;
}

async function generateTrashTable(tableId, itemIds) {
  const items = [];
  for (const id of itemIds) {
    const item = await fetchItem(id);
    items.push(item);
    await new Promise((r) => setTimeout(r, 120));
  }
  return items;
}

async function main() {
  const loot = JSON.parse(fs.readFileSync(LOOT_PATH, 'utf8'));

  for (const [tableId, itemIds] of Object.entries(TRASH_ITEM_IDS)) {
    console.log(`Generating ${tableId}...`);
    loot[tableId] = await generateTrashTable(tableId, itemIds);
    console.log(`  ${loot[tableId].length} items`);
  }

  fs.writeFileSync(LOOT_PATH, `${JSON.stringify(loot, null, 2)}\n`);
  console.log(`Wrote ${LOOT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
