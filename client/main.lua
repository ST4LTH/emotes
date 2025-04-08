local ChosenDict = ""
local ChosenAnimOptions = false
local PlayerGender = "male"
local PlayerProps = {}
local PlayerParticles = {}
local PreviewPedProps = {}
local PtfxNotif = false
local PtfxPrompt = false
local AnimationThreadStatus = false
local CheckStatus = false
local CanCancel = true
local InExitEmote = false
local ExitAndPlay = false
local EmoteCancelPlaying = false
local currentEmote = {}
local attachedProp
IsInAnimation = false
CurrentAnimationName = nil
CurrentTextureVariation = nil
InHandsup = false

local AddProp = function(prop1, bone, off1, off2, off3, rot1, rot2, rot3, textureVariation, isClone)
    local target = PlayerPedId()

    local x, y, z = table.unpack(GetEntityCoords(target))

    if not IsModelValid(prop1) then
        return false
    end

    if not HasModelLoaded(prop1) then
        LoadPropDict(prop1)
    end

    local modelHash = GetHashKey(prop1)

    attachedProp = CreateObject(modelHash, x, y, z + 0.2, not isClone, true, true)

    if textureVariation ~= nil then
        SetObjectTextureVariation(attachedProp, textureVariation)
    end

    AttachEntityToEntity(attachedProp, target, GetPedBoneIndex(target, bone), off1, off2, off3, rot1, rot2, rot3,
        true, true, false, true, 1, true)
    table.insert(PlayerProps, attachedProp)

    SetModelAsNoLongerNeeded(prop1)
    return true
end

local DestroyAllProps = function()
    for _, v in pairs(PlayerProps) do
        DeleteEntity(v)
    end
    PlayerProps = {}
end

local function PtfxStart()
    LocalPlayer.state:set('ptfx', true, true)
end

local function PtfxStop()
    LocalPlayer.state:set('ptfx', false, true)
end

local function RunAnimationThread()
    local playerId = PlayerPedId()
    if AnimationThreadStatus then return end
    AnimationThreadStatus = true
    CreateThread(function()
        local sleep
        while AnimationThreadStatus and (IsInAnimation or PtfxPrompt) do
            sleep = 500

            if IsInAnimation then
                sleep = 0
            end

            if PtfxPrompt and ChosenAnimOptions then
                sleep = 0
                if not PtfxNotif then
                    PtfxNotif = true
                end
                if IsControlPressed(0, 47) then
                    PtfxStart()
                    Wait(ChosenAnimOptions.PtfxWait)
                    if ChosenAnimOptions.PtfxCanHold then
                        while IsControlPressed(0, 47) and IsInAnimation and AnimationThreadStatus do
                            Wait(5)
                        end
                    end
                    PtfxStop()
                end
            end

            Wait(sleep)
        end
    end)
end

