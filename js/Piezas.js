import { Sonido } from "./Sonido.js"
const PX = 45; //pixeles_dimensiones de cada casilla
const COLUMNAS = 10;
/**
 * @Params canvas, matriz del tablero, array de pieza, coordenadas (x,y)
 */
export class Piezas {
  constructor(canvas, tablero, pieza, x, y) {
    this.canvas = canvas;
    this.tablero = tablero.matriz; //obtenemos la matriz de la clase Tablero
    //Parametros de la pieza: color, tipo, pos...
    this.tipo = pieza[0];
    this.color = pieza[1];
    this.colorBorde = "black";
    //Ubicacion de cada pieza
    this.x = x;
    this.y = y;
    //Matriz que guarda el resultado de crearPieza()
    this.matrizPiezas = [];
    this.posActiva = 0;
    //Crea una pieza segun la propiedad 'tipo'
    this.crearPieza();
    this.matrizActiva = this.matrizPiezas[this.posActiva];

  }

  /**
   * Dibuja una pieza segun las coordenadas (x,y) y la agrega al tablero.
   */
  draw() {
    this.canvas.strokeStyle = this.colorBorde;
    this.canvas.fillStyle = this.color;

    for (let fil = 0; fil < this.matrizActiva.length; fil++) {
      for (let col = 0; col < this.matrizActiva[fil].length; col++) {
        const posicionX = PX * (col + this.x);
        const posicionY = PX * (fil + this.y);
        
        if (this.matrizActiva[fil][col] > 0) {
          this.canvas.fillRect(posicionX, posicionY, PX, PX);
          this.canvas.strokeRect(posicionX, posicionY, PX, PX);
          this.tablero[fil + this.y][col + this.x] = 1; //añade la casilla dibujada de la pieza en el tablero
        }
      }
    }
  }


  /**
   * Borra una pieza segun las coordenadas (x,y) y la elimina del tablero. 
   * Se utiliza para actualizar la posicion de la pieza.
   */
  undraw() {
    this.canvas.strokeStyle = "#6A78F0";
    this.canvas.fillStyle = "#00202E"; //relleno
  
    for (let fil = 0; fil < this.matrizActiva.length; fil++) {
      for (let col = 0; col < this.matrizActiva[fil].length; col++) {
        const posicionX = PX * (col + this.x);
        const posicionY = PX * (fil + this.y);

        if (this.matrizActiva[fil][col] === 1) {
          this.canvas.clearRect(posicionX, posicionY, PX, PX);
          this.canvas.fillRect(posicionX, posicionY, PX, PX);
          this.canvas.strokeRect(posicionX, posicionY, PX, PX);
          this.tablero[fil + this.y][col + this.x] = 0; //elimina el valor de la pieza en el tablero
        }
      }
    }
  }

  desplazarIzquierda() {
    this.undraw();
    this.x--;
    this.draw();
  }

  desplazarDerecha() {
    this.undraw();
    this.x++;
    this.draw();
  }

  desplazarAbajo() {
    this.undraw();
    this.y++;
    this.draw();
  }

