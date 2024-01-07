const PIEZAS = [
  ['T', "#E71D36"],
  ['Z', "#FF44FF"],
  ['S', "#F46036"],
  ['J', "yellow"],
  ['L', "#00FF00"],
  ['I', "cyan"],
  ['O', "white"]
]
const img = document.getElementById('imagen');
const LETRAS = "TZSJLIO"
const aleatorio = valor => Math.floor(Math.random() * valor);
/**
 * La clase Bolsa se encarga de generar las 7 piezas del tetris.
 * Las piezas se crean de forma aleatoria, pero el algoritmo asegura que no salgan 2 piezas iguales hasta que se vacie el array/bolsa.
 */
export class Bolsa {
  constructor(){
    this.piezasAleatorias = this.obtenerBolsa();
    this.siguienteLetra;
  }

  /**
   * Clase interna del objeto Bolsa.
   * Copia por valor los elementos del array PIEZAS y las guarda de forma aleatoria en 'nuevaBolsa'.
   */
  obtenerBolsa(){
    const piezas = [...PIEZAS];
    const nuevaBolsa = [];

    for (let i = 0; i < PIEZAS.length; i++) {    
      const indice = aleatorio(PIEZAS.length - i);
      const piezaAleatoria = piezas.splice(indice,1);
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
    const pieza = this.piezasAleatorias[0];
    this.piezasAleatorias.splice(0,1);
    //Obtenemos la siguiente pieza despues de eliminar la actual con splice:
    const siguientePieza = this.piezasAleatorias[0];
    if (siguientePieza !== undefined && LETRAS.includes(siguientePieza[0])){
        let siguienteImagen = `img/${siguientePieza[0]}.png`;
        img.src = siguienteImagen; 
    }
    return pieza;
  }
}