playEmote = function(data)
    local emote = RP[data.category][data.id]
    local animOption = RP[data.category][data.id].AnimationOptions

    DestroyAllProps()
    if not emote then return end

    if data.id == "Expressions" or data.id == "Walks" then
        return
    end

    if emote[1] == "Scenario" then
        TaskStartScenarioInPlace(PlayerPedId(), emote[2], 0, false)
        return
    end

    CurrentAnimationName = data.id 
    LocalPlayer.state:set('currentEmote', data.id, true)
    CurrentTextureVariation = 0
    ChosenAnimOptions = animOption

    local movementType = 0 -- Default movement type

    if animOption then
        if animOption.EmoteMoving then
            movementType = 51
        elseif animOption.EmoteLoop then
            movementType = 1
        elseif animOption.EmoteStuck then
            movementType = 50
        elseif animOption.FullBody then
            movementType = 35
        end
    end

    if animOption then
        if animOption.PtfxAsset then
            Ptfx1, Ptfx2, Ptfx3, Ptfx4, Ptfx5, Ptfx6, PtfxScale = table.unpack(animOption.PtfxPlacement)
            PtfxNotif = false
            PtfxPrompt = true
            RunAnimationThread()
            TriggerServerEvent("rpemotes:ptfx:sync", animOption.PtfxAsset, animOption.PtfxName, vector3(Ptfx1, Ptfx2, Ptfx3),
                vector3(Ptfx4, Ptfx5, Ptfx6), animOption.PtfxBone, PtfxScale, animOption.PtfxColor)
        else
            PtfxPrompt = false
        end
    end
    
    if IsPedUsingAnyScenario(PlayerPedId()) or IsPedActiveInScenario(PlayerPedId()) then
        ClearPedTasksImmediately(PlayerPedId())
    end

    ClearPedTasks(PlayerPedId())
    loadDict(emote[1])
    TaskPlayAnim(PlayerPedId(), emote[1], emote[2], animOption and animOption.BlendInSpeed or 5.0, animOption and animOption.BlendOutSpeed or 5.0, animOption and animOption.EmoteDuration or -1, movementType, 0, false, false, false)

    if animOption and animOption.Prop then
        PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6 = table.unpack(animOption.PropPlacement)

        Wait(animOption and animOption.EmoteDuration or 0)

        if not AddProp(animOption.Prop, animOption.PropBone, PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6, textureVariation, false) then return end

        if animOption.SecondProp then
            SecondPropPl1, SecondPropPl2, SecondPropPl3, SecondPropPl4, SecondPropPl5, SecondPropPl6 = table.unpack(animOption.SecondPropPlacement)
            if not AddProp(animOption.SecondProp, animOption.SecondPropBone, SecondPropPl1, SecondPropPl2, SecondPropPl3, SecondPropPl4, SecondPropPl5, SecondPropPl6, textureVariation, false) then
                DestroyAllProps()
                return
            end
        end

        if not animOption then return end
        if animOption.PtfxAsset and not animOption.PtfxNoProp then
            TriggerServerEvent("rpemotes:ptfx:syncProp", ObjToNet(attachedProp))
        end
    end
end

local refreshKeybinds = function (keybinds)
    for emote, data in pairs(keybinds) do
        RegisterCommand('emotekeybind_'..emote, function ()
            playEmote(data)
        end, false)
        
        RegisterKeyMapping('emotekeybind_'..emote, 'Emote keybind: '..emote, 'keyboard', data.key)
    end
end

local sendKeybinds = function ()
    local keybinds = getDecodedKvp('keybindsKvps')

    if not keybinds then
        keybinds = {}
    end

    print(json.encode(keybinds))

    SendNUIMessage({
        type = 'keybinds',
        data = keybinds
    })
end

CreateThread(function()
--[[     Wait(7000)
    sendKeybinds() ]]
end)

RegisterCommand('emotemenu', function ()
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = 'toggle',
        data = true
    })
    sendKeybinds()
end, false)

RegisterKeyMapping('emotemenu', 'Emotemeny', 'keyboard', 'f4')

RegisterCommand('clearemote', function ()
    ClearPedTasks(PlayerPedId())
    DestroyAllProps()
end, false)

RegisterKeyMapping('clearemote', 'Clear emote', 'keyboard', 'x')

RegisterNUICallback('newKeybind', function(data, cb)
    print(data.id)
    local keybinds = getDecodedKvp('keybindsKvps')

    if not keybinds then
        keybinds = {}
    end

    keybinds[data.id] = data

    setKvp('keybindsKvps', keybinds)
    refreshKeybinds(keybinds)
    Wait(10)
    sendKeybinds()

    cb(true)
end)

RegisterNUICallback('removeKeybind', function(data, cb)
    print(data)
    cb(true)
    local keybinds = getDecodedKvp('keybindsKvps')

    if not keybinds then
        keybinds = {}
    end

    RegisterCommand('emotekeybind_' .. data, function() end, true)
    keybinds[data] = nil

    setKvp('keybindsKvps', keybinds)
    refreshKeybinds(keybinds)
    Wait(10)
    sendKeybinds()
end)

RegisterNUICallback('emote', function(data, cb)
    playEmote(data)
    cb(true)
end)

RegisterNUICallback('close', function(data, cb)
    SetNuiFocus(false, false)
    cb(true)
end)

