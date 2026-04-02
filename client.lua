local isOpen = false

RegisterNUICallback('close', function(_, cb)
    isOpen = false
    SetNuiFocus(false, false)
    cb({})
end)

RegisterCommand('playlogg', function()
    if isOpen then
        isOpen = false
        SetNuiFocus(false, false)
        SendNUIMessage({ action = 'hide' })
    else
        isOpen = true
        SetNuiFocus(true, true)
        SendNUIMessage({ action = 'show' })
    end
end, false)
