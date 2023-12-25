import Game from "../Game";
import { Enemy, ENEMY_TYPES } from "../helpers";

export default class LuckyFish extends Enemy {
  constructor(public game: Game) {
    super(game, 95, 99);
    this.image = document.getElementById("lucky") as HTMLImageElement;
    this.frameY = Math.round(Math.random());
    this.lives = 5;
    this.score = 15;
    this.type = ENEMY_TYPES.LUCKY;
  }
}
