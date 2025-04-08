import { State } from "../state.js";
export class GameUI {
    state = State.getInstance();
    socket;
    render() {
        const container = document.createElement("div");
        const canvas = document.createElement("canvas");
        canvas.id = "gameCanvas";
        const score = document.createElement("div");
        score.innerText = `Score : ${this.state.player.score}`;
        container.append(canvas, score);
        this.initWebSocket(score);
        return container;
    }
    initWebSocket(scoreElement) {
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
            }
        };
        this.socket.onerror = (error) => {
            console.error("Error WebSocket:", error);
        };
        this.socket.onclose = () => {
            console.log("Connexion WebSocket closed");
        };
    }
    updateCanvas(data) {
        const canvas = document.getElementById("gameCanvas");
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(data.x, data.y, 10, 10); // Dessiner la balle
    }
}
