/**
 * Esta clase se encarga de alojar los metodos de localStorage que permiten almacenar la puntuacion obtenida
 * También contendrá los botones de la ventana modal 'Game Over'
 */

//Boton RESET + evento para refrescar la pagina
const btnRestart = document.getElementById('btnRestart');
btnRestart.addEventListener('click', () => location.reload());
//Boton BORRAR + evento para limpiar todos los datos de las partidas anteriores y refrescar la pagina
const btnBorrarPuntos = document.getElementById('btnBorrarPuntos');
btnBorrarPuntos.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});
//TABLA 
const tablaPuntos = document.getElementById('tablaPuntos');

export class Puntuacion {

  /**
   * Esta funcion actúa como una 'mini-base de datos' que guarda la puntuacion del jugador
   * En cada refresco de pagina, se crea una clave/valor con partida{aux} 
   * {aux} es el numero de veces que se ha recargado la pagina y el valor es el 'score' que se obtiene en el gameOver();
   * Despues de guardar los datos, se recorre el objeto localStorage y se hace un appendChild a una tabla HTML del index mostrando todas las partidas y su puntuacion.  
   */

  static getPuntos(score) {
    if (localStorage.getItem('partida0') === null) {
      localStorage.setItem('aux', 0);
    }
    let aux = localStorage.getItem('aux');
    localStorage.setItem(`partida${aux}`, score);
    let nextPartida = localStorage.getItem('aux');
    localStorage.setItem('aux', Number(++nextPartida));
    
    for (const key in localStorage) {
      if (key.includes('partida')) {
        let n = key.substring(7);
        tablaPuntos.insertAdjacentHTML('beforeend', `
            <tr>
            <td>partida ${n}</td>
            <td>${localStorage.getItem(key)}</td>
            </tr>
          `);
      }
    }
  }

  /**
   * Recorremos el objeto localStorage buscando todas las claves que incluyan 'partida'
   * Convertimos su valor a número y lo guardamos en el array de puntacion
   * Filtramos con Math.max y obtenemos la puntuación maxima que se pintara al final de la partida (gameOver) = true
   */

  static getPuntosMaximos() {
    const puntuacion = [];
    for (const key in localStorage) {
      if (key.includes('partida')) {
        let puntos = Number(localStorage.getItem(key));
        puntuacion.push(puntos);
      }
    }
    return Math.max(...puntuacion);
  }

}