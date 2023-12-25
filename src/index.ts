import Game from "./game/Game";
import "./index.css";

window.addEventListener("load", () => {
  const startGameButton = document.getElementById("start-game");
  const welcomeDialog = document.getElementById(
    "welcome-dialog",
  ) as HTMLDialogElement;

  startGameButton.addEventListener("click", (event: MouseEvent) => {
    welcomeDialog.open = false;
    // root canvas element
    const canvas = document.getElementById("canvas1") as HTMLCanvasElement;
    // root canvas context
    const canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
    // game board width
    canvas.width = 1000;
    // game board height
    canvas.height = 500;
    canvas.style.opacity = "1";

    const game = new Game(canvas.width, canvas.height);

    // stores last animation timestamp
    let lastTimeStamp = event.timeStamp;
    /**
     * Trigger infinite animation loop
     */
    function animation(DOMHighResTimeStamp: number) {
      // difference between pred and cur animation iteration in ms
      const deltaTimeStamp = DOMHighResTimeStamp - lastTimeStamp;
      // update last time stamp for next loop
      lastTimeStamp = DOMHighResTimeStamp;
      // remove previous rendered canvas element
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      // trigger rendering all elements
      game.draw(canvasContext);
      // trigger re-calculate all elements positions
      game.update(deltaTimeStamp);

      // calls our function on each repaint stage
      requestAnimationFrame(animation);
    }

    // starts infinity animation loop with zero time stamp
    animation(0);
  });
});
