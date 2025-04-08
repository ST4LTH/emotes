local emoteList = {}

convertToEmoteList = function()
    local count = 0
    for directoryName, directory in pairs(RP) do
        table.insert(emoteList, {
            name = directoryName,
            emotes = {}
        })
        if directoryName == "Expressions" or directoryName == "Walks" then
            for emoteName, emote in pairs(directory) do
                count = count + 1
                table.insert(emoteList[#emoteList].emotes, {
                    name = emoteName,
                    id = emoteName,
                })
            end
        else 
            for emoteId, emote in pairs(directory) do
                count = count + 1
                table.insert(emoteList[#emoteList].emotes, {
                    name = emote[3],
                    id = emoteId,
                })
            end
        end
    end

    print(count)

    -- Save the emoteList to a JSON file
    saveEmoteListToJson()
end

saveEmoteListToJson = function()
    local jsonData = json.encode(emoteList, { indent = true })
    local filePath = GetResourcePath(GetCurrentResourceName()) .. "/emoteList.json"

    -- Write the JSON data to the file
    local file = io.open(filePath, "w")
    if file then
        file:write(jsonData)
        file:close()
        print("Emote list successfully saved to JSON file.")
    else
        print("Failed to open file for writing.")
    end
end

-- Call the function to generate and save the emote list
--[[ convertToEmoteList() ]]

-----------------------------------------------------------------------------------------------------
-- Shared Emotes Syncing  ---------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------

RegisterNetEvent("ServerEmoteRequest", function(target, emotename, etype)
    if not Player(source).state.canEmote then return end

    local ped = GetPlayerPed(source)

    if target == -1 then
        return
    end
    local tped = GetPlayerPed(target)
    local pedcoord = GetEntityCoords(ped)
    local targetcoord = GetEntityCoords(tped)

    local distance = #(pedcoord - targetcoord)

    if distance > 3 then
        return
    end

    TriggerClientEvent("ClientEmoteRequestReceive", target, emotename, etype, source)
end)

RegisterNetEvent("ServerValidEmote", function(target, requestedemote, otheremote)
    local ped = GetPlayerPed(source)

    if target == -1 then
        return
    end
    local tped = GetPlayerPed(target)
    local pedcoord = GetEntityCoords(ped)
    local targetcoord = GetEntityCoords(tped)

    local distance = #(pedcoord - targetcoord)

    if distance > 3 then
        return
    end

    TriggerClientEvent("SyncPlayEmote", source, otheremote, target)
    TriggerClientEvent("SyncPlayEmoteSource", target, requestedemote, source)
end)

RegisterNetEvent("ServerEmoteCancel", function(target)
    TriggerClientEvent("SyncCancelEmote", target, source)
end)

--#region ptfx
RegisterNetEvent("rpemotes:ptfx:sync", function(asset, name, offset, rot, bone, scale, color)
    if type(asset) ~= "string" or type(name) ~= "string" or type(offset) ~= "vector3" or type(rot) ~= "vector3" then
        print("[rpemotes] ptfx:sync: invalid arguments for source:", source)
        return
    end

    local srcPlayerState = Player(source).state

    srcPlayerState:set("ptfxAsset", asset, true)
    srcPlayerState:set("ptfxName", name, true)
    srcPlayerState:set("ptfxOffset", offset, true)
    srcPlayerState:set("ptfxRot", rot, true)
    srcPlayerState:set("ptfxBone", bone, true)
    srcPlayerState:set("ptfxScale", scale, true)
    srcPlayerState:set("ptfxColor", color, true)
    srcPlayerState:set("ptfxPropNet", false, true)
    srcPlayerState:set("ptfx", false, true)
end)

RegisterNetEvent("rpemotes:ptfx:syncProp", function(propNet)
    local srcPlayerState = Player(source).state
    if propNet then
        -- Prevent infinite loop to get entity
        local waitForEntityToExistCount = 0
        while waitForEntityToExistCount <= 100 and not DoesEntityExist(NetworkGetEntityFromNetworkId(propNet)) do
            Wait(10)
            waitForEntityToExistCount = waitForEntityToExistCount + 1
        end

        -- If below 100 then we could find the loaded entity
        if waitForEntityToExistCount < 100 then
            srcPlayerState:set("ptfxPropNet", propNet, true)
            return
        end
    end
    -- If we reach this point then we couldn"t find the entity
    srcPlayerState:set("ptfxPropNet", false, true)
end)