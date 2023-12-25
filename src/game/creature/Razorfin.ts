import Game from "../Game";
import { Enemy } from "../helpers";

export default class RazorFin extends Enemy {
  constructor(public game: Game) {
    super(game, 149, 187);
    this.speedX = Math.random() * -1 - 1;
    this.image = document.getElementById("razorfin") as HTMLImageElement;
    this.lives = 7;
    this.score = this.lives;
  }
}
