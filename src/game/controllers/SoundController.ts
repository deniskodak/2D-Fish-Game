/**
 * Handles playing audio when any event happens
 */
export default class SoundController {
  powerUp: HTMLAudioElement;
  powerDown: HTMLAudioElement;
  shot: HTMLAudioElement;
  hit: HTMLAudioElement;
  explosion: HTMLAudioElement;
  shield: HTMLAudioElement;

  constructor() {
    this.powerUp = this.getAudioElement("powerUpSound");
    this.powerDown = this.getAudioElement("powerDownSound");
    this.shot = this.getAudioElement("shotSound");
    this.hit = this.getAudioElement("hitSound");
    this.explosion = this.getAudioElement("explosionSound");
    this.shield = this.getAudioElement("shieldSound");
  }

  getAudioElement(elementId: string): HTMLAudioElement {
    return document.getElementById(elementId) as HTMLAudioElement;
  }

  /**
   * Resets current audio element to play music again
   * @param element - audio html element
   */
  resetAudio(element: HTMLAudioElement): void {
    element.currentTime = 0;
  }

  /**
   * Starts audio when player power mode enabled
   */
  playPowerUp() {
    this.resetAudio(this.powerUp);
    this.powerUp.play();
  }

  /**
   * Starts audio when player power mode ended
   */
  playPowerDown() {
    this.resetAudio(this.powerDown);
    this.powerDown.play();
  }

  /**
   * Starts audio when enemy is destroyed by shot
   */
  playExplosion() {
    this.resetAudio(this.explosion);
    this.explosion.play();
  }

  /**
   * Starts audio when player shoots
   */
  playShot() {
    this.resetAudio(this.shot);
    this.shot.play();
  }

  /**
   * Starts audio when enemy is destroyed by touch with player
   */
  playHit() {
    this.resetAudio(this.hit);
    this.hit.play();
  }

  /**
   * Starts audio when enemy is touched with player
   */
  playShield() {
    this.resetAudio(this.shield);
    this.shield.play();
  }
}
