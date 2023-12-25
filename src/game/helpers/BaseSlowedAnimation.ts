/**
 * Abstract class for canvas elements that has small amount of sprite frames
 */
export default class BaseSlowedAnimation {
  frameFps = 30;
  frameTimer = 0; // current timer of current frame in sprite
  frameInterval = 1000 / this.frameFps; // interval when animation should be changed
  frameX: number;
  frameXLimit: number;

  constructor(fps?: number) {
    this.frameFps = fps || this.frameFps;
  }

  updateSlowedAnimation(deltaTime: number) {
    if (this.frameX <= this.frameXLimit) {
      if (this.frameTimer > this.frameInterval) {
        this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
  }
}
