import Game from "../Game";
import { Explosion } from "../helpers";

/**
 * fire explosion is fire that appears after enemy destroyed
 */
export default class FireExplosion extends Explosion {
  /**
   * @param game - instance of main game entity
   * @param x - last enemy x position
   * @param y - last enemy y position
   */
  constructor(public game: Game, x: number, y: number) {
    super(game, x, y);
    this.image = document.getElementById("fire") as HTMLImageElement;
  }
}
