-- LootTracker.lua — export roster for Loot Sheet (TBC Classic)

local CLASS_MAP = {
    WARRIOR = "Warrior",
    PALADIN = "Paladin",
    HUNTER = "Hunter",
    ROGUE = "Rogue",
    PRIEST = "Priest",
    SHAMAN = "Shaman",
    MAGE = "Mage",
    WARLOCK = "Warlock",
    DRUID = "Druid",
}

local function NormalizeClass(classToken)
    if CLASS_MAP[classToken] then
        return CLASS_MAP[classToken]
    end
    if classToken and classToken:len() > 0 then
        return classToken:sub(1, 1):upper() .. classToken:sub(2):lower()
    end
    return "Warrior"
end

local function StripRealm(name)
    if not name then
        return name
    end
    return name:match("^([^%-]+)") or name
end

local function AppendPlayer(players, name, classFile)
    if not name or name == "" then
        return
    end
    table.insert(
        players,
        string.format("%s:%s", StripRealm(name), NormalizeClass(classFile))
    )
end

local function GenerateExport()
    local players = {}

    if IsInRaid() then
        for i = 1, 40 do
            local name, _, _, _, _, fileName = GetRaidRosterInfo(i)
            if name and fileName then
                AppendPlayer(players, name, fileName)
            end
        end
    elseif IsInGroup() then
        local _, playerClass = UnitClass("player")
        AppendPlayer(players, UnitName("player"), playerClass)

        for i = 1, 4 do
            local unit = "party" .. i
            if UnitExists(unit) then
                local _, classFile = UnitClass(unit)
                AppendPlayer(players, UnitName(unit), classFile)
            end
        end
    else
        local _, classFile = UnitClass("player")
        AppendPlayer(players, UnitName("player"), classFile)
    end

    return table.concat(players, "|")
end

local frame = CreateFrame("Frame", "LootTrackerFrame", UIParent, "BasicFrameTemplateWithInset")
frame:SetSize(460, 260)
frame:SetPoint("CENTER")
frame:Hide()

frame.title = frame:CreateFontString(nil, "OVERLAY")
frame.title:SetFontObject("GameFontHighlight")
frame.title:SetPoint("TOP", frame.TitleBg, "TOP", 0, -4)
frame.title:SetText("Loot Sheet Export")

local hint = frame:CreateFontString(nil, "OVERLAY", "GameFontDisableSmall")
hint:SetPoint("TOP", frame, "TOP", 0, -28)
hint:SetText("Copy the string below into Loot Sheet → Addon import")

local scrollFrame = CreateFrame("ScrollFrame", nil, frame, "UIPanelScrollFrameTemplate")
scrollFrame:SetPoint("TOPLEFT", frame, "TOPLEFT", 16, -48)
scrollFrame:SetPoint("BOTTOMRIGHT", frame, "BOTTOMRIGHT", -36, 16)

local editBox = CreateFrame("EditBox", nil, scrollFrame)
editBox:SetMultiLine(true)
editBox:SetAutoFocus(false)
editBox:SetFontObject("ChatFontNormal")
editBox:SetWidth(380)
editBox:SetScript("OnEscapePressed", function()
    editBox:ClearFocus()
    frame:Hide()
end)
scrollFrame:SetScrollChild(editBox)

frame:SetScript("OnShow", function()
    local exportString = GenerateExport()
    editBox:SetText(exportString)
    editBox:HighlightText()
    editBox:SetFocus()
end)

SLASH_LOOTTRACKER1 = "/lt"
SLASH_LOOTTRACKER2 = "/lootsheet"
SlashCmdList["LOOTTRACKER"] = function()
    frame:Show()
end

print("|cFFD4AF37Loot Sheet Export loaded. Type /lt to export your roster.|r")
