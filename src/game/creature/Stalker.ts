import { Enemy } from "../helpers";

export default class Stalker extends Enemy {
  constructor(public game: any) {
    super(game, 123, 243);
    this.speedX = Math.random() * -1 - 1;
    this.image = document.getElementById("stalker") as HTMLImageElement;
    this.lives = 5;
    this.score = this.lives;
  }
}
