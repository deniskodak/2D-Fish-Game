import Game from "../Game";
import { Enemy } from "../helpers";

export default class Angler1 extends Enemy {
  constructor(public game: Game) {
    super(game, 169, 228);
    this.image = document.getElementById("angler1") as HTMLImageElement;
    this.frameY = Math.round(Math.random() * 2);
    this.lives = 5;
    this.score = this.lives;
  }
}
