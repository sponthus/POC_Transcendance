import { Button } from "./Button.js";
import { Router } from "../router.js";

export class Menu {
  render(): HTMLElement {
    const menu = document.createElement("div");

    const tournamentButton = document.createElement("button");
    tournamentButton.innerText = "Tournament";
    tournamentButton.addEventListener("click", () => {
        window.navigateTo("/tournament"); // ✅ Appel correct via l'instance
    
    });
  
    const startGameButton = document.createElement("button");
    startGameButton.innerText = "Start Game";
    startGameButton.addEventListener("click", () => {
        window.navigateTo("/game"); // ✅ Appel correct via l'instance
    });

    menu.appendChild(startGameButton);
    menu.appendChild(tournamentButton);
    return menu;
  }
}
