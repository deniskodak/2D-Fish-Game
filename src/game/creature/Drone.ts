import Game from "../Game";
import { Enemy, ENEMY_TYPES } from "../helpers";

export default class Drone extends Enemy {
  /**
   * @param game - instance of main game entity
   * @param x - last whale x position
   * @param y - last whale y position
   */
  constructor(public game: Game, x: number, y: number) {
    super(game, 95, 115);
    this.x = x;
    this.y = y;
    this.frameY = Math.round(Math.random());
    this.speedX = Math.random() * -4.2 - 0.5;
    this.image = document.getElementById("drone") as HTMLImageElement;
    this.lives = 3;
    this.score = this.lives;
    this.type = ENEMY_TYPES.DRONE;
  }
}
