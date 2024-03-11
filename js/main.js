import { Piezas } from "./Piezas.js"
import { Tablero } from "./Tablero.js"
import { Bolsa } from "./Bolsa_de_piezas.js"
import { Sonido, cancionNormalTheme, cancionHardTheme } from "./Sonido.js"
import { Puntuacion } from "./Puntuacion.js"


//:::::CONFIGURACION DEL CANVAS:::::::::
const idCanvas = document.getElementById('canvas');
const canvas = idCanvas.getContext('2d');
idCanvas.width = 450;
idCanvas.height = 900;
canvas.lineWidth = 2;
// (window.innerWidth / 4.25); -> ancho de la pantalla adaptable
// window.innerHeight - 30; //altura adaptable

//:::::CREACION DE COLORES ALEATORIOS:::::::::
const aleatorio = valor => Math.floor(Math.random() * valor);
const hue = `hue-rotate(${aleatorio(360)}deg)`;
canvas.filter = hue;

//:::::PARAMETROS DEL JUEGO:::::::
const PX = 45;
const FILAS = 20;
const COLUMNAS = 10;
const LIMITE_TABLERO_IZQ = 0;
//Velocidad de caida y posicion inicial en el tablero
let milisegundos = 1000;
let posInicialPiezaY = 0;
let posInicialPiezaX = 4;
// al llegar a pulsar 'n' veces la tecla de rotar pieza, la pieza baja automaticamente 1 casilla
let pulsaciones = 0;
//fuerza al jugador a esperar que aparezca la pieza al principio del tablero (evita errores de dibujo)
let animacionRealizada = false;

//:::::PUNTUACION::::::
let score = 0;
const puntuacion = document.getElementById('score'); //h1 del score 'in-game'
const puntuacionFinal = document.getElementById('scoreFinal'); //h1 del score en la ventana 'game Over'
const ventanaGameOver = document.getElementById('ventanaGameOver');

//:::::::::::::JUEGO:::::::::::::::
const miTablero = new Tablero(canvas, PX, FILAS, COLUMNAS);
const bolsa = new Bolsa(); //obj que contiene el array de piezas
let pieza = new Piezas(canvas, miTablero, bolsa.obtenerPieza(), posInicialPiezaX, posInicialPiezaY);
let tiempoTranscurrido = Date.now();

//LOOP DEL JUEGO / FUNCIONES QUE CONTROLA LA VENTANA MODAL de INICIO: web.js
export { animacion, gameOver, modoHard, desplazar, desplazarInvertido, bolsa }

function modoHard(){
  milisegundos = 800;
  canvas.filter = hue + "blur(3px)";
  miTablero.repintar();
}

//:::::::::ANIMACION DE LA PIEZA:::::::::::

function animacion() {
  let tiempoActual = Date.now();
  let lapso = tiempoActual - tiempoTranscurrido;
  if (lapso > milisegundos && pieza.y >= 0) {
      pieza.undraw();
      pieza.y++;
      pieza.draw();
      animacionRealizada = true;
      tiempoTranscurrido = Date.now();
  }

  const id = window.requestAnimationFrame(animacion);

  //:::::::::REINICIO + NUEVA PIEZA:::::::::::
  if (casillaOcupada()) {
    animacionRealizada = false;
    pulsaciones = 0;
    //la volvemos parte del tablero && miramos si existe una fila completa
    solidificarPieza(miTablero.matriz, pieza);
    comprobarLinea(miTablero.matriz);
    miTablero.repintar();
    //sacamos la siguiente pieza:
    pieza = new Piezas(canvas, miTablero, bolsa.obtenerPieza(), posInicialPiezaX, posInicialPiezaY);
    //permite que la siguiente pieza salga sin retardo
    tiempoTranscurrido = Date.now() - milisegundos + 300;
    
    if (gameOver(id)) {
      setTimeout(() => {
        Puntuacion.getPuntos(score);
        puntuacionFinal.innerHTML = `Puntuación máxima: ${Puntuacion.getPuntosMaximos()}`;
        ventanaGameOver.showModal();
        
      }, 200);
    }
  }
};



//:::::DESPLAZAMIENTO POR TECLA:::::::::::

/**
 * Esta funcion se ejecuta en funcion del modo elegido 'hard' o 'normal'. Esta opción esta gestionada en el archivo web.js
 * Desplazar mueve o rota la pieza en funcion de la tecla pulsada.
 'preventDefault()' desactiva el scroll.
 * El boolean de 'animacionRealizada' se asegura de que la Pieza se ha mostrado al menos 1 vez' en el tablero. 
 */

function desplazar(tecla) {
  if (tecla.key === 'ArrowDown' || tecla.key === 'ArrowUp') {
    tecla.preventDefault();
  }

  if (animacionRealizada) {
    switch (tecla.key) {
      case "ArrowDown":
      case "s":
        pieza.desplazarAbajo();
        tiempoTranscurrido = Date.now();
        break;
      case "ArrowLeft":
      case "a":
        if (pieza.x > LIMITE_TABLERO_IZQ && !casillaOcupada(true)) {
          pieza.desplazarIzquierda();
          tiempoTranscurrido = Date.now();
        }
        break;
      case "ArrowRight":
      case "d":
        const LIMITE_TABLERO_DER = pieza.matrizActiva[0].length + pieza.x;
        if (COLUMNAS > LIMITE_TABLERO_DER && !casillaOcupada(false, true)) {
          pieza.desplazarDerecha();
          tiempoTranscurrido = Date.now();
        }
        break;
      case "ArrowUp":
      case "w":
        if (!casillaOcupada(true, true)) {
          tiempoTranscurrido = Date.now();
          pieza.undraw();
          pieza.rotarPieza();
          pulsaciones++;
          if (pulsaciones >= 4) {
            pulsaciones = 0;
            tiempoTranscurrido = 0;
          }
        }
        break;
    }
  }
}




