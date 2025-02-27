import { Router } from "../router";
export class Menu {
    render() {
        const menu = document.createElement("div");
        const startGameButton = document.createElement("button");
        startGameButton.innerText = "Start Game";
        startGameButton.addEventListener("click", () => {
            Router.getInstance().navigate("/game"); // ✅ Appel correct via l'instance
        });
        menu.appendChild(startGameButton);
        return menu;
    }
}
