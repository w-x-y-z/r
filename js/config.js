const VARIABLES_CONFIG_VIDEO = {
    resolution:
        [
            {
                name: "default",
                value: {}
            },
            {
                name: "1280x720",
                value: { width: 1280, height:720 }
            },
            {
                name: "1920x1080",
                value: { width: { ideal: 1920, max: 1920 }, height: { ideal: 1080, max: 1080 } }
            },
        ],
    frameRate: [
        {
            name: "default",
            value: {}
        },
        {
            name: "30",
            value: { frameRate: { exact: 30 } }
        },
        {
            name: "60",
            value: { frameRate: { exact: 60 } }
        },
        {
            name: "30x60",
            value: { frameRate: { ideal: 30, max: 60 } }
        }
    ],
    audioSystem: [
        {
            name: "default system",
            value: {}
        },
        {
            name: "audio system 1",
            value: { echoCancellation: true, noiseSuppression: true }
        }
    ],
    audioMic: [
        {
            name: "default mic",
            value: {}
        },
        {
            name: "audio mic 1",
            value: {
                sampleRate: 44100,
                noiseSuppression: true,
                echoCancellation: true,
                channelCount: 2,
            }
        }
    ],
    camera: [
        {
            name: "Camara-01",
            value: { video: false }
        }
    ],
    tasaBitsAudio: [
        {
            name: "128kbps",
            value: 128000
        }
    ],
    tasaBitsVideo: [
        {
            name: "default",
            value: null
        },
        {
            name: "0.1Mbps",
            value: 1000000 * 0.1
        },
        {
            name: "0.3Mbps",
            value: 1000000 * 0.3
        },
        {
            name: "0.5Mbps",
            value: 1000000 * 0.5
        },
        {
            name: "0.8Mbps",
            value: 1000000 * 0.8
        },
        {
            name: "1Mbps",
            value: 1000000 * 1
        },
        {
            name: "2Mbps",
            value: 1000000 * 2
        },
        {
            name: "3Mbps",
            value: 1000000 * 3
        },
        {
            name: "4Mbps",
            value: 1000000 * 4
        },
        {
            name: "5Mbps",
            value: 1000000 * 5
        },
        {
            name: "8Mbps",
            value: 1000000 * 8
        },
        {
            name: "10Mbps",
            value: 1000000 * 10
        },
        {
            name: "20Mbps",
            value: 1000000 * 20
        }
    ]
}


const getResolution = () => {
    let html = ``
    VARIABLES_CONFIG_VIDEO.resolution.forEach((element, index) => {
        html += `<option value="${index}">${element.name}</option>`;
    });
    return html;
}
const getFrameRate = () => {
    let html = ``
    VARIABLES_CONFIG_VIDEO.frameRate.forEach((element, index) => {
        html += `<option value="${index}">${element.name}</option>`;
    });
    return html;
}
const getAudioSystem = () => {
    let html = ``
    VARIABLES_CONFIG_VIDEO.audioSystem.forEach((element, index) => {
        html += `<option value="${index}">${element.name}</option>`;
    });
    return html;
}
const getAudioMic = () => {
    let html = ``
    VARIABLES_CONFIG_VIDEO.audioMic.forEach((element, index) => {
        html += `<option value="${index}">${element.name}</option>`;
    });
    return html;
}
const getCamera = () => {
    let html = ``
    VARIABLES_CONFIG_VIDEO.camera.forEach((element, index) => {
        html += `<option value="${index}">${element.name}</option>`;
    });
    return html;
}
const getTasaBitsAudio = () => {
    let html = ``
    VARIABLES_CONFIG_VIDEO.tasaBitsAudio.forEach((element, index) => {
        html += `<option value="${index}">${element.name}</option>`;
    });
    return html;
}
const getTasaBitsVideo = () => {
    let html = ``
    VARIABLES_CONFIG_VIDEO.tasaBitsVideo.forEach((element, index) => {
        html += `<option value="${index}">${element.name}</option>`;
    });
    return html;
}
const selectValues = (resolucion, frameRate, audioSystem, audioMic, camera, tasaBitsAudio, tasaBitsVideo) => {
    let result = {}
    result.constraintsScreen = { audio: VARIABLES_CONFIG_VIDEO.audioSystem[audioSystem].value }
    result.constraintsScreen.video = VARIABLES_CONFIG_VIDEO.resolution[resolucion].value
    result.constraintsScreen.video = { ...result.constraintsScreen.video, ...VARIABLES_CONFIG_VIDEO.frameRate[frameRate].value }
    result.constraintsMic = { audio: VARIABLES_CONFIG_VIDEO.audioMic[audioMic].value, ...VARIABLES_CONFIG_VIDEO.camera[camera].value }
    result.optionsCodecVideo = { mimeType: 'video/webm;codecs=vp9' }
    result.optionsCodecVideo.audioBitsPerSecond = VARIABLES_CONFIG_VIDEO.tasaBitsAudio[tasaBitsAudio].value
    result.optionsCodecVideo.videoBitsPerSecond = VARIABLES_CONFIG_VIDEO.tasaBitsVideo[tasaBitsVideo].value
    return result
}

export { getResolution, getFrameRate, getAudioSystem, getAudioMic, getCamera, getTasaBitsAudio, getTasaBitsVideo, selectValues }