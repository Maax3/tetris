/**
 * La clase Bolsa se encarga de generar las 7 piezas del tetris y mostrar la imagen de la siguiente pieza.
 * Las piezas se crean de forma aleatoria, pero el algoritmo asegura que no salgan 2 piezas iguales hasta que se vacie el array/bolsa.
 */

const PIEZAS = [
  ['T', "#E71D36"],
  ['Z', "#FF44FF"],
  ['S', "#F46036"],
  ['J', "yellow"],
  ['L', "#00FF00"],
  ['I', "cyan"],
  ['O', "white"]
]
//Imagen a usar para mostrar que pieza va ser la siguiente, ej: cuadrado = O.png
const img = document.getElementById('imagen');
const LETRAS = "TZSJLIO"
const aleatorio = valor => Math.floor(Math.random() * valor);

export class Bolsa {
  constructor(){
    this.piezasAleatorias = this.obtenerBolsa();
    this.siguienteLetra;
  }

  /**
   * Metodo interno del objeto Bolsa.
   * Copia por valor los elementos del array PIEZAS y las guarda de forma aleatoria en 'nuevaBolsa'.
   */
  obtenerBolsa(){
    const copia = [...PIEZAS];
    const nuevaBolsa = [];

    for (let i = 0; i < copia.length;) {    
      const indice = aleatorio(copia.length);
      const piezaAleatoria = copia.splice(indice,1);
      nuevaBolsa.push(...piezaAleatoria);
    }
    return nuevaBolsa;
  }

  /**
   * A partir de la matriz 'nuevaBolsa' se van retirando y devolviendo las piezas.
   * Cuando no haya mas piezas/elementos dentro del array, lo sobreescribe generando una nueva bolsa.
   * 
   * El metodo también es capaz de mostrar la siguiente pieza de la bolsa accediendo a la siguiente posición después de splice() 
   * y sobreescribiendo el atributo 'src' de la etiquta <img>.
   */
 
  obtenerPieza(){
    if (this.piezasAleatorias.length === 0){
      this.piezasAleatorias = this.obtenerBolsa();
    }
    const pieza = this.piezasAleatorias.splice(0,1);
    //Obtenemos la siguiente pieza despues de eliminar la actual con splice:
    const siguientePieza = this.piezasAleatorias[0];
    if (siguientePieza !== undefined && LETRAS.includes(siguientePieza[0])){
        let siguienteImagen = `img/${siguientePieza[0]}.png`;
        img.src = siguienteImagen; 
    }
    return pieza;
  }
}