/**
 * Recorre las matriz de la Pieza y compara su valor pintado (1 o !== 0) con la posicion SIGUIENTE de la casilla del tablero.
 * Si la siguiente casilla === 2, entonces realiza la 'colision' y para la animación actual.
 * Los parametros opcionales sirven para 'activar' las comprobaciones de izquierda o derecha. 
 * Estan desactivadas por defecto para evitar errores de superposicion.
 */

function casillaOcupada(izquierda = false, derecha = false) {
  let ocupada = false;
  for (let fil = 0; fil < pieza.matrizActiva.length; fil++) {
    for (let col = 0; col < pieza.matrizActiva[fil].length; col++) {
      const posicionX = col + pieza.x;
      const posicionY = fil + pieza.y;

      //Comprueba el final del tablero
      if ((FILAS - 1) <= posicionY) {
        ocupada = true;
        return ocupada;
      }

      if (pieza.matrizActiva[fil][col] !== 0) {
        //Comprueba la colision con el lado izquierdo de la pieza. La variable izquierda === true cuando se pulsa la telca [A, <-]
        if (izquierda && miTablero.matriz[posicionY][posicionX - 1] === 2) {
          ocupada = true;
        }
        //Comprueba la colision con el lado derecho de la pieza. La variable izquierda === true cuando se pulsa la telca [D, ->]
        if (derecha && miTablero.matriz[posicionY][posicionX + 1] === 2) {
          ocupada = true;
        }
        //Comprueba si existe algun obstaculo en el eje Y (abajo)
        if (miTablero.matriz[posicionY + 1][posicionX] === 2) {
          ocupada = true;
        }
      }

    }
  }
  return ocupada;
}

/* *
 * Recorre la matriz del Tablero en busca de una pieza [valor === 1]
 * Si encuentra una casilla === 1, entonces la fija al tablero sustituyendo el valor a 2
 */

function solidificarPieza(tablero, pieza) {
  for (let fil = 0; fil < pieza.matrizActiva.length; fil++) {
    for (let col = 0; col < pieza.matrizActiva[fil].length; col++) {
      const posicionX = col + pieza.x;
      const posicionY = fil + pieza.y;
      if (pieza.matrizActiva[fil][col] === 1) {
        tablero[posicionY][posicionX] = 2;
      }
    }
    /* console.log(pieza.matrizActiva[fil]); */
  }
}

function comprobarLinea(tablero) {
  //Si le pasas un numero a la clase Array, puedes especificar su longitud. 
  //Si lo combinas con fill, crea un array de '0' de la longitud de COLUMNAS.
  const nuevaFila = Array(COLUMNAS).fill(0);
  let recuentoFilas = 0;
  for (let i = tablero.length - 1; i >= 0; i--) {
    const fila = tablero[i].every(casilla => casilla === 2);
    if (fila) {
      tablero.splice(i, 1);
      tablero.unshift([...nuevaFila]);
      recuentoFilas++;
      i++; //Revisamos la misma fila otra vez.
      
      //::::::  LOGICA DEL SCORE o PUNTUACION + Sonido :::::::::
      score += 100;
      puntuacion.innerHTML = score;
      if (recuentoFilas >= 2 && milisegundos <= 1000) {
        milisegundos += 10 + (50 * recuentoFilas);
        recuentoFilas = 0;
        Sonido.playLineaCompletada();
      } else {
        milisegundos -= 50;
        Sonido.playLineaCompletada();
      }
    }
  }
}




/**
 * Recorre las 2 primeras filas en busca de una pieza solidificada.
 * Si existe una pos === 2, entonces el jugador se ha quedado sin espacio y se para la animacion.
 */


function gameOver(idAnimacion = undefined) {
  let terminado = false;
  for (let i = 0; i <= 1; i++) {
    for (let j = 0; j < miTablero.matriz[i].length; j++) {
      if (miTablero.matriz[i][j] === 2) {
        window.cancelAnimationFrame(idAnimacion);
        cancionNormalTheme.stopBackground();
        cancionHardTheme.stopBackground();
        Sonido.playGameOver();
        terminado = true;
      }
    }
  }
  Sonido.playSolidificada();
  return terminado;
}

/**
 * Desplazar de teclas 'invertido' para el modo hard. Es el 'mismo' codigo pero invertido para izquierda y derecha
 */

function desplazarInvertido(tecla) {
  if (tecla.key === 'ArrowDown' || tecla.key === 'ArrowUp') {
    tecla.preventDefault();
  }

  if (animacionRealizada) {
    switch (tecla.key) {
      case "ArrowDown":
      case "s":
      pieza.desplazarAbajo();
      tiempoTranscurrido = Date.now();
        break;
      case "ArrowLeft":
      case "a":
        const LIMITE_TABLERO_DER = pieza.matrizActiva[0].length + pieza.x;
        if (COLUMNAS > LIMITE_TABLERO_DER && !casillaOcupada(false, true)) {
          pieza.desplazarDerecha();
          tiempoTranscurrido = Date.now();
        }
        break;
      case "ArrowRight":
      case "d":
        if (pieza.x > LIMITE_TABLERO_IZQ && !casillaOcupada(true)) {
          pieza.desplazarIzquierda();
          tiempoTranscurrido = Date.now();
        }
        break;
      case "ArrowUp":
      case "w":
        if (!casillaOcupada(true, true)) {
          tiempoTranscurrido = Date.now();
          pieza.undraw();
          pieza.rotarPieza();
          pulsaciones++;
          if (pulsaciones >= 4) {
            pulsaciones = 0;
            tiempoTranscurrido = 0;
          }
        }
        break;
    }
  }
}