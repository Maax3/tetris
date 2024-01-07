
export class Tablero {
  constructor(canvas, dimensionCasilla, filas, columnas) {
    this.canvas = canvas;
    this.canvas.strokeStyle = "#6A78F0" //bordes 
    this.canvas.fillStyle = "#00202E" //relleno
    //dimensiones del tablero
    this.px = dimensionCasilla;
    this.filas = filas;
    this.columnas = columnas;
    //creacion e iniciación del tablero
    this.matriz = [];
    this.casillas = [];
    this.setTablero();
  }

  setTablero() {
    for (let fil = 0; fil < this.filas; fil++) {
      this.casillas = [];
      for (let col = 0; col < this.columnas; col++) {
        this.casillas.push(0);
        this.canvas.fillRect(this.px * col, this.px * fil, this.px, this.px);
        this.canvas.strokeRect(this.px * col, this.px * fil, this.px, this.px); //pos y dimensiones de la casilla
      }
      this.matriz.push(this.casillas); //añadimos la fila [0,0,0,0...]
    }
  }

  /**
   * Limpia el tablero entero y despues repinta todas las casillas del tablero
   */

  repintar() {
    
    for (let fil = 0; fil < this.filas; fil++) {
      for (let col = 0; col < this.columnas; col++) {
        //casillas del tablero vacias
        if (this.matriz[fil][col] === 0){
          this.canvas.strokeStyle = "#6A78F0";  
          this.canvas.fillStyle = "#00202E";
        }
         //casillas del tablero rellenas (fichas)
        else if(this.matriz[fil][col] === 2){
          this.canvas.strokeStyle = "black";
          this.canvas.fillStyle = "#98FB98";
          this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        this.canvas.fillRect(this.px * col, this.px * fil, this.px, this.px);
        this.canvas.strokeRect(this.px * col, this.px * fil, this.px, this.px); //pos y dimensiones de la casilla
      }
    }
  }
}