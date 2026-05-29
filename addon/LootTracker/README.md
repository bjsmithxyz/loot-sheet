# Loot Sheet Export — Install & Troubleshooting

For **TBC Anniversary** (client **2.5.5.x**, Interface **20505**).

## Correct install path

Copy the **`LootTracker`** folder (this folder) into:

```
World of Warcraft/_anniversary_/Interface/AddOns/LootTracker/
```

Final layout **must** look exactly like this:

```
_anniversary_/Interface/AddOns/LootTracker/
├── LootTracker.toc
├── LootTracker_TBC.toc
└── LootTracker.lua
```

The folder name **`LootTracker`** must match the `.toc` filenames. WoW will not detect the addon if names differ.

### Common mistakes

| Problem | Fix |
|---------|-----|
| Installed under `_classic_` or `_classic_era_` | Use **`_anniversary_`** only for TBC Anniversary |
| Double-nested folder (`AddOns/addon/LootTracker/`) | Copy **`LootTracker`**, not the parent `addon` folder |
| GitHub ZIP extracted as `loot-sheet-main/addon/LootTracker/` | Copy only the inner **`LootTracker`** folder |
| Wrong folder name (`LootTracker-main`, `loot-sheet`) | Rename to **`LootTracker`** |
| `Interface` or `AddOns` missing | Create them under `_anniversary_/` (capital **A**, capital **O**) |

## Enable the addon

1. Fully **exit** WoW (not just `/reload`) after copying files.
2. On the **character select** screen, click **AddOns** (bottom-left).
3. Find **Loot Sheet Export** and ensure it is checked.
4. If it shows **Out of Date**, enable **Load out of date AddOns**.

## Verify your client

On a character, run in chat:

```
/dump (select(4, GetBuildInfo()))
```

You should see **`20505`**. The addon `.toc` files target that Interface version.

Also confirm game version:

```
/dump GetBuildInfo()
```

Expect **`2.5.5.67511`** (or similar 2.5.5 patch).

## Test in game

```
/lt
```

or

```
/lootsheet
```

A window titled **Loot Sheet Export** should open with your roster string.

If nothing happens, enable Lua errors:

```
/console scriptErrors 1
/reload
```

Then type `/lt` again and note any error message.

## Linux / Wine / Proton

Battle.net on Linux usually installs under Wine. Typical path:

```
~/.wine/drive_c/Program Files (x86)/World of Warcraft/_anniversary_/Interface/AddOns/
```

Use **Show in Explorer** (or equivalent) from the Battle.net WoW **Options** cog to open the correct install folder.
