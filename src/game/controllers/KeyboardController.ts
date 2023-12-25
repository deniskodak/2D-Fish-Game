import Game from "../Game";

/**
 * Possible interactive keyboard keys
 */
export enum INTERACTIVE_KEYS {
  MOVE_UP = "ArrowUp",
  MOVE_DOWN = "ArrowDown",
  SHOT = " ",
  DEBUG = "d",
}

/**
 * Handles keyboard events
 */
export default class KeyboardController {
  /**
   * List of keys for player creature movement
   */
  moveKeys: INTERACTIVE_KEYS[];

  constructor(public game: Game) {
    this.game = game;
    this.moveKeys = [INTERACTIVE_KEYS.MOVE_DOWN, INTERACTIVE_KEYS.MOVE_UP];

    window.addEventListener("keydown", (event) => {
      const key = event.key as INTERACTIVE_KEYS;

      /**
       * Handles player movement events
       */
      if (this.moveKeys.includes(key) && this.getKeyIndex(key) === -1) {
        this.game.keyboardKeys.push(key);
      }
      /**
       * Handles player shoot event
       */
      if (key === INTERACTIVE_KEYS.SHOT) {
        this.game.player.shootTop();
      }
      /**
       * Handles game debug event
       */
      if (key === INTERACTIVE_KEYS.DEBUG) {
        this.game.debugMode = !this.game.debugMode;
      }
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key as INTERACTIVE_KEYS;

      const keyIndex = this.getKeyIndex(key);
      /**
       * Removes key from the keys list if key is pressed already
       */
      if (keyIndex !== -1) this.game.keyboardKeys.splice(keyIndex, 1);
    });
  }

  /**
   * Check is key already pressed by checking keys list
   */
  getKeyIndex = (key: INTERACTIVE_KEYS): number => {
    return this.game.keyboardKeys.indexOf(key);
  };
}
