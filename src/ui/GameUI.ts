import { State } from "../state.js";

export class GameUI {
  private state = State.getInstance();
  private socket!: WebSocket;

  render(): HTMLElement {
    const container = document.createElement("div");

    const canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.border = "1px solid red"; // Pour test visuel

    const score = document.createElement("div");
    score.innerText = `Score : ${this.state.player.score}`;

    container.append(canvas, score);

    this.initWebSocket(score);
    return container;
  }


  private initWebSocket(scoreElement: HTMLElement) {
    this.socket = new WebSocket("ws://localhost:8080");

    this.socket.onopen = () => {
      console.log("Connected to WebSocket server");
      this.socket.send(JSON.stringify({ type: "join", player: this.state.player.id }));
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "updateScore") {
        this.state.player.score = data.score;
        scoreElement.innerText = `Score : ${this.state.player.score}`;
      }

      if (data.type === "ballMove") {
        this.updateCanvas(data);
        console.log("Recieved ball position:", data.x, data.y);
      }
    };

    this.socket.onerror = (error) => {
      console.error("Error WebSocket:", error);
    };

    this.socket.onclose = () => {
      console.log("Connexion WebSocket closed");
    };
  }

  private updateCanvas(data: { x: number; y: number }) {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(data.x, data.y, 10, 10); // Dessiner la balle
    console.log("Drawing ball at", data.x, data.y);
  }
}


