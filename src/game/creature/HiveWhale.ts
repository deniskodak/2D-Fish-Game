import Game from "../Game";
import { Enemy, ENEMY_TYPES } from "../helpers";

export default class HiveWhale extends Enemy {
  constructor(public game: Game) {
    super(game, 227, 400);
    this.speedX = Math.random() * -1.2 - 0.2;
    this.image = document.getElementById("whale") as HTMLImageElement;
    this.frameY = 0;
    this.lives = 20;
    this.score = this.lives;
    this.type = ENEMY_TYPES.WHALE;
  }
}
