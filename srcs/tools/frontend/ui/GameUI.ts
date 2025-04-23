import { State } from "../../shared/state.js";
import { Router } from '../router.js';

const state = State.getInstance();
const router = Router.getInstance();

export class GameUI {
  private socket!: WebSocket; // ! Non-null assertion operator, promises compiler that socket will be initialized
  private playerA = state.getLocalPlayerA();
  private playerB = state.getLocalPlayerB();

  render(): HTMLElement {
    if (!this.playerA || !this.playerB) {
      router.navigate('/login');
      return document.createElement("div");
    }

    const container = document.createElement("div");

    const canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    canvas.width = state.game_width;
    canvas.height = state.game_height;
    canvas.style.border = "1px solid red";

    const score = document.createElement("div");
    score.innerText = `${this.playerA.name} ${this.playerA.score} - ${this.playerB.name} ${this.playerB.score}`;
    this.createPauseOverlay();

    document.addEventListener("keydown", this.handleKeyDown);

    container.append(canvas, score);

    this.initWebSocket(score);
    return container;
  }

  private initWebSocket(scoreElement: HTMLElement) {
    this.socket = new WebSocket("wss://localhost:4443/ws/");

    this.socket.onopen = () => {
      console.log("Connected to WebSocket server");
      this.socket.send(JSON.stringify({
        type: "join" }));
    };

    this.socket.onmessage = (event) => {
      if (!this.playerA || !this.playerB) {
        router.navigate('/login');
        return document.createElement("div");
      }

      const data = JSON.parse(event.data);

      if (data.type === "updateScore") {
        if (data.player == "A")
          this.playerA.score = data.score;
        else if (data.player == "B")
          this.playerB.score = data.score;
        scoreElement.innerText = `${this.playerA.name} ${this.playerA.score} - ${this.playerB.name} ${this.playerB.score}`;
      }

      if (data.type === "ballMove") {
        this.updateCanvas(data);
        // console.log("Recieved ball position:", data.x, data.y);
      }

      if (data.type == "gameState") {
        state.setGameState(data.state);
        if (data.state === "paused") {
          this.showPauseScreen();
        } else if (data.state === "playing") {
          this.hidePauseScreen();
        }
      }
    };

    this.socket.onerror = (error) => {
      console.error("Error WebSocket:", error);
    };

    this.socket.onclose = () => {
      console.log("Connexion WebSocket closed");
    };
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    console.log(`key pressed ${e.key}`);
    if (e.key == "ArrowUp")
      this.socket.send(JSON.stringify({
        type:'move',
        paddle: "a",
        dir:"up"}));
      else if (e.key == "ArrowDown")
        this.socket.send(JSON.stringify({
        type:'move',
        paddle: "a",
        dir:"down"}));
      else if (e.key == "E" || e.key == "e")
        this.socket.send(JSON.stringify({
          type:'move',
          paddle: "b",
          dir:"up"}));
      else if (e.key == "D" || e.key == "d")
        this.socket.send(JSON.stringify({
          type:'move',
          paddle: "b",
          dir:"down"}));
      else if (e.key == "Escape")
        this.socket.send(JSON.stringify({
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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(data.x, data.y, state.ball_size, state.ball_size); // Dessiner la balle
    ctx.fillRect(state.paddle_padding, data.pa - state.paddle_height / 2, state.paddle_width, state.paddle_height); // Dessiner le paddle a, coordonnees en haut a gauche
    ctx.fillRect(state.game_width - state.paddle_padding - state.paddle_width, data.pb - state.paddle_height / 2, state.paddle_width, state.paddle_height); // Dessiner le paddle b, coordonnees en haut a gauche puis largeur puis hauteur
    // console.log("Drawing ball at", data.x, data.y);
    // console.log("pa at ", data.pa, "/ pb at ", data.pb);
  }

  public destroy() {
    // Close socket
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
    // avoids weird actions such as event listener still active
    document.removeEventListener("keydown", this.handleKeyDown);

    const overlay = document.getElementById("pauseOverlay");
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }

    state.setGameState("idle");
  }
}

