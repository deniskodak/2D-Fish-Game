import { BaseCanvasClass } from "../helpers";
import { Bullet } from "../props";
import { INTERACTIVE_KEYS } from "../controllers";
import Game from "../Game";

/**
 * Player is a main creature that fights against enemies
 *
 * Handles player creature updating/drawing, shooting, movement, power mode
 */
export default class Player implements BaseCanvasClass {
  image = document.getElementById("player");

  x = 20;
  y = 100;
  width = 120;
  height = 190;
  frameX = 0;
  frameY = 0;
  frameXLimit = 37;

  bullets: Bullet[] = []; // list of shown bullets

  powerUp = false; // indicates if power mode enabled
  powerTimer = 0; // current power mode duration
  powerLimit = 10000; // maximal duration of power mode, in ms

  bottomLimitCoord: number; // maximal bottom coord for movement
  topLimitCoord = -this.height * 0.5; // maximal top coord for movement
  speedY = 0; // current speed for vertical position updating
  speedStep = 2; // step for vertical speed updating

  constructor(public game: Game) {
    this.game = game;
    this.bottomLimitCoord = game.height - this.height * 0.5;
  }

  update(deltaTime: number) {
    // define direction of the creature next moving
    if (this.game.keyboardKeys.includes(INTERACTIVE_KEYS.MOVE_UP))
      this.speedY = -this.speedStep;
    else if (this.game.keyboardKeys.includes(INTERACTIVE_KEYS.MOVE_DOWN))
      this.speedY = this.speedStep;
    else this.speedY = 0; // stops the creature moving

    // check if creature is reached the top/bottom limits
    if (this.y > this.bottomLimitCoord) this.y = this.bottomLimitCoord;
    else if (this.y < this.topLimitCoord) this.y = this.topLimitCoord;
    // moves the creature vertically
    else this.y += this.speedY;

    this.updateAndRemoveMarkedBullets(deltaTime);

    // animate player image
    if (this.frameX < this.frameXLimit) this.frameX++;
    else this.frameX = 0;

    // power up boost
    if (this.powerUp) {
      if (this.powerTimer < this.powerLimit) {
        // increase power up timer
        this.powerTimer += deltaTime;
        // change row in sprite to update player canvas element
        this.frameY = 1;
        // increase ammo filling
        if (this.game.ammo < this.game.ammoMaxLimit) {
          this.game.ammo += 0.1;
        }
      } else {
        // reset power timer
        this.powerTimer = 0;
        // disabled power up mode
        this.powerUp = false;
        this.game.soundController.playPowerDown();
        // change row in sprite to update player canvas element
        this.frameY = 0;
      }
    }
  }

  draw(context: CanvasRenderingContext2D) {
    // draws current bullets
    this.bullets.forEach((bullet) => bullet.draw(context));

    // draws player creature
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

    // add border incase debug mode enabled
    if (this.game.debugMode) {
      context.fillStyle = "black";
      // draw border around creature
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Updates bullets coords and removes marked bullets from the bullets list
   */
  updateAndRemoveMarkedBullets(deltaTime: number) {
    this.bullets = this.bullets.filter((bullet) => {
      // update bullet positions
      if (!bullet.markForDeletion) bullet.update(deltaTime);
      return !bullet.markForDeletion;
    });
  }

  /**
   * Add new bullet to bullets list with top coords, trigger bottom shooting incase power mode enabled
   */
  shootTop() {
    // check if ammo available
    if (this.game.ammo === 0) return;

    this.game.ammo -= 1;

    this.game.soundController.playShot();

    this.bullets.push(new Bullet(this.game, this.x + 80, this.y + 30));

    if (this.powerUp) this.shootBottom();
  }

  /**
   * Add new bullet to bullets list with bottom coords
   */
  shootBottom() {
    // check if ammo available
    if (this.game.ammo === 0) return;
    this.bullets.push(new Bullet(this.game, this.x + 80, this.y + 175));
  }

  /**
   *  Handle power up mode enabling
   */
  boostPowerUp() {
    this.game.soundController.playPowerUp();
    // reset power up timer incase we are already in power up mode
    this.powerTimer = 0;
    // enable power up mode
    this.powerUp = true;
    // fill up fully game ammo unless it full already
    if (this.game.ammo < this.game.ammoMaxLimit) {
      this.game.ammo = this.game.ammoMaxLimit;
    }
  }
}
