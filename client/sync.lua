local isRequestAnim = false
local requestedemote = ''
local targetPlayerId

RegisterNetEvent("SyncPlayEmote", function(emote, player)
    if IsPedUsingAnyScenario(PlayerPedId()) or IsPedActiveInScenario(PlayerPedId()) then
        ClearPedTasksImmediately(PlayerPedId())
    end

    ClearPedTasks(PlayerPedId())
    Wait(300)
    targetPlayerId = player
    local plyServerId = GetPlayerFromServerId(player)

    -- wait a little to make sure animation shows up right on both clients after canceling any previous emote
    if RP.Shared[emote] then
        local options = RP.Shared[emote].AnimationOptions
        if options and options.Attachto then
            local targetEmote = RP.Shared[emote][4]
            if not targetEmote or not RP.Shared[targetEmote] or not RP.Shared[targetEmote].AnimationOptions or not RP.Shared[targetEmote].AnimationOptions.Attachto then
                local ped = PlayerPedId()
                local pedInFront = GetPlayerPed(plyServerId ~= 0 and plyServerId or GetClosestPlayer())

                AttachEntityToEntity(
                    ped,
                    pedInFront,
                    GetPedBoneIndex(pedInFront, options.bone or -1),
                    options.xPos or 0.0,
                    options.yPos or 0.0,
                    options.zPos or 0.0,
                    options.xRot or 0.0,
                    options.yRot or 0.0,
                    options.zRot or 0.0,
                    false,
                    false,
                    false,
                    true,
                    1,
                    true
                )
            end
        end

        playEmote({ category = 'Shared', id = emote })
        return
    elseif RP.Dances[emote] then
        playEmote({ category = 'Shared', id = emote })
        return
    end
end)

RegisterNetEvent("SyncPlayEmoteSource", function(emote, player)
    local ped = PlayerPedId()
    local plyServerId = GetPlayerFromServerId(player)
    local pedInFront = GetPlayerPed(plyServerId ~= 0 and plyServerId or GetClosestPlayer())

    local options = RP.Shared[emote] and RP.Shared[emote].AnimationOptions or RP.Dances[emote] and RP.Dances[emote].AnimationOptions
    if options then

        if (options.Attachto) then
            AttachEntityToEntity(
                ped,
                pedInFront,
                GetPedBoneIndex(pedInFront, options.bone or -1),
                options.xPos or 0.0,
                options.yPos or 0.0,
                options.zPos or 0.0,
                options.xRot or 0.0,
                options.yRot or 0.0,
                options.zRot or 0.0,
                false,
                false,
                false,
                true,
                1,
                true
            )
        end
    end

    local coords = GetOffsetFromEntityInWorldCoords(pedInFront, (options?.SyncOffsetSide or 0) + 0.0, (options?.SyncOffsetFront or 1) + 0.0, (options?.SyncOffsetHeight or 0) + 0.0)
    local heading = GetEntityHeading(pedInFront)
    SetEntityHeading(ped, heading - (options?.SyncOffsetHeading or 180) + 0.0)
    SetEntityCoordsNoOffset(ped, coords.x, coords.y, coords.z)
    if IsPedUsingAnyScenario(PlayerPedId()) or IsPedActiveInScenario(PlayerPedId()) then
        ClearPedTasksImmediately(PlayerPedId())
    end

    ClearPedTasks(PlayerPedId())
    Wait(300)

    targetPlayerId = player
    if RP.Shared[emote] ~= nil then
        playEmote({ category = 'Shared', id = emote })
        return
    elseif RP.Dances[emote] ~= nil then
        playEmote({ category = 'Shared', id = emote })
        return
    end
end)

RegisterNetEvent("SyncCancelEmote", function(player)
    if targetPlayerId and targetPlayerId == player then
        targetPlayerId = nil
        if IsPedUsingAnyScenario(PlayerPedId()) or IsPedActiveInScenario(PlayerPedId()) then
            ClearPedTasksImmediately(PlayerPedId())
        end
    
        ClearPedTasks(PlayerPedId())
    end
end)

function CancelSharedEmote()
    if targetPlayerId then
        TriggerServerEvent("ServerEmoteCancel", targetPlayerId)
        targetPlayerId = nil
    end
end

RegisterNetEvent("ClientEmoteRequestReceive", function(emotename, etype, target)
    isRequestAnim = true

    local displayed = (etype == 'Dances') and select(3, table.unpack(RP.Dances[emotename])) or select(3, table.unpack(RP.Shared[emotename]))

    PlaySound(-1, "NAV", "HUD_AMMO_SHOP_SOUNDSET", false, 0, true)
    -- The player has now 10 seconds to accept the request
    local timer = 10 * 1000
    while isRequestAnim do
        Wait(5)
        timer = timer - 5
        if timer <= 0 then
            isRequestAnim = false
        end

        if IsControlJustPressed(1, 246) then
            isRequestAnim = false

            local otheremote = RP.Shared[emotename] and RP.Shared[emotename][4] or RP.Dances[emotename] and RP.Dances[emotename][4] or emotename
            TriggerServerEvent("ServerValidEmote", target, emotename, otheremote)
        elseif IsControlJustPressed(1, 182) then
            isRequestAnim = false
        end
    end
end)
