export const Recording = {
    // VARIABLES GENERALES
    streamScreen: null,
    streamMic: null,
    streamCam: null,
    recorder: null,
    directorio: null,

    //VARIABLES PARTICULARES
    tagHtml: null,
    constraintsScreen: {
        audio: { echoCancellation: true, noiseSuppression: true },
        video: { frameRate: { ideal: 30, max: 60 }, width: { ideal: 1920, max: 1920 }, height: { ideal: 1080, max: 1080 } }
    },
    constraintsMic: {
        audio: {
            sampleRate: 44100,
            noiseSuppression: true,
            echoCancellation: true,
            channelCount: 2,
            description: 'Necesitamos acceder a tu micrófono para grabar.'
        }
        , video: false
    },
    optionsCodecVideo: {
        mimeType: 'video/webm;codecs=vp9',
        audioBitsPerSecond: 128000, // Tasa de bits de audio de 128 kbps
        videoBitsPerSecond: (1000000) * 1, //(0.8)1 megabits = 1000000 bits | 1 [Kilobits] = 1000 [Bits]
    },
    getName() {
        let date = new Date()
        return `${[date.getDate().toString().padStart(2, '0'), (date.getMonth() + 1).toString().padStart(2, '0'), date.getFullYear()].join('-')} ${date.toLocaleTimeString().replace(/[^a-zA-Z 0-9.]+/g, '')}.mp4`
    },

    //Función para iniciar la camtura de pantalla
    async getDisplay() {
        const permitidoMic = await this.validPermissionMic()
        //Solicitamos la captura de pantalla 
        this.streamScreen = await navigator.mediaDevices.getDisplayMedia(this.constraintsScreen).then(e => e).catch(() => null)
        //Validar si se compartio 
        if (this.streamScreen != null) {
            //solicitamos si para activar el microfono del usuario
            this.streamMic = permitidoMic ? await navigator.mediaDevices.getUserMedia(this.constraintsMic).then(d => d).catch(() => null) : null
        }
        //Cuando se deja de compartir la ventana, si existe en curso grabación detener y guardar
        if (this.streamScreen != null) this.streamScreen.getVideoTracks()[0].addEventListener("ended", () => { this.stopStream(); })
    },
    //Función que inicializa la grabación
    async initRecorder() {
        try {
            this.directorio = (this.directorio == null) ? await this.getDirectoryReadWrite() : this.directorio;
            if (this.streamScreen != null) {
                const handle = (this.directorio.status == true) ? await this.directorio.data.getFileHandle(this.getName(), { create: true }) : await showSaveFilePicker({ suggestedName: this.getName(), types: [{ description: 'Archivo de video', accept: { 'video/*': ['.mp4'] } }] });
                this.recorder = new MediaRecorder((this.streamMic != null) ? this.mixer(this.streamScreen, this.streamMic) : this.streamScreen, this.optionsCodecVideo);
                return await this.saveRecording(handle);
                //return { status: true, message: 'Se esta incianlizando la grabación' }
            } else {
                alert('Debe seleccionar el area agrabar.');
            }

        } catch (error) {
            if (this.directorio.status) {
                this.directorio.status = false;
                this.directorio.message = error;
                this.initRecorder();
            } else {
                return { status: false, data: null, message: error }
            }
        }
    },
    //Función que se encarga de guardar la grabación
    async saveRecording(saveFileVideo) {
        let totalBytes = 0;
        let bytes = 0;
        let html;
        try {
            const writable = await saveFileVideo.createWritable();
            this.recorder.start(1000 * 2);
            this.recorder.ondataavailable = async (event) => {
                await writable.write(event.data)
                if (this.tagHtml != null) {
                    bytes = event.data.size
                    totalBytes += bytes;
                    html = `Nombre: ${saveFileVideo.name}\nTamaño generado: ${(bytes / 1024).toFixed(2)} KB.\nTamaño total: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB.`
                    this.tagHtml.innerHTML = html;
                }
            };
            this.recorder.onstop = async () => await writable.close();
            return { status: true, data: saveFileVideo.name, message: `Se inicio la grabación "${saveFileVideo.name}"` }
        } catch (error) {
            return { status: false, data: null, message: error }
        }
    },
    //Detiene la grabación
    stopRecorder() {
        this.recorder.stop();
        this.recorder = null;
    },
    //Cierra toda las conexiones abiertas
    stopStream() {
        if (this.streamScreen != null) {
            for (let track of this.streamScreen.getTracks()) {
                track.stop()
            }
            this.streamScreen = null
        }
        if (this.streamMic != null) {
            for (let track of this.streamMic.getTracks()) {
                track.stop()
            }
            this.streamMic = null
        }
        if (this.recorder != null) {
            this.stopRecorder();
        }
    },
    async validPermissionMic() {
        try {
            const res = await navigator.mediaDevices.getUserMedia(this.constraintsMic);
            const audioTrack = res.getAudioTracks()[0];
            if (audioTrack) {
                for (let track of res.getTracks()) {
                    track.stop();
                }
            }
            return true;
        } catch (exp) {
            return false;
        }
    },
    setMutedMic(value) {
        // true: activo | false: silenciado
        this.streamMic.getAudioTracks()[0].enabled = value
    },
    getMutedMic() {
        // true: activo | false: silenciado
        return this.streamMic.getAudioTracks()[0].enabled
    },
    mixer(stream1, stream2) {
        const ctx = new AudioContext();
        const dest = ctx.createMediaStreamDestination();

        if (stream1.getAudioTracks().length > 0)
            ctx.createMediaStreamSource(stream1).connect(dest);

        if (stream2.getAudioTracks().length > 0)
            ctx.createMediaStreamSource(stream2).connect(dest);
        let tracks = dest.stream.getTracks();
        tracks = tracks.concat(stream1.getVideoTracks()).concat(stream2.getVideoTracks());
        return new MediaStream(tracks)
    },
    async getStreamScreen() {
        return this.streamScreen;
    },
    async getDirectoryReadWrite() {
        try {
            const name = `${new Date().toISOString().replace(/[^a-zA-Z 0-9.]+/g, '')}.txt`
            const ruta = await window.showDirectoryPicker();
            const file = await ruta.getFileHandle(name, { create: true });
            await file.remove();
            return { status: true, data: ruta, message: 'ok' }
        } catch (error) {
            return { status: false, data: null, message: `ERROR: ${error}` }
        }
    },
    initConf(tagHtml, constraintsScreen, constraintsMic, optionsCodecVideo) {
        this.tagHtml = tagHtml;
        this.constraintsScreen = constraintsScreen;
        this.constraintsMic = constraintsMic;
        this.optionsCodecVideo = optionsCodecVideo;
    }

}