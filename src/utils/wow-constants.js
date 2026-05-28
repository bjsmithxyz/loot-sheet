export const CLASS_COLORS = {
    Warrior: 'var(--color-warrior)',
    Paladin: 'var(--color-paladin)',
    Hunter: 'var(--color-hunter)',
    Rogue: 'var(--color-rogue)',
    Priest: 'var(--color-priest)',
    Shaman: 'var(--color-shaman)',
    Mage: 'var(--color-mage)',
    Warlock: 'var(--color-warlock)',
    Druid: 'var(--color-druid)'
};

export const ROLES = ['tank', 'healer', 'dps'];

export const CLASSES = Object.keys(CLASS_COLORS);

export const TOKEN_CLASSES = {
    'Defender': ['Warrior', 'Priest', 'Druid'],
    'Champion': ['Paladin', 'Rogue', 'Shaman'],
    'Hero': ['Hunter', 'Mage', 'Warlock']
};

export const getTokenClasses = (itemName) => {
    if (!itemName) return null;
    if (itemName.includes('Defender')) return TOKEN_CLASSES['Defender'];
    if (itemName.includes('Champion')) return TOKEN_CLASSES['Champion'];
    if (itemName.includes('Hero')) return TOKEN_CLASSES['Hero'];
    return null;
};