  /**
   * Simula la siguiente posicion de la pieza con su siguiente rotacion de matrizActiva.
   * Solo aumenta (cambia de rotacion) si NO existe colision o si NO existe una casilla ocupada en el rango de la fila (dentro del tablero)
   * */
  rotarPieza() {
    // Almacenamos la posición y la longitud antes de la rotación
    const antiguaX = this.x;
    const siguienteIndice = (this.posActiva + 1) % 4;
    const nuevaMatrizActiva = this.matrizPiezas[siguienteIndice];
    const siguientePos = antiguaX + nuevaMatrizActiva[0].length;

    // Guardamos el booleano despues de comprobar si hay alguna casilla sólida
    const colisionCasillasSolidas = this.verificarColisionCasillasSolidas(nuevaMatrizActiva);

    // Si hay colisión con columna o casilla, redibujamos y terminamos
    if ((siguientePos > COLUMNAS) || colisionCasillasSolidas) {
      this.draw();
      return 0;
    }

    // Aplicamos la rotación si no hay colisión
    if (this.posActiva === 3) {
      this.posActiva = 0;
    } else {
      this.posActiva++;
    }

    this.matrizActiva = this.matrizPiezas[this.posActiva];
    this.draw();
    Sonido.playRotacion();
  }
  /**
   * Usamos la matriz con la posicion simulada en el futuro para obtener el rango de colision para piezas como 'I' o 'L'.
   */
  verificarColisionCasillasSolidas(matriz) {
    for (let fil = 0; fil < matriz.length; fil++) {
      for (let col = 0; col < matriz[fil].length; col++) {
        const posicionX = col + this.x;
        const posicionY = fil + this.y;

        if (matriz[fil][col] !== 0) {
          // Verifica la colisión con casillas solidificadas en un rango 3x3
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const offsetX = posicionX + j;
              const offsetY = posicionY + i;

              if (this.tablero[offsetY] && this.tablero[offsetY][offsetX] !== undefined
                && this.tablero[offsetY][offsetX] === 2) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }



  /**
   * Crea las distintas piezas y sus diferentes variantes.
   * Las piezas se guardan en la variable 'matrizActiva'.
   * Las variantes se manejan con una variable llamada 'posActiva'.
   */
  crearPieza() {
    switch (this.tipo) {
      case 'Z': this.crearZ();
        break;
      case 'S': this.crearS();
        break;
      case 'J': this.crearJ();
        break;
      case 'T': this.crearT();
        break;
      case 'L': this.crearL();
        break;
      case 'I': this.crearI();
        break;
      case 'O': this.crearO();
        break;
    }
  }

  crearO() {
    const O = [
      [
        [1, 1],
        [1, 1]
      ],
      [
        [1, 1],
        [1, 1]
      ],
      [
        [1, 1],
        [1, 1]
      ],
      [
        [1, 1],
        [1, 1]
      ]
    ]

    this.matrizPiezas = O;
  }

  crearI() {
    //para llegar a la pieza 0, matrizPiezas[0]
    const I = [
      [
        [1, 1, 1, 1]
      ],
      [
        [1],
        [1],
        [1],
        [1]
      ],
      [
        [1, 1, 1, 1]
      ],
      [
        [1],
        [1],
        [1],
        [1]
      ]
    ]

    this.matrizPiezas = I;
  }

  crearL() {
    const L = [
      [
        [1, 1, 1],
        [1, 0, 0]
      ], [
        [1, 1],
        [0, 1],
        [0, 1]
      ], [
        [0, 0, 1],
        [1, 1, 1]
      ], [
        [1, 0],
        [1, 0],
        [1, 1]
      ]
    ]

    this.matrizPiezas = L;
  }

  crearJ() {
    const J = [
      [
        [1, 1, 1],
        [0, 0, 1]
      ], [
        [0, 1],
        [0, 1],
        [1, 1]
      ], [
        [1, 0, 0],
        [1, 1, 1]
      ], [
        [1, 1],
        [1, 0],
        [1, 0]
      ]
    ]

    this.matrizPiezas = J;
  }

  crearZ() {
    const Z = [
      [
        [1, 1, 0],
        [0, 1, 1]
      ], [
        [0, 1],
        [1, 1],
        [1, 0]
      ], [
        [1, 1, 0],
        [0, 1, 1]
      ], [
        [0, 1],
        [1, 1],
        [1, 0]
      ]
    ]

    this.matrizPiezas = Z;
  }

  crearS() {
    const S = [
      [
        [0, 1, 1],
        [1, 1, 0]
      ], [
        [1, 0],
        [1, 1],
        [0, 1]
      ], [
        [0, 1, 1],
        [1, 1, 0]
      ], [
        [1, 0],
        [1, 1],
        [0, 1]
      ]
    ]

    this.matrizPiezas = S;
  }

  crearT() {
    const T = [
      [
        [0, 1, 0],
        [1, 1, 1]
      ], [
        [1, 0],
        [1, 1],
        [1, 0]
      ], [
        [1, 1, 1],
        [0, 1, 0]
      ], [
        [0, 1],
        [1, 1],
        [0, 1]
      ]
    ]

    this.matrizPiezas = T;
  }

}
