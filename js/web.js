import { animacion, desplazar, desplazarInvertido, modoHard } from "./main.js";
import { cancionNormalTheme, cancionHardTheme } from "./Sonido.js";
/**
 * Esta clase controla la ventana modal 'Inicial'desencadenando el loop del juego con la función de animacion() proveniente de main.js.
 * También altera el estado del 'modoHard' y la vista web (aparicion/alineacion de elementos)
 */
const menu = document.getElementById('ventanaMenu');
const btnMenuPlay = document.getElementById('btnMenuStart');
const btnHard = document.getElementById('hardDifficulty');
menu.showModal();

/**
 * Cierra el menú y comienza el juego con la musica elegida
 */
btnMenuPlay.addEventListener('click', () => {
  if (btnHard.checked) {
    modoHard();
    cancionHardTheme.playBackground();
    seleccionarDesplazamientoAleatorio();
  } else {
    cancionNormalTheme.playBackground();
    document.addEventListener('keydown', desplazar);
  }

  animacion();
  menu.close();
  activarCentrado();

});

/**
 * Hace uso de las classes de Tailwind para insertar/hacer visible elementos cuando el usuario pulse 'Play'
 */

function activarCentrado() {
  const contenedorIMG = document.getElementById('divImagen');
  const tituloTetris = document.getElementById('tituloAfterPlay');
  tituloTetris.classList.toggle('hidden');
  contenedorIMG.classList.toggle('invisible');
}

/**
 * Gracias a sessionStorage almacena un registro de las veces que el usuario ha refrescado la pagina.
 * A diferencia de 'localStorage', el almacenamiento de la variable 'contador' solo es válido mientras el usuario no cierre la pestaña/navegador.
 * Cuando el registro de veces sea >= 1, el modo 'Hard' empezará a usar aleatoriamente controles Normales + controles Inversos.
 */
const numAleatorio = () => Math.floor(Math.random() * 11);
function seleccionarDesplazamientoAleatorio() {
  if (sessionStorage.getItem('contador') === null) {
    sessionStorage.setItem('contador', 0);
  } else {
    let contador = Number(sessionStorage.getItem('contador'));
    sessionStorage.setItem('contador', ++contador);
  }
  let numeroDeRecargasWeb = sessionStorage.getItem('contador');
  let numero = numAleatorio();

  //En funcion del numero aleatorio y recargas web asignamos el EventListener
  if (numeroDeRecargasWeb >= 1 && numero > 5) {
    document.addEventListener('keydown', desplazarInvertido)
    /* console.log('invertido'); */
  } else if (numeroDeRecargasWeb >= 1 && numero <= 5) {
    document.addEventListener('keydown', desplazar)
    /* console.log('normal'); */
  } else {
    document.addEventListener('keydown', desplazarInvertido)
  }
}
