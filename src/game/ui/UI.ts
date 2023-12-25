import Game from "../Game";

/**
 * UI is responsible to render game score, ammo amount and game timer
 *
 * Handles game stat drawing/updating
 */
export default class UI {
  fontSize = 25; // font size for stats
  fontFamily = "Bangers"; // font family for stats
  color = "white"; // color of each ammo rects

  ammoX: number; // horizontal coords for ammo rects
  ammoY: number; // vertical coords for ammo rects
  ammoGap = 10; // gap between ammo reacts
  ammoRectWidth = 6; // ammo single rect width
  ammoRectHeight = 20; // ammo single rect height

  /**
   * @param game - instance of main game entity
   * @param x - initial player x position
   * @param y - initial player y position
   */
  constructor(public game: Game, public x: number, public y: number) {}

  draw(context: CanvasRenderingContext2D) {
    // creating snapshot of previous canvas settings
    context.save();

    // shadow x blur size
    context.shadowOffsetX = 2;
    // shadow y blur size
    context.shadowOffsetY = 2;
    // apply color for shadow for ammo and score
    context.shadowColor = "black";
    // set color for ammo and score rect
    context.fillStyle = this.color;

    // draws score stat
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillText(
      `Score: ${this.game.score}/${this.game.winningScore}`,
      this.x,
      this.y - 70,
    );

    // changing ammo reacts color incase power mode enabled
    if (this.game.player.powerUp) context.fillStyle = "#ffffbd";

    // draws ammo stat
    for (let i = 0; i < this.game.ammo; i++) {
      context.fillRect(
        this.x + this.ammoGap * i,
        this.y - 50,
        this.ammoRectWidth,
        this.ammoRectHeight,
      );
    }

    // reset color if power mode enabled
    if (this.game.player.powerUp) context.fillStyle = this.color;

    // draws timer stat
    const formattedTime = (this.game.gameTimer * 0.001).toFixed(1);
    context.fillText("Timer: " + formattedTime, 20, 100);

    // draws game over messages
    if (this.game.gameOver) {
      let title, subTitle;

      if (this.game.score >= this.game.winningScore) {
        title = "Most Wondrous!";
        subTitle = "Well done explorer!";
      } else {
        title = "Blazes!";
        subTitle = "Get my repair kit and try again!";
      }

      // styles for title
      context.font = `${70}px ${this.fontFamily}`;
      // render title message
      context.fillText(
        title,
        this.game.width * 0.4,
        this.game.height * 0.5 - 20,
      );

      // styles for subtitle
      context.font = `${25}px ${this.fontFamily}`;
      // render sub title message
      context.fillText(
        subTitle,
        this.game.width * 0.4,
        this.game.height * 0.5 + 20,
      );
    }

    // restore previous saved canvas snapshot
    context.restore();
  }
}
