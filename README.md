# Loot Sheet

A visual loot tracking sheet for World of Warcraft: The Burning Crusade Classic. Built for loot councils and guild masters to track assignments, manage rosters, and export results to a spreadsheet.

## Features

- **Visual Loot Assignment**: Click-to-assign interface with Wowhead item icons
- **Raid Support**: Kara, Gruul, Mag, SSC, and TK
- **Boss Loot Tables**: Built-in loot data for all implemented bosses
- **Player Management**:
  - Import rosters via addon export string
  - Manual player addition, editing, and deletion
  - Class and spec tracking with role identification
- **Rich Tooltips**: Item stats, weapon damage, and class token indicators
- **Spreadsheet Export**: Tab-separated export with class-coloured player cells

## Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS (glassmorphism), Lucide React
- **Animations**: Framer Motion
- **Data**: JSON loot and raid definitions, Wowhead icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/bjsmithxyz/loot-sheet.git
cd loot-sheet
npm install
```

### Running the App

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Deploy

```bash
npm run deploy
```

GitHub Pages deploys to `/loot-sheet/`.

## Project Structure

```
.
├── docs/           # Documentation
├── scripts/        # Loot data enrichment scripts
├── addon/          # WoW addon for roster export
└── src/
    ├── components/
    ├── data/       # loot.json, raids.json
    ├── utils/
    └── App.jsx
```

## Import Format

Pipe-separated player list:

`Name:Class:Spec|Name:Class:Spec`

Example:

`Tanky:Warrior:Protection|Healy:Priest:Holy|Dpser:Mage:Fire`

## Credits

Built for the TBC Classic community.
