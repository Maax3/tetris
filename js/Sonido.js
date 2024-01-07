
export class Sonido { 
  constructor(url){
    this.audio = new Audio(`${url}`);
  }
  
  playBackground() {
    this.audio.loop = true;
    this.audio.play();
  }

  stopBackground() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  static playRotacion() {
    const audio = new Audio('audio/rotacionPiezas.mp3');
    audio.play();
  }

  static playSolidificada() {
    const audio = new Audio('audio/contactoPiezas.mp3');
    audio.play();
  }

  static playLineaCompletada(){
    const audio = new Audio('audio/lineaCompleta.mp3');
    audio.play();
  }

  static playGameOver(){
    const audio = new Audio('audio/gameOver.mp3');
    audio.play();
  }

  static playSeleccionHard(){
    const audio = new Audio('audio/seleccionarHard.mp3');
    audio.play();
  }
}

export const cancionNormalTheme = new Sonido("audio/tetrisNormalBackground.mp3");
export const cancionHardTheme = new Sonido("audio/tetrisHardBackground.mp3");