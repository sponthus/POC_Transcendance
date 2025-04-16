import { State, Player } from "../state.js"
import { Router } from "../router.js";

const state = State.getInstance();
const router = Router.getInstance();

export class LoginUI {
    render(): HTMLElement {
        let playerA: Player | undefined = undefined;
        let playerB: Player | undefined = undefined;

        const container = document.createElement("div");

        const label = document.createElement("label");
        label.innerText = "Player ";
        const input_a: HTMLInputElement = document.createElement("input");
        input_a.type = "text";

        const feedback_a: HTMLSpanElement = document.createElement("span");
        feedback_a.style.marginLeft = "8px";
        feedback_a.style.fontSize = "1.2em";

        const button: HTMLButtonElement = document.createElement("button");
        button.innerText = "Join";
        button.onclick = () => {
            const name = input_a.value.trim();
            if (name) {
                playerA = state.getPlayerByName(name);
                input_a.innerHTML = name;
                feedback_a.textContent = "✅";
                if (!playerA) {
                    state.addPlayer(state.getMaxPlayerId(), name);
                    playerA = state.getPlayerByName(name);
                }
                if (playerA)
                    state.setLocalPlayerA(playerA.id);
            }
            if (playerA && playerB)
                button3.style.display = "block";
        };

        const input_b: HTMLInputElement = document.createElement("input");
        input_b.type = "text";

        const feedback_b: HTMLSpanElement = document.createElement("span");
        feedback_b.style.marginLeft = "8px";
        feedback_b.style.fontSize = "1.2em";

        const button2 = document.createElement("button");
        button2.innerText = "Join";
        button2.onclick = () => {
            const name = input_b.value.trim();
            if (name) {
                playerB = state.getPlayerByName(name);
                input_b.textContent = name;
                feedback_b.textContent = "✅";
                if (!playerB) {
                    state.addPlayer(state.getMaxPlayerId(), name);
                    playerB = state.getPlayerByName(name);
                }
                if (playerB)
                    state.setLocalPlayerB(playerB.id);
            }
            if (playerA && playerB)
                button3.style.display = "block";
        };

        const button3: HTMLButtonElement = document.createElement("button");
        button3.innerText = "Start game";
        button3.style.display = "none";
        button3.onclick = () => {
            if (playerA && playerB) {
                router.navigate('/game');
            }
            else {
                console.log("1 player missing");
            }
        }

        container.append(input_a, feedback_a, button, input_b, feedback_b, button2, button3);
        return container;
    }
}
