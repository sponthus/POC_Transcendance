import { State, game_width, game_height, paddle_height, paddle_width, paddle_padding, ball_size } from "../state.js";

const state = State.getInstance();

export class GameUI {
  private socket!: WebSocket; // ! Non-null assertion operator, promises compiler that socket will be initialized

  render(): HTMLElement {
    const container = document.createElement("div");

    const canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    canvas.width = game_width;
    canvas.height = game_height;
    canvas.style.border = "1px solid red"; // Pour test visuel

    const score = document.createElement("div");
    score.innerText = `Score : ${state.player.score}`;
    this.createPauseOverlay();
    this.createIdleOverlay();

    document.addEventListener("keydown", this.handleKeyDown);

    container.append(canvas, score);

    this.initWebSocket(score);
    return container;
  }

  private initWebSocket(scoreElement: HTMLElement) {
    this.socket = new WebSocket("ws://localhost:8080");

    this.socket.onopen = () => {
      console.log("Connected to WebSocket server");
      this.socket.send(JSON.stringify({
        type: "join",
        player: state.player.id }));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "updateScore") {
        state.player.score = data.score;
        scoreElement.innerText = `Score : ${state.player.score}`;
      }

      if (data.type === "ballMove") {
        this.updateCanvas(data);
        // console.log("Recieved ball position:", data.x, data.y);
      }

      if (data.type == "gameState") {
        if (data.state === "paused") {
          this.hidePauseScreen(); // Affiche overlay
        } else if (data.state === "playing") {
          this.showPauseScreen(); // Cache overlay
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

  private createIdleOverlay() {
    const idleOverlay = document.createElement("div");
    idleOverlay.id = "pauseOverlay";
    idleOverlay.style.position = "absolute";
    idleOverlay.style.top = "0";
    idleOverlay.style.left = "0";
    idleOverlay.style.right = "0";
    idleOverlay.style.bottom = "0";
    idleOverlay.style.background = "rgba(0, 0, 0, 0.6)";
    idleOverlay.style.color = "white";
    idleOverlay.style.fontSize = "2em";
    idleOverlay.style.display = "none";
    idleOverlay.style.justifyContent = "center";
    idleOverlay.style.alignItems = "center";
    idleOverlay.style.zIndex = "999";
    idleOverlay.innerText = "Pause";

    document.body.appendChild(idleOverlay);
  }

  private showIdleScreen() {
    const idleOverlay = document.getElementById("idleOverlay");
    if (idleOverlay) idleOverlay.style.display = "flex";
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
    ctx.fillRect(data.x, data.y, ball_size, ball_size); // Dessiner la balle
    ctx.fillRect(paddle_padding, data.pa - paddle_height / 2, paddle_width, paddle_height); // Dessiner le paddle a, coordonnees en haut a gauche
    ctx.fillRect(game_width - paddle_padding - paddle_width, data.pb - paddle_height / 2, paddle_width, paddle_height); // Dessiner le paddle b, coordonnees en haut a gauche puis largeur puis hauteur
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

    this.state.gameState = "idle";
  }
}

