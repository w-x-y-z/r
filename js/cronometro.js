let id;
let h = 0;
let m = 0;
let s = 0;
let idHtml;

function init(tag) {
    idHtml=tag;
    idHtml.innerHTML = "00:00:00";
}
function cronometrar() {
    escribir();
    id = setInterval(escribir, 1000);
}
function escribir() {
    var hAux, mAux, sAux;
    s++
    if (s === 60) {
        s = 0;
        m++;
        if (m === 60) {
            m = 0;
            h++;
        }
    }
    sAux=(s<10)? `0${s}`: s;
    mAux=(m<10)? `0${m}`: m;
    hAux=(h<10)? `0${h}`: h;
    idHtml.innerHTML = hAux + ":" + mAux + ":" + sAux;
}
function parar() {
    clearInterval(id);

}
function reiniciar() {
    clearInterval(id);
    idHtml.innerHTML = "00:00:00";
    h = 0; m = 0; s = 0;
}
export {init, cronometrar, parar, reiniciar }