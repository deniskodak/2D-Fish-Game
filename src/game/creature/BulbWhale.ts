import Game from "../Game";
import { Enemy, ENEMY_TYPES } from "../helpers";

export default class BulbWhale extends Enemy {
  constructor(public game: Game) {
    super(game, 219, 270);
    this.speedX = Math.random() * -1.2 - 0.2;
    this.frameY = Math.round(Math.random());
    this.image = document.getElementById("bulbwhale") as HTMLImageElement;
    this.lives = 20;
    this.score = this.lives;
    this.type = ENEMY_TYPES.WHALE;
  }
}
