# Loot Sheet

A visual loot tracking sheet for World of Warcraft: The Burning Crusade Classic Anniversary. Built for loot councils to track assignments, manage rosters, and export results to a spreadsheet.

**Live app:** [https://bjsmithxyz.github.io/loot-sheet/](https://bjsmithxyz.github.io/loot-sheet/)

## Features

- **Visual loot assignment** — click **+** on a player row to assign boss or trash loot with Wowhead item icons
- **Raid support** — Kara, Gruul, Mag, SSC, and TK (Hyjal, BT, SWP shown as coming soon)
- **Boss & trash loot tables** — curated TBC loot data with rich item tooltips
- **Player management**
  - Import rosters from the in-game addon export string
  - Add, edit, and delete players manually
  - Class colours on player names; optional tank / healer / DPS role
- **Light & dark mode** — toggle in the header (sun / moon icon)
- **Spreadsheet export** — tab-separated text plus HTML clipboard with class-coloured player cells

## In-Game Addon

The **Loot Sheet Export** addon copies your party or raid roster from WoW into a string you paste into the web app.

### Download

1. Clone or download this repository.
2. The addon lives in [`addon/LootTracker/`](addon/LootTracker/).

Alternatively, copy only the `LootTracker` folder from the repo.

### Install (TBC Anniversary)

1. Locate your WoW install folder (Battle.net → WoW → Options cog → **Show in Explorer** / **Reveal in Finder**).
2. Open the **`_anniversary_`** folder (not `_classic_` or `_classic_era_`).
3. Copy the **`LootTracker`** folder from [`addon/LootTracker/`](addon/LootTracker/) into:

   ```
   World of Warcraft/_anniversary_/Interface/AddOns/LootTracker/
   ```

   The folder must contain `LootTracker.toc`, `LootTracker_TBC.toc`, and `LootTracker.lua`.

   **Do not** copy the parent `addon` folder — that creates a double-nested path WoW will ignore.

4. Restart WoW completely (quit to desktop, not just `/reload`).
5. On the character select screen, click **AddOns** and ensure **Loot Sheet Export** is enabled. Turn on **Load out of date AddOns** if needed.

See [`addon/LootTracker/README.md`](addon/LootTracker/README.md) for troubleshooting if the addon does not appear.

**Client:** TBC Anniversary **2.5.5.x** (Interface **20505**).

### Use in game

1. Join a party or raid (or stand solo to export yourself).
2. Type **`/lt`** or **`/lootsheet`**.
3. Copy the export string from the popup.
4. In Loot Sheet, click **Import** and paste the string.

The addon exports `Name:Class` entries separated by `|`. Class is detected automatically; spec is not included.

## Web App — Getting Started

### Prerequisites

- Node.js 16+ (18+ recommended)
- npm

### Install & run locally

```bash
git clone https://github.com/bjsmithxyz/loot-sheet.git
cd loot-sheet
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Deploy to GitHub Pages

```bash
npm run deploy
```

The app is published under `/loot-sheet/`.

## Import Format

Pipe-separated player list:

```
Name:Class|Name:Class|Name:Class
```

Example:

```
Tanky:Warrior|Healy:Priest|Mmchunt:Hunter|Firemage:Mage
```

Legacy three-part strings (`Name:Class:Spec`) still import; the spec field is ignored.

## Project Structure

```
.
├── addon/LootTracker/   # WoW addon (/lt roster export)
├── docs/                # Design notes
├── scripts/             # Loot data generation & enrichment
└── src/
    ├── components/      # UI components
    ├── data/            # loot.json, raids.json
    ├── utils/           # Import/export, icons, theme
    └── App.jsx
```

## Data Scripts

```bash
npm run generate:trash   # Regenerate trash loot tables from Wowhead
```

Boss loot can be regenerated with `node scripts/generate-loot.mjs <boss-id>`.

## Credits

Built for **GT**.
