-- LootTracker.lua — export roster for Loot Sheet (TBC Anniversary / Interface 20505)

local ADDON_NAME = "Loot Sheet Export"

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
    if not name or name == "" or not classFile or classFile == "" then
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
        for i = 1, GetNumGroupMembers() do
            local name, _, _, _, _, classFile = GetRaidRosterInfo(i)
            if name and classFile then
                AppendPlayer(players, name, classFile)
            end
        end
    elseif IsInGroup() then
        local _, playerClass = UnitClass("player")
        AppendPlayer(players, UnitName("player"), playerClass)

        local partyCount = (GetNumSubgroupMembers and GetNumSubgroupMembers())
            or (GetNumPartyMembers and GetNumPartyMembers())
            or 0

        for i = 1, partyCount do
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

local function ApplyBackdrop(frame)
    if BackdropTemplateMixin and not frame.SetBackdrop then
        Mixin(frame, BackdropTemplateMixin)
    end

    if frame.SetBackdrop then
        frame:SetBackdrop({
            bgFile = "Interface\\DialogFrame\\UI-DialogBox-Background",
            edgeFile = "Interface\\DialogFrame\\UI-DialogBox-Border",
            tile = true,
            tileSize = 32,
            edgeSize = 32,
            insets = { left = 11, right = 12, top = 12, bottom = 11 },
        })
        frame:SetBackdropColor(0, 0, 0, 0.92)
    end
end

local frame = CreateFrame("Frame", "LootTrackerFrame", UIParent)
frame:SetSize(460, 260)
frame:SetPoint("CENTER")
frame:SetFrameStrata("DIALOG")
frame:EnableMouse(true)
frame:Hide()
ApplyBackdrop(frame)

local title = frame:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
title:SetPoint("TOP", 0, -18)
title:SetText(ADDON_NAME)

local hint = frame:CreateFontString(nil, "OVERLAY", "GameFontDisableSmall")
hint:SetPoint("TOP", frame, "TOP", 0, -42)
hint:SetText("Copy the string below into Loot Sheet -> Addon import")

local scrollFrame = CreateFrame("ScrollFrame", nil, frame, "UIPanelScrollFrameTemplate")
scrollFrame:SetPoint("TOPLEFT", frame, "TOPLEFT", 20, -58)
scrollFrame:SetPoint("BOTTOMRIGHT", frame, "BOTTOMRIGHT", -36, 20)

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

local closeButton = CreateFrame("Button", nil, frame, "UIPanelCloseButton")
closeButton:SetPoint("TOPRIGHT", -4, -4)
closeButton:SetScript("OnClick", function()
    frame:Hide()
end)

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

local boot = CreateFrame("Frame")
boot:RegisterEvent("PLAYER_LOGIN")
boot:SetScript("OnEvent", function()
    print("|cFFD4AF37" .. ADDON_NAME .. " loaded. Type /lt to export your roster.|r")
end)
