-- LootTracker.lua
local function GetPlayerSpec()
    local numTabs = GetNumTalentTabs()
    local maxPoints = 0
    local mainSpec = "Unknown"
    
    for i = 1, numTabs do
        local name, icon, pointsSpent = GetTalentTabInfo(i)
        if pointsSpent > maxPoints then
            maxPoints = pointsSpent
            mainSpec = name
        end
    end
    return mainSpec
end

local function GenerateExport()
    local players = {}
    local numMembers = GetNumGroupMembers()
    
    if numMembers == 0 then
        -- Solo testing
        local name = UnitName("player")
        local _, class = UnitClass("player")
        local spec = GetPlayerSpec()
        table.insert(players, string.format("%s:%s:%s", name, class, spec))
    else
        for i = 1, numMembers do
            local name, rank, subgroup, level, class, fileName, zone, online, isDead, role, isML = GetRaidRosterInfo(i)
            if name then
                -- Note: Spec is hard to get for others without inspection. 
                -- We'll use 'None' or 'Check Talent' as placeholder if not player.
                local spec = "Role-" .. (role or "None")
                if name == UnitName("player") then
                    spec = GetPlayerSpec()
                end
                table.insert(players, string.format("%s:%s:%s", name, fileName, spec))
            end
        end
    end
    
    return table.concat(players, "|")
end

-- Create UI
local frame = CreateFrame("Frame", "LootTrackerFrame", UIParent, "BasicFrameTemplateWithInset")
frame:SetSize(400, 200)
frame:SetPoint("CENTER")
frame:Hide()
frame.title = frame:CreateFontString(nil, "OVERLAY")
frame.title:SetFontObject("GameFontHighlight")
frame.title:SetPoint("CENTER", frame.TitleBg, "CENTER", 0, 0)
frame.title:SetText("LootTracker Export")

local editBox = CreateFrame("EditBox", nil, frame, "InputBoxTemplate")
editBox:SetSize(350, 30)
editBox:SetPoint("CENTER", 0, 0)
editBox:SetAutoFocus(false)

frame:SetScript("OnShow", function()
    local exportString = GenerateExport()
    editBox:SetText(exportString)
    editBox:HighlightText()
    editBox:SetFocus()
end)

-- Slash Command
SLASH_LOOTTRACKER1 = "/lt"
SlashCmdList["LOOTTRACKER"] = function()
    frame:Show()
end

print("|cFFD4AF37LootTracker loaded. Type /lt to export raid.|r")
