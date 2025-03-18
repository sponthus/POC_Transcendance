import { State } from "../state.js";
export class GameUI {
    constructor() {
        this.state = State.getInstance();
    }
    render() {
        const container = document.createElement("div");
        const canvas = document.createElement("canvas");
        canvas.id = "gameCanvas";
        const score = document.createElement("div");
        score.innerText = `Score : ${this.state.player.score}`;
        container.append(canvas, score);
        return container;
    }
}
