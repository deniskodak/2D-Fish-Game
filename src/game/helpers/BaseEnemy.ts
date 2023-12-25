import Game from "../Game";
import BaseCanvasClass from "./BaseCanvasElement";

/**
 * Possible enemy types
 */
export enum ENEMY_TYPES {
  DEFAULT = "default",
  LUCKY = "lucky",
  MOONFISH = "moonfish",
  WHALE = "whale",
  DRONE = "drone",
}

/**
 * Enemy is a creature that goes to the player creature
 *
 * Handles enemy creature updating/drawing
 */
export default class Enemy implements BaseCanvasClass {
  image: HTMLImageElement;

  x: number;
  y: number;
  frameX = 0;
  frameY = 0;
  frameXLimit = 37;
  speedX = Math.random() * -1.5 - 0.5; // step for change horizontal position

  lives: number; // indicates how many bullets it needed to be destroyed
  score: number; // indicates how many score enemy costs
  markForDeletion = false;

  type: ENEMY_TYPES = ENEMY_TYPES.DEFAULT; // indicates type of enemy, different enemies has addition power

  constructor(public game: Game, public height: number, public width: number) {
    this.x = game.width; // initial horizontal coord, equals to width of game board
    this.y = Math.random() * this.game.height * 0.95 - this.height; // initial vertical coord, limited to 95% height of game
  }

  update() {
    this.x += this.speedX - this.game.speed; // moves creature to the left

    if (this.x + this.width < 0) this.markForDeletion = true; // mark as deleted for rects that reached left border of game board

    if (this.frameX >= this.frameXLimit) this.frameX = 0;
    else this.frameX++;
  }

  draw(context: CanvasRenderingContext2D) {
    // add border and lives counter incase debug mode enabled
    if (this.game.debugMode) {
      context.strokeRect(this.x, this.y, this.width, this.height); // render border around enemy creature
      context.font = "20px Bangers"; // font style for lives counter
      context.fillText(String(this.lives), this.x, this.y); // lives counter above the creature
    }

    // draws enemy creature
    context.drawImage(
      this.image,
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
}
