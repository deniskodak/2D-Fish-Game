import Game from "../Game";
import BaseCanvasClass from "./BaseCanvasElement";
import BaseSlowedAnimation from "./BaseSlowedAnimation";

/**
 * Explosion is smoke/fire effect that appears when enemy is destroyed
 *
 * Handles explosion updating/drawing
 */
export default class Explosion
  extends BaseSlowedAnimation
  implements BaseCanvasClass
{
  image: HTMLImageElement;
  width = 200;
  height = 200;
  x: number;
  y: number;
  frameX = 0;
  frameY = 0;
  frameXLimit = 8;

  markForDeletion = false;
  /**
   * @param game - instance of main game entity
   * @param x - last enemy x position
   * @param y - last enemy y position
   */
  constructor(public game: Game, x: number, y: number) {
    super();
    this.x = x - this.height * 0.5; // centered horizontal position
    this.y = y - this.width * 0.5; // centered vertical position
  }

  update(deltaTime: number) {
    this.updateSlowedAnimation(deltaTime);

    // moves explosion element to the left
    this.x -= this.game.speed;
    // marks for deletion when animation frames ended
    if (this.frameX > this.frameXLimit) this.markForDeletion = true;
  }

  draw(context: CanvasRenderingContext2D) {
    // draws explosion effect
    context.drawImage(
      this.image as CanvasImageSource,
      this.frameX * this.width,
      this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}
