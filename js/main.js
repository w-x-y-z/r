let confSelecc = null
let tagSelect = null

btnShareScreen.addEventListener("click", async (e) => {
  if (Recording.streamScreen != null) {
    Recording.stopStream();
    control.init()
  } else {
    try {
      await Recording.getDisplay();
      if (Recording.streamScreen != null) {
        video.srcObject = Recording.streamScreen;
        control.share()

        if (Recording.streamMic != null) {
          control.micPermission(true)
        } else {
          control.micPermission(false)
        }

        Recording.streamScreen.getVideoTracks()[0].addEventListener("ended", (e) => {
          control.init()
          cronometro.reiniciar()
        });

      } else {
        control.init()
      }
    } catch (error) {
      console.log(error)
    }
  }

});

btnRecord.addEventListener("click", async (e) => {
  switch (e.target.value) {
    case 'recording':
      const record = await Recording.initRecorder();
      if (record.status) {
        control.record()
        cronometro.cronometrar();
        selectDisable(true);
      }
      break;
    case 'pause':
      Recording.recorder.pause();
      control.pause()
      cronometro.parar();
      break;
    case 'resumen':
      Recording.recorder.resume();
      control.restart();
      cronometro.cronometrar();
      break;
    default:
      break;
  }

})

btnStop.addEventListener("click", (e) => {
  if (Recording.recorder != null) {
    Recording.stopRecorder();
    control.stop();
    cronometro.reiniciar();
    selectDisable(false);
  }
})

btnMic.addEventListener("click", (e) => {
  //Recording.mutedMic(mic)
  if (Recording.streamMic != null) {
    if (Recording.getMutedMic()) {
      //si esta activo lo silenciamos
      Recording.setMutedMic(false)
      control.mutedMic(true)
    } else {
      //activamos el audio silenciado
      Recording.setMutedMic(true)
      control.mutedMic(false)
    }
  }

})
document.addEventListener('DOMContentLoaded', async (e) => {
  control.init();
  cronometro.init(hms);

  resolucion.innerHTML = conf.getResolution();
  frameRate.innerHTML = conf.getFrameRate();
  audioSystem.innerHTML = conf.getAudioSystem();
  audioMic.innerHTML = conf.getAudioMic();
  camera.innerHTML = conf.getCamera();
  tasaBitsAudio.innerHTML = conf.getTasaBitsAudio();
  tasaBitsVideo.innerHTML = conf.getTasaBitsVideo();

  confSelecc = conf.selectValues(resolucion.value, frameRate.value, audioSystem.value, audioMic.value, camera.value, tasaBitsAudio.value, tasaBitsVideo.value)
  Recording.initConf(dataVideo, confSelecc.constraintsScreen, confSelecc.constraintsMic, confSelecc.optionsCodecVideo)
  console.log(util.getDataBrowser())

  if (await Recording.validPermissionMic()) {
    control.micPermission(true);
  } else {
    control.micPermission(false);
  }

  tagSelect = document.querySelectorAll('.config select')

});

document.body.addEventListener('change', (event) => {
  confSelecc = conf.selectValues(resolucion.value, frameRate.value, audioSystem.value, audioMic.value, camera.value, tasaBitsAudio.value, tasaBitsVideo.value)
  Recording.initConf(dataVideo, confSelecc.constraintsScreen, confSelecc.constraintsMic, confSelecc.optionsCodecVideo)
});

const selectDisable = (status) => {
  tagSelect.forEach((select) => {
    select.disabled = status;
  });
}
document.addEventListener('keydown',(event)=>{
  switch ((event.key).toUpperCase()) {
    case "C":
      btnShareScreen.click();
      break;
    case "R":
      btnRecord.click();
      break;
    case "S":
      btnStop.click();
      break;
    case "M":
      btnMic.click();
      break;
    case "O":
      headerControl.style.display="block"
      mainControl.style.visibility="hidden"
      break;
    case "P":
      headerControl.style.display="none"
      mainControl.style.visibility="visible"
      break;
    case "|":
        console.log(Recording.streamScreen,Recording.streamMic,Recording.recorder);
      break;
    default:
      break;
  }
})
import * as conf from './config.js'
import * as util from './util.js';
import * as cronometro from './cronometro.js';
import { Recording } from './recording.js';
import { control } from './control.js';
