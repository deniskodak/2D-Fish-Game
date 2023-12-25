import Game from "../Game";
import Layer from "./Layer";

/**
 * Stick all background layers together for 3d atmosphere
 *
 * Handles layers drawing/updating, expect layer4 to follow element z position
 */
export default class Background {
  layer1: Layer; // furthest clouds layer
  layer2: Layer; // city layer
  layer3: Layer; // street layer
  layer4: Layer; // nearest gears layer
  layers: Layer[]; // list of background layers

  constructor(public game: Game) {
    this.layer1 = new Layer(game, document.getElementById("layer1"), 0.2);
    this.layer2 = new Layer(game, document.getElementById("layer2"), 0.4);
    this.layer3 = new Layer(game, document.getElementById("layer3"), 1);
    this.layer4 = new Layer(game, document.getElementById("layer4"), 1.5);
    this.layers = [this.layer1, this.layer2, this.layer3];
  }

  /*
   * Updates each layer position, expect layer4
   */
  update() {
    this.layers.forEach((layer) => layer.update());
  }

  /*
   * Draws each layer, expect layer4
   */
  draw(context: CanvasRenderingContext2D) {
    this.layers.forEach((layer) => layer.draw(context));
  }
}
