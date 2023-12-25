import Game from "../Game";
import { BaseCanvasClass } from "../helpers";

/**
 * Gear is a broken part that falls from enemy when it`s destroyed or hitted
 *
 * Handles gear updating/drawing, changing rotating and bouncing
 */
export default class Gear implements BaseCanvasClass {
  image = document.getElementById("gears");

  x: number;
  y: number;
  frameX = Math.round(Math.random() * 2);
  frameY = Math.round(Math.random() * 2);
  spriteSize = 50; // size of single gear in sprite
  sizeModifier = +(Math.random() * 0.5 + 0.5).toFixed(1); // modifier to make each gear with unique size
  width = this.spriteSize * this.sizeModifier; // final size of gear
  height = this.width; // final size of gear
  gravity = 0.5; // additional step for change vertical position
  speedX = Math.random() * 6 - 3; // step for change horizontal position
  speedY = Math.random() * -15; // step for change vertical position

  markForDeletion = false;

  angle = 0; // current rotate angle of gear
  rotateSpeed = Math.random() * 0.2 - 0.1; // step for change rotate angle

  bouncedAmount = 0; // current amount of bounced times
  bouncedTimeLimit = 2; // limit for maximal amount of bounce
  bottomBouncedTriggerPosition = Math.random() * 80 + 60; // bottom game position when bounce should triggered

  /**
   * @param game - main game instance
   * @param x - current enemy x position
   * @param y - current enemy y position
   */
  constructor(public game: Game, x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.angle += this.rotateSpeed;
    this.speedY += this.gravity;
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;

    // define should gear bounce
    if (
      this.y > this.game.height - this.bottomBouncedTriggerPosition &&
      this.bouncedAmount <= this.bouncedTimeLimit
    ) {
      this.bouncedAmount++;
      this.speedY *= -0.5;
    }

    // define should gear be removed
    if (this.y > this.game.height + this.height || this.x < -this.width) {
      this.markForDeletion = true;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y); // define center of rotating
    context.rotate(this.angle); // define rotate angle

    context.drawImage(
      this.image as CanvasImageSource,
      this.frameX * this.spriteSize,
      this.frameY * this.spriteSize,
      this.spriteSize,
      this.spriteSize,
      this.width * -0.5, // centered gear rotating center
      this.height * -0.5, // centered gear rotating center
      this.width,
      this.height,
    );
    context.restore();
  }
}
