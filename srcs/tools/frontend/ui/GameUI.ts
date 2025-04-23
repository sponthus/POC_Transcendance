import { Player, State } from "../../shared/state.js";
import { Router } from '../Router';
import { Socket } from "../WebSockets";

const router = Router.getInstance();
const socket = Socket.getInstance();
const state = State.getInstance();

export class GameUI {
  private playerA: Player;
  private playerB: Player;
  private canvas: HTMLCanvasElement;
  private score: HTMLDivElement;

  constructor() {
    this.playerA = state.getLocalPlayerA();
    this.playerB = state.getLocalPlayerB();

    this.canvas = document.createElement("canvas");
    this.canvas.id = "gameCanvas";
    this.canvas.width = state.game_width;
    this.canvas.height = state.game_height;
    this.canvas.style.border = "1px solid red";

    this.score = document.createElement("div");
    this.score.id = "score";

    console.log(`gameUI constructed`);
  }
  render(): HTMLElement {
    if (!this.playerA || !this.playerB) {
      router.navigate('/login');
      return document.createElement("div");
    }

    const container = document.createElement("div");
    container.id = "GameUI";

    this.score.innerText = `${this.playerA.name} ${this.playerA.score} - ${this.playerB.name} ${this.playerB.score}`;

    this.createPauseOverlay();

    console.log(`socket state = `, socket.isOpen())
    console.log("Handler référence : ", this.onSocketMessage);
    socket.addEventListener("message", this.onSocketMessage);
    document.addEventListener("keydown", this.handleKeyDown);

    container.append(this.canvas, this.score);
    setTimeout(() => {
      socket.send(JSON.stringify({ type: 'play' }));
      console.log("sending play request (after delay)");
    }, 10);
    return container;
  }

  private onSocketMessage = (event: MessageEvent) => {
    // console.log(`ui got message`);
    const data = JSON.parse(event.data);

    if (data.type === "updateScore") {
      const score = document.getElementById("score") as HTMLDivElement;
      if (!score) return;
      if (data.player == "A")
        this.playerA.score = data.score;
      else if (data.player == "B")
        this.playerB.score = data.score;
      score.innerText =
          `${this.playerA.name} ${this.playerA.score} - 
          ${this.playerB.name} ${this.playerB.score}`;
    }

    if (data.type === "ballMove") {
      this.updateCanvas(data);
        // console.log("Recieved ball position:", data.x, data.y);
    }

    if (data.type == "gameState") {
        if (data.state === "paused"
            && state.gameState === "playing") {
          this.showPauseScreen();
        } else if (data.state === "playing"
            && state.gameState === "paused") {
          this.hidePauseScreen();
        } else if (data.state === "idle" &&
            (state.gameState === "playing"
                || state.gameState === "paused")) {
          router.navigate('/login');
        }
        state.setGameState(data.state);
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // console.log(`key pressed ${e.key}`);
    if (!socket.isOpen()) {
      console.error(`Socket is closed`);
      return;
    }

    if (e.key == "ArrowUp")
      socket.send(JSON.stringify({
        type:'move',
        paddle: "a",
        dir:"up"}));
    else if (e.key == "ArrowDown")
      socket.send(JSON.stringify({
        type:'move',
        paddle: "a",
        dir:"down"}));
    else if (e.key == "E" || e.key == "e")
      socket.send(JSON.stringify({
        type:'move',
        paddle: "b",
        dir:"up"}));
    else if (e.key == "D" || e.key == "d")
      socket.send(JSON.stringify({
        type:'move',
        paddle: "b",
        dir:"down"}));
    else if (e.key == "Escape")
      socket.send(JSON.stringify({
        type:'togglePause'}));
  };

  private createPauseOverlay() {
    const pauseOverlay = document.createElement("div");
    pauseOverlay.id = "pauseOverlay";
    pauseOverlay.style.position = "absolute";
    pauseOverlay.style.top = "0";
    pauseOverlay.style.left = "0";
    pauseOverlay.style.right = "0";
    pauseOverlay.style.bottom = "0";
    pauseOverlay.style.background = "rgba(0, 0, 0, 0.6)";
    pauseOverlay.style.color = "white";
    pauseOverlay.style.fontSize = "2em";
    pauseOverlay.style.display = "none";
    pauseOverlay.style.justifyContent = "center";
    pauseOverlay.style.alignItems = "center";
    pauseOverlay.style.zIndex = "999";
    pauseOverlay.innerText = "Pause";

    document.body.appendChild(pauseOverlay);
  }

  private showPauseScreen() {
    const pauseOverlay = document.getElementById("pauseOverlay");
    if (pauseOverlay) pauseOverlay.style.display = "flex";
  }

  private hidePauseScreen() {
    const pauseOverlay = document.getElementById("pauseOverlay");
    if (pauseOverlay) pauseOverlay.style.display = "none";
  }

  private updateCanvas(data: { x: number; y: number; pa: number; pb: number }) {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!canvas) return;

    // console.log(`drawing elements`);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(data.x,
        data.y,
        state.ball_size,
        state.ball_size);
        // Draw ball
    ctx.fillRect(state.paddle_padding,
        data.pa - state.paddle_height / 2,
        state.paddle_width, state.paddle_height);
        // Draw paddle a, up left x / y / width / height
    ctx.fillRect(state.game_width - state.paddle_padding - state.paddle_width,
        data.pb - state.paddle_height / 2,
        state.paddle_width,
        state.paddle_height);
        // Draw paddle b, up left x / y / width / height
    // console.log("Drawing ball at", data.x, data.y);
    // console.log("pa at ", data.pa, "/ pb at ", data.pb);
  }

  public destroy(): void {
    // Close socket specific actions
    // avoids weird actions such as event listener still active
    console.log(`Destroyer called`)
    socket.removeEventListener("message", this.onSocketMessage);
    document.removeEventListener("keydown", this.handleKeyDown);

    const overlay = document.getElementById("pauseOverlay");
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }

    state.setGameState("idle");
    socket.send(JSON.stringify({type: "stop"}))

  }
}

