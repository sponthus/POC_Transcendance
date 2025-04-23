import { Button } from "./Button.js";
import { Router } from "../Router";

export class Menu {
  render(): HTMLElement {
    const menu = document.createElement("div");

    const tournamentButton = document.createElement("button");
    tournamentButton.innerText = "Tournament";
    tournamentButton.addEventListener("click", () => {
        window.navigateTo("/tournament");
    
    });
  
    const startGameButton = document.createElement("button");
    startGameButton.innerText = "Start Game";
    startGameButton.addEventListener("click", () => {
        window.navigateTo("/login");
    });

    menu.appendChild(startGameButton);
    menu.appendChild(tournamentButton);
    return menu;
  }
}
