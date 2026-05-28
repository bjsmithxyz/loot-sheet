export const CLASS_EXPORT_COLORS = {
    Warrior: '#C79C6E',
    Paladin: '#F58CBA',
    Hunter: '#ABD473',
    Rogue: '#FFF569',
    Priest: '#DADADA',
    Shaman: '#0070DE',
    Mage: '#69CCF0',
    Warlock: '#9482C9',
    Druid: '#FF7D0A',
};

const LIGHT_TEXT_CLASSES = new Set(['Shaman', 'Warlock']);

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatExportDate(date) {
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function playerCellStyle(className) {
    const background = CLASS_EXPORT_COLORS[className] || '#888888';
    const color = LIGHT_TEXT_CLASSES.has(className) ? '#FFFFFF' : '#1A1A1A';
    return `background-color:${background};color:${color};font-weight:700;`;
}

export function formatPlayersForSpreadsheet(players, raidName = '', exportDate = new Date()) {
    const maxItems = Math.max(0, ...players.map((player) => player.items.length));
    const dateLabel = formatExportDate(exportDate);
    const metaCells = [`Raid: ${raidName}`, `Exported: ${dateLabel}`];
    const plainRows = players.map((player) => {
        const cells = [player.name, ...player.items.map((item) => item.name)];
        while (cells.length < maxItems + 1) cells.push('');
        return cells.join('\t');
    });

    const plain = [
        metaCells.join('\t'),
        '---',
        ...plainRows,
    ].join('\n');

    const htmlRows = [
        `<tr><td>${escapeHtml(metaCells[0])}</td><td>${escapeHtml(metaCells[1])}</td></tr>`,
        `<tr><td colspan="${Math.max(maxItems + 1, 2)}">---</td></tr>`,
        ...players.map((player) => {
            const itemCells = player.items.map((item) => `<td>${escapeHtml(item.name)}</td>`);
            const emptyCells = Array.from({ length: maxItems - player.items.length }, () => '<td></td>');
            return `<tr><td style="${playerCellStyle(player.className)}">${escapeHtml(player.name)}</td>${itemCells.join('')}${emptyCells.join('')}</tr>`;
        }),
    ].join('');

    const html = `<table>${htmlRows}</table>`;

    return { plain, html, dateLabel };
}
