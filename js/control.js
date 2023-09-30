export const control = {
    init() {
        btnShareScreen.disabled = false;
        btnShareScreen.className = 'shareOn'

        btnRecord.disabled = true;
        btnRecord.className = 'record';

        btnStop.classList.add('hide-animation')
        btnStop.disabled = true

        document.querySelector("#headerControl span").innerHTML='-'
        document.querySelector("#headerControl span").className=""
        //btnMic.disabled = false
        //btnMic.className = 'micOn'
    },
    share() {
        btnShareScreen.disabled = false;
        btnShareScreen.className = 'shareOff'

        btnRecord.disabled = false;
        btnRecord.className = 'record';
        btnRecord.value = 'recording'

        btnStop.classList.add('hide-animation')
        btnStop.disabled = true

        document.querySelector("#headerControl span").innerHTML='C'
        document.querySelector("#headerControl span").className=""
        //btnMic.disabled = false
        //btnMic.className = 'micOn'
    },
    record() {
        btnShareScreen.disabled = true;
        btnShareScreen.className = 'shareOff'

        btnRecord.disabled = false;
        btnRecord.className = 'pause';
        btnRecord.value = 'pause'

        btnStop.classList.remove('hide-animation')
        btnStop.classList.add('acti-animation')
        btnStop.disabled = false

        document.querySelector("#headerControl span").innerHTML='R'
        document.querySelector("#headerControl span").className="rotating-span"
        
        //btnMic.disabled = false
        //btnMic.className = 'micOn'
    },
    pause() {
        btnShareScreen.disabled = true;
        btnShareScreen.className = 'shareOff'

        btnRecord.disabled = false;
        btnRecord.className = 'resumen';
        btnRecord.value = 'resumen'

        btnStop.classList.remove('hide-animation')
        btnStop.classList.add('acti-animation')
        btnStop.disabled = false

        document.querySelector("#headerControl span").innerHTML='P'
        document.querySelector("#headerControl span").className=""
        //btnMic.disabled = false
        //btnMic.className = 'micOn'
    },
    restart() {
        this.record()
    },
    stop() {
        this.share()
    },
    mutedMic(val){
        if(val){
            btnMic.className='micOff'
            document.querySelector("#headerControl span").style.textDecoration='line-through'
        }else{
            btnMic.className='micOn'
            document.querySelector("#headerControl span").style.textDecoration='none'
        }
    },
    micPermission(val){
        if(!val){
            btnMic.disabled = true
            btnMic.className = 'micInactive'
            btnMic.title='Se necesita brindar los permisos de micrófono.'
        }else{
            btnMic.disabled = false
            btnMic.className = 'micOn'
        }
    }

}
