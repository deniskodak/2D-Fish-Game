import Game from "../Game";
import { Enemy, ENEMY_TYPES } from "../helpers";

export default class MoonFish extends Enemy {
  constructor(public game: Game) {
    super(game, 240, 227);
    this.speedX = Math.random() * -1.2 - 2;
    this.image = document.getElementById("moonfish") as HTMLImageElement;
    this.lives = 10;
    this.score = this.lives;
    this.type = ENEMY_TYPES.MOONFISH;
  }
}
