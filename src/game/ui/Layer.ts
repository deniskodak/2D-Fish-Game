import Game from "../Game";
import { BaseCanvasClass } from "../helpers";

/**
 * Layers are game background view with paralax horizontal scrolling effect
 *
 * Handles layers updating/drawing
 */
export default class Layer
  implements Omit<BaseCanvasClass, "frameX" | "frameY">
{
  width = 1768;
  height = 500;
  x = 0;
  y = 0;
  speedX: number; // speed of layer left moving

  constructor(
    public game: Game,
    public image: HTMLElement,
    speedModifier: number,
  ) {
    this.speedX = speedModifier;
  }

  update() {
    // reset position of layer if it is out of screen
    if (this.x <= -this.game.width) this.x = 0;
    // moves to the left with applied speed modifier to the game speed
    this.x -= this.speedX * this.game.speed;
  }

  draw(context: CanvasRenderingContext2D) {
    // draws layer image
    context.drawImage(this.image as CanvasImageSource, this.x, this.y);
    // draws second layer image for smooth infinity repeating
    context.drawImage(
      this.image as CanvasImageSource,
      this.x + this.width,
      this.y,
    );
  }
}
