import { CLASSES, CLASS_SPECS } from './wow-constants';

const MAX_NAME_LENGTH = 24;
const MAX_PLAYERS = 40;
const MAX_IMPORT_LENGTH = 8192;

const CLASS_FILE_MAP = {
  WARRIOR: 'Warrior',
  PALADIN: 'Paladin',
  HUNTER: 'Hunter',
  ROGUE: 'Rogue',
  PRIEST: 'Priest',
  SHAMAN: 'Shaman',
  MAGE: 'Mage',
  WARLOCK: 'Warlock',
  DRUID: 'Druid',
};

const VALID_RARITIES = new Set(['poor', 'common', 'uncommon', 'rare', 'epic', 'legendary']);

function normalizeClassName(className) {
  if (!className) return 'Warrior';
  const trimmed = className.trim();
  if (CLASSES.includes(trimmed)) return trimmed;
  const mapped = CLASS_FILE_MAP[trimmed.toUpperCase()];
  if (mapped) return mapped;
  const titleCase = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  return CLASSES.includes(titleCase) ? titleCase : 'Warrior';
}

function normalizeSpec(className, spec) {
  const normalizedClass = normalizeClassName(className);
  const trimmed = (spec || 'None').trim();
  if (trimmed.startsWith('Role-')) return trimmed;
  const specs = CLASS_SPECS[normalizedClass] || [];
  if (specs.includes(trimmed)) return trimmed;
  return specs[0] || 'None';
}

function sanitizeName(name) {
  return (name || '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, MAX_NAME_LENGTH);
}

function parsePlayerEntry(entry) {
  const trimmed = entry.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(':');
  if (parts.length < 3) return null;

  const spec = parts.pop();
  const className = parts.pop();
  const name = sanitizeName(parts.join(':'));

  if (!name) return null;

  const normalizedClass = normalizeClassName(className);
  return {
    name,
    className: normalizedClass,
    spec: normalizeSpec(normalizedClass, spec),
  };
}

export function parseImportText(importText) {
  if (!importText || typeof importText !== 'string') return [];
  if (importText.length > MAX_IMPORT_LENGTH) return [];

  const players = importText
    .split('|')
    .map(parsePlayerEntry)
    .filter(Boolean)
    .slice(0, MAX_PLAYERS);

  const seen = new Set();
  return players.filter((player) => {
    const key = player.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function createPlayer({ name, className, spec, id, items }) {
  const normalizedClass = normalizeClassName(className);
  return {
    id: id || crypto.randomUUID(),
    name: sanitizeName(name),
    className: normalizedClass,
    spec: normalizeSpec(normalizedClass, spec),
    items: items || [],
  };
}

export function rarityClass(rarity) {
  const key = (rarity || 'common').toLowerCase();
  return VALID_RARITIES.has(key) ? key : 'common';
}

export { sanitizeName, normalizeClassName, normalizeSpec };
