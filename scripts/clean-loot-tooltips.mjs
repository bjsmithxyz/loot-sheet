/**
 * Cleans loot.json tooltip fields.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const LOOT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/loot.json');
const ARMOR_TYPES = new Set(['Cloth', 'Leather', 'Mail', 'Plate']);
const SLOT_NAMES = new Set([
  'Head', 'Neck', 'Shoulder', 'Shirt', 'Chest', 'Waist', 'Legs', 'Feet', 'Wrist', 'Hands',
  'Finger', 'Trinket', 'One-Hand', 'Shield', 'Ranged', 'Back', 'Two-Hand', 'Robe',
  'Main Hand', 'Off Hand', 'Held In Off-hand', 'Thrown', 'Relic', 'Crossbow', 'Gun', 'Bow',
  'Wand', 'Dagger', 'Staff', 'Polearm', 'Axe', 'Sword', 'Mace',
]);

function cleanItem(item) {
  delete item.phase;
  delete item.bind;
  delete item.type;

  if (item.stats) {
    item.stats = item.stats.filter((stat) => {
      if (ARMOR_TYPES.has(stat)) return false;
      if (SLOT_NAMES.has(stat)) return false;
      if (stat.startsWith('Binds when')) return false;
      if (stat === item.name) return false;
      if (stat.startsWith(item.name)) return false;
      return true;
    });
  }

  return item;
}

const loot = JSON.parse(fs.readFileSync(LOOT_PATH, 'utf8'));
for (const items of Object.values(loot)) {
  items.forEach(cleanItem);
}

fs.writeFileSync(LOOT_PATH, `${JSON.stringify(loot, null, 2)}\n`);
console.log('Cleaned loot.json');
