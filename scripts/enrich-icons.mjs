/**
 * Adds Wowhead icon slugs to all items in loot.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const LOOT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/loot.json');

async function fetchIcon(itemId) {
  const res = await fetch(`https://nether.wowhead.com/tooltip/item/${itemId}?dataEnv=8&locale=0`);
  if (!res.ok) throw new Error(`Wowhead ${itemId}: ${res.status}`);
  const data = await res.json();
  return data.icon || null;
}

async function main() {
  const loot = JSON.parse(fs.readFileSync(LOOT_PATH, 'utf8'));
  const itemIds = new Set();
  for (const items of Object.values(loot)) {
    for (const item of items) itemIds.add(item.id);
  }

  const icons = new Map();
  for (const id of [...itemIds].sort((a, b) => a - b)) {
    try {
      icons.set(id, await fetchIcon(id));
      await new Promise((r) => setTimeout(r, 100));
    } catch (err) {
      console.warn(`skip ${id}: ${err.message}`);
    }
  }

  for (const items of Object.values(loot)) {
    for (const item of items) {
      const icon = icons.get(item.id);
      if (icon) item.icon = icon;
      else delete item.icon;
    }
  }

  fs.writeFileSync(LOOT_PATH, `${JSON.stringify(loot, null, 2)}\n`);
  console.log(`Added icons for ${icons.size} items`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
