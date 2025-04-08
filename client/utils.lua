loadDict = function(dict)
    while not HasAnimDictLoaded(dict) do
        Wait(0)
        RequestAnimDict(dict)
    end
end

LoadPropDict = function(model)
    print(model)
    local modelHash = GetHashKey(model)
    if not HasModelLoaded(modelHash) then
        RequestModel(modelHash)
        local timeout = 2000
        while not HasModelLoaded(modelHash) and timeout > 0 do
            Wait(5)
            timeout = timeout - 5
        end
        if timeout == 0 then
            return
        end
    end
end


getDecodedKvp = function (string)
    local data = nil

    local resourceKvp = GetResourceKvpString(string)
    if resourceKvp then
        data = json.decode(resourceKvp)
    end

    return data
end

setKvp = function (string, data)
    if not data then return end

    SetResourceKvp(string, json.encode(data))
end