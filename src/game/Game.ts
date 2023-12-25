import {
  INTERACTIVE_KEYS,
  KeyboardController,
  SoundController,
} from "./controllers";
import {
  Angler1,
  Angler2,
  BulbWhale,
  HiveWhale,
  MoonFish,
  Player,
  RazorFin,
  Stalker,
  LuckyFish,
  Drone,
} from "./creature";
import { BaseCanvasClass, ENEMY_TYPES, Enemy, Explosion } from "./helpers";
import { FireExplosion, Gear, Shield, SmokeExplosion } from "./props";
import { Background, UI } from "./ui";

/**
 * Main game logic holder
 *
 * Responsibly for sticking together all parts of game
 */
export default class Game {
  player: Player;
  shield: Shield;
  keyboardController: KeyboardController;
  soundController: SoundController;
  ui: UI;
  background: Background;

  /**
   * List of pressed arrow keys
   */
  keyboardKeys: INTERACTIVE_KEYS[] = [];

  /**
   * List of shown gear elements
   */
  gears: Gear[] = [];

  /**
   * List of shown explosion elements
   */
  explosions: Explosion[] = [];

  /**
   * Current ammo (bullets) amount
   */
  ammo = 10;
  /**
   * Maximum ammo amount
   */
  ammoMaxLimit = 50;
  /**
   * Current ammo recharge duration
   */
  ammoTimer = 0;
  /**
   * Ammo recharge interval
   */
  ammoInterval = 350;

  /**
   * List of shown enemy creatures
   */
  enemies: Enemy[] = [];
  /**
   * Current enemy recharge duration
   */
  enemyTimer = 0;
  /**
   * Enemy recharge interval
   */
  enemyInterval = this.ammoInterval * 2;

  /**
   * Indicates if game finished
   */
  gameOver = false;
  /**
   * Current game score.
   * Destroyed enemy increases score, touched enemy decreases score
   */
  score = 0;
  /**
   * Minimal score to win the game
   */
  winningScore = 80;

  /**
   * Current game duration
   */
  gameTimer = 0;
  /**
   * Maximum game duration
   */
  gameTimeLimit = 30000;

  /**
   * Speed for all canvas elements that moves left
   */
  speed = 1;

  /**
   * Indicates if debug mode enabled.
   * Each canvas element handles debug mode differently
   */
  debugMode = false;
  /**
   * @param width - canvas width
   * @param height - canvas height
   */
  constructor(public width: number, public height: number) {
    this.player = new Player(this);
    this.shield = new Shield(this);
    this.ui = new UI(this, this.player.x, this.player.y);
    this.keyboardController = new KeyboardController(this);
    this.soundController = new SoundController();
    this.background = new Background(this);
  }

  /**
   * Inits all canvas elements updating their positions
   */
  update(deltaTimeStamp: number) {
    this.updateGameTimer(deltaTimeStamp);

    // updates all layers positions
    this.background.update();
    this.background.layer4.update();
    // updates player position
    this.player.update(deltaTimeStamp);
    // updates player shield position
    this.shield.update(deltaTimeStamp);

    this.updateAmmoTimer(deltaTimeStamp);

    this.triggerGearsUpdate();
    this.triggerExplosionsUpdate(deltaTimeStamp);
    this.triggerEnemyAndBulletsUpdating();

    this.updateEnemyTimer(deltaTimeStamp);
  }

  /**
   * Inits all canvas elements drawing, where order matters
   * @param context - canvas 2d context
   */
  draw(context: CanvasRenderingContext2D) {
    // draws all layers behind the player, expect layer 4
    this.background.draw(context);
    // draws game stats
    this.ui.draw(context);
    // draws player creature
    this.player.draw(context);
    // draws player shield in front of player creature
    this.shield.draw(context);
    // draws all gears that fall from enemies
    this.gears.forEach((gear) => gear.draw(context));
    // draws all alive enemies
    this.enemies.forEach((enemy) => enemy.draw(context));
    // draw all explosions for destroyed enemies
    this.explosions.forEach((explosion) => explosion.draw(context));
    // draws last layer in front of all creature/elements
    this.background.layer4.draw(context);
  }

  /**
   * Triggers updating for all shown gears positions
   */
  triggerGearsUpdate(): void {
    this.gears = this.gears.filter((gear) => {
      gear.update();
      return !gear.markForDeletion;
    });
  }

  /**
   * Triggers updating for all shown explosions positions
   */
  triggerExplosionsUpdate(deltaTimeStamp: number): void {
    this.explosions = this.explosions.filter((explosion) => {
      explosion.update(deltaTimeStamp);
      return !explosion.markForDeletion;
    });
  }

