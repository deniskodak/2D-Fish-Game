import Game from "../Game";
import { BaseCanvasClass, BaseSlowedAnimation } from "../helpers";

/**
 * Shield protects player from enemy touching
 *
 * Handles player shield updating/drawing
 */
export default class Shield
  extends BaseSlowedAnimation
  implements BaseCanvasClass
{
  image = document.getElementById("shield");

  x: number;
  y: number;
  width: number;
  height: number;
  frameX = 0;
  frameY = 0;
  frameXLimit = 24;

  markForDeletion = false;

  constructor(public game: Game) {
    super();
    this.width = this.game.player.width;
    this.height = this.game.player.height;
  }

  update(deltaTime: number) {
    this.updateSlowedAnimation(deltaTime);
  }

  draw(context: CanvasRenderingContext2D) {
    // defines shield coords based on current player coords
    this.x = this.game.player.x;
    this.y = this.game.player.y;

    // draws player shield
    context.drawImage(
      this.image as CanvasImageSource,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  reset() {
    this.frameX = 0;
    this.game.soundController.playShield();
  }
}
