import Game from "../Game";

/**
 * Abstract class for all canvas elements within the project
 */
export default class BaseCanvasClass {
  game: Game; // instance of main game entity
  image: HTMLElement; // sprite of canvas element
  x: number; // horizontal position for element;
  y: number; // vertical position for element;
  frameX: number; // index of col in sprite element
  frameY: number; // index of row in sprite element
  frameXLimit?: number; // amount of cols in sprite
  frameYLimit?: number; // amount of rows in sprite
  width: number; // width of col in sprite
  height: number; // height of row in sprite
  markForDeletion?: boolean; // indicates if element should be removed on next animation iteration

  /**
   * Handles updating coords for canvas entity
   * @param deltaTime - current difference between last animation timestamp and current, in ms
   */
  update(deltaTime?: number): void {}

  /**
   * Handles rendering of canvas entity
   * @param context - canvas 2d context that will render entity
   */
  draw(context?: CanvasRenderingContext2D): void {}
}