  /**
   * Triggers updating for all shown enemies and bullets positions
   */
  triggerEnemyAndBulletsUpdating(): void {
    // List of enemies that appears after some enemy destroyed (mostly Whale classes);
    const newEnemies: Enemy[] = [];

    this.enemies = this.enemies.filter((enemy) => {
      // updates enemy coords
      enemy.update();

      // check if enemy touches the player
      if (this.checkCollision(this.player, enemy)) {
        enemy.markForDeletion = true;
        this.soundController.playHit();
        this.shield.reset();

        this.addExplosion(enemy);
        // check if player touches the boost enemy class
        if (enemy.type === ENEMY_TYPES.LUCKY) this.player.boostPowerUp();
        else {
          // decrease score if enemy touched
          if (!this.gameOver) this.score--;
          // add several gears when enemy and player touched
          this.addGear(enemy, enemy.score);
        }
      }

      this.player.bullets.forEach((bullet) => {
        // check if bullet reached the enemy
        if (this.checkCollision(bullet, enemy)) {
          enemy.lives--;
          bullet.markForDeletion = true;
          this.addGear(enemy, 1);

          // check if enemy should be destroyed
          if (enemy.lives <= 0) {
            enemy.markForDeletion = true;
            // add sound for destroyed enemy
            this.soundController.playExplosion();
            // add an explosion for destroyed enemy
            this.addExplosion(enemy);
            // add several gears for destroyed enemy
            this.addGear(enemy, enemy.score);
            if (!this.gameOver) this.score += enemy.score;

            // check destroyed enemy is Moonfish
            if (enemy.type === ENEMY_TYPES.MOONFISH) this.player.boostPowerUp();
            // check destroyed enemy is Whale
            if (enemy.type === ENEMY_TYPES.WHALE) {
              for (let i = 0; i < 5; i++) {
                newEnemies.push(
                  new Drone(
                    this,
                    enemy.x + enemy.width * Math.random(),
                    enemy.y + enemy.height * Math.random(),
                  ),
                );
              }
            }
          }
        }
      });

      return !enemy.markForDeletion;
    });

    this.enemies.push(...newEnemies);
  }

  /**
   * Defines if game finished based on current game timer
   */
  updateGameTimer(deltaTimeStamp: number): void {
    if (this.gameTimer < this.gameTimeLimit) {
      this.gameTimer += deltaTimeStamp;
    } else {
      this.gameOver = true;
    }
  }

  /**
   * Defines if new ammo should be added based on current ammo timer
   */
  updateAmmoTimer(deltaTimeStamp: number): void {
    if (this.ammoTimer > this.ammoInterval) {
      this.ammoTimer = 0;
      if (this.ammo < this.ammoMaxLimit) this.ammo++;
    } else {
      this.ammoTimer += deltaTimeStamp;
    }
  }

  /**
   * Defines if new enemy should be added based on current enemy timer
   */
  updateEnemyTimer(deltaTimeStamp: number): void {
    if (this.enemyTimer > this.enemyInterval) {
      this.enemyTimer = 0;
      if (!this.gameOver) this.addEnemy();
    } else {
      this.enemyTimer += deltaTimeStamp;
    }
  }

  /**
   * Populate list of enemies with new Enemy entity
   */
  addEnemy(): void {
    const randomize = Math.random();
    let enemy: Enemy;

    if (randomize < 0.1) enemy = new Angler1(this);
    else if (randomize < 0.3) enemy = new Stalker(this);
    else if (randomize < 0.5) enemy = new RazorFin(this);
    else if (randomize < 0.6) enemy = new Angler2(this);
    else if (randomize < 0.7) enemy = new HiveWhale(this);
    else if (randomize < 0.8) enemy = new BulbWhale(this);
    else if (randomize < 0.9) enemy = new MoonFish(this);
    else enemy = new LuckyFish(this);

    this.enemies.push(enemy);
  }

  /**
   * Populate list of explosions with new Explosion entity
   *
   * @param enemy - instance of Enemy entity
   */
  addExplosion(enemy: Enemy): void {
    const randomize = Math.random();
    const explosion: typeof Explosion =
      randomize < 0.5 ? SmokeExplosion : FireExplosion;

    this.explosions.push(
      new explosion(
        this,
        enemy.x + enemy.width * 0.5,
        enemy.y + enemy.height * 0.5,
      ),
    );
  }

  /**
   * Populate list of gears with new Gear entity
   *
   * @param enemy - instance of Enemy entity
   */
  addGear(enemy: Enemy, gearsAmount: number): void {
    for (let i = 0; i < gearsAmount + 1; i++) {
      this.gears.push(
        new Gear(
          this,
          enemy.x + enemy.width * 0.5,
          enemy.y + enemy.height * 0.5,
        ),
      );
    }
  }

  /**
   * Checks if two canvas elements touched
   *
   * @param react1 - canvas element
   * @param rect2 - canvas element
   */
  checkCollision(rect1: BaseCanvasClass, rect2: BaseCanvasClass): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }
}
