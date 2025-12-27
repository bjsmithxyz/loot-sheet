# TBC Loot Tracker

A modern, visual loot tracking application for World of Warcraft: The Burning Crusade Classic. This tool helps Loot Councils and Guild Masters track loot distribution, visualise assignments, and manage raid rosters efficiently.

## Features

-   **Visual Loot Assignment**: Drag-and-drop or click-to-assign interface (currently click-based).
-   **Raid Support**: Currently supports **Karazhan**, with expandable architecture for Gruul, Magtheridon, SSC, and TK.
-   **Boss Loot Tables**: Built-in loot data for all implemented bosses.
-   **Player Management**:
    -   Import rosters via string (compatible with common addon export formats).
    -   Manual player addition and editing.
    -   Class and Spec tracking with role identification.
-   **Rich Tooltips**: Detailed item tooltips including stats, requirements, and class restrictions.
-   **Responsive Design**: Glassmorphic UI with smooth animations powered by Framer Motion.

## Technology Stack

-   **Frontend**: React 18, Vite
-   **Styling**: Vanilla CSS (Variables, Glassmorphism), Lucide React (Icons)
-   **Animations**: Framer Motion
-   **Data**: JSON-based loot and raid definitions

## Getting Started

### Prerequisites

-   Node.js (v16 or higher recommended)
-   npm or yarn

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:
```bash
npm run dev
```
Open your browser to the URL shown (usually `http://localhost:5173`).

## Project Structure

```
.
├── docs/           # Documentation and Design Documents
└── src/
    ├── components/ # Reusable UI components (LootPopUp, PlayerRow, etc.)
    ├── data/       # Static data files (loot.json, raids.json)
    ├── utils/      # Helper functions and constants (wow-constants.js)
    ├── App.jsx     # Main application controller
    └── index.css   # Global styles and variables
```

## Documentation

For a detailed overview of the component architecture and data flow, please refer to the [Technical Design Document](docs/technical_design.md).

## Import Format

The import feature accepts a pipe-separated list of players in the format:
`Name:Class:Spec|Name:Class:Spec`

Example:
`Tanky:Warrior:Protection|Healy:Priest:Holy|Dpser:Mage:Fire`

## Future Plans

-   Persist data to local storage or backend.
-   Add more raids (T5/T6 content).
-   Drag and drop loot assignment.
-   Export loot history.

## Credits

Built for the TBC Classic community.
