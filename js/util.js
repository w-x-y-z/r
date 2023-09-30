//validador de navegador
const getDataBrowser = () => {
    return {
        name: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge|IE)/)[1],
        version: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge|IE)\D*(\d+)/)[2],
        mobile: /Mobi|Android/i.test(navigator.userAgent)
    }
}

//validar permisos 
//camera|microphone|geolocation|notifications|push|midi|clipboard-read|clipboard-write|background-sync|persistent-storage|payment-handler|fullscreen|accelerometer|gyroscope|magnetometer|ambient-light-sensor 
const getPermissonBrowser = (permissionName = 'microphone') => {
    let result = {}
    navigator.permissions.query({ name: permissionName, userVisibleOnly: true })
        .then((res) => {
            result.state = res.state
            result.message = `Ok ${res.name}`
            return res
        }).then((res) => {
            res.onchange = () => {
                result.state = res.state
                result.message = `Ok ${res.name}`
            }
        }).catch((error) => {
            result.state = 'error'
            result.message = `ERROR: ${error}`
        })
    return result
}

//localStorage escritura 
const localStorageWrite = (key, data) => {
    if (data != null && key != null) {
        if (localStorage.getItem(key) == null) {
            if (typeof (data) === 'object') {
                localStorage.setItem(`${key}`, JSON.stringify(data));
            } else {
                localStorage.setItem(`${key}`, data)
            }
        } else {
            throw `Ya existe en localStorage la llave con el nombre [${key}].`
        }
    }else{
        throw `Se requieren datos en el parametro.`
    }
}
//localStorage lectura
const localStorageRead = (key) => {
    if (key != null) {
        if (localStorage.getItem(key) != null) {
            return localStorage.getItem(`${key}`);
        } else {
            throw `No existe en localStorage la llave con el nombre [${key}].`
        }
    }else{
        throw `Se requieren datos en el parametro.`
    }
}

export {getDataBrowser, getPermissonBrowser }
