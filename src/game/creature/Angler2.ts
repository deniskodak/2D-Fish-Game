import Game from "../Game";
import { Enemy } from "../helpers";

export default class Angler2 extends Enemy {
  constructor(public game: Game) {
    super(game, 165, 213);
    this.image = document.getElementById("angler2") as HTMLImageElement;
    this.frameY = Math.round(Math.random());
    this.lives = 6;
    this.score = this.lives;
  }
}
