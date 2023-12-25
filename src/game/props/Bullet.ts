import Game from "../Game";
import { BaseCanvasClass, BaseSlowedAnimation } from "../helpers";

/**
 * Bullet is a fireball that can destroy any kind of enemies
 *
 * Handles bullet updating/drawing
 */
export default class Bullet
  extends BaseSlowedAnimation
  implements BaseCanvasClass
{
  image = document.getElementById("fireball");

  x: number;
  y: number;
  frameX = 0;
  frameY = 0;
  frameXLimit = 3;
  speedX = Math.random() * 0.2 + 2.8; // step for change horizontal position
  width = 36.25;
  height = 20;

  rightLimitCoord: number; // right limit when bullet should be removed
  markForDeletion = false;

  constructor(
    public game: Game,
    public playerX: number,
    public playerY: number,
  ) {
    super();
    this.x = playerX; // Initial horizontal position of bullet
    this.y = playerY; // Initial vertical position of bullet
    this.rightLimitCoord = this.game.width * 0.8;
  }

  update(deltaTime: number) {
    // moves bullet to the right horizontally
    this.x += this.speedX;

    if (this.frameX >= this.frameXLimit) this.frameX = 0;
    this.updateSlowedAnimation(deltaTime);

    // marks bullet for deletion, when it riches 80% of game width
    if (this.x > this.rightLimitCoord) this.markForDeletion = true;
  }

  draw(context: CanvasRenderingContext2D) {
    // draw bullet
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

    // add border incase debug mode enabled
    if (this.game.debugMode)
      context.strokeRect(this.x, this.y, this.width, this.height); // draw border around bullet
  }
}
