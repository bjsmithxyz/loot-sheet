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

export const CLASS_SPECS = {
    Warrior: ['Arms', 'Fury', 'Protection'],
    Paladin: ['Holy', 'Protection', 'Retribution'],
    Hunter: ['Beast Mastery', 'Marksmanship', 'Survival'],
    Rogue: ['Assassination', 'Combat', 'Subtlety'],
    Priest: ['Discipline', 'Holy', 'Shadow'],
    Shaman: ['Elemental', 'Enhancement', 'Restoration'],
    Mage: ['Arcane', 'Fire', 'Frost'],
    Warlock: ['Affliction', 'Demonology', 'Destruction'],
    Druid: ['Balance', 'Feral', 'Restoration']
};

export const SPEC_TO_ROLE = {
    'Protection': 'tank',
    'Holy': 'healer',
    'Restoration': 'healer',
    'Discipline': 'healer',
    'Feral': 'tank',
    'Guardian': 'tank',
    'Restoration Shaman': 'healer',
    'Restoration Druid': 'healer',
    'Holy Paladin': 'healer'
};

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
