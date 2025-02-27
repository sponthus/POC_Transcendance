// App.ts : Entrypoint from UI
import { Router } from "../router";
import { Menu } from "./Menu";
import { GameUI } from "./GameUI";
import { TournamentUI } from "./TournamentUI";
export class App {
    constructor() {
        this.router = Router.getInstance(); // ✅ Utilisation correcte du singleton
        this.root = document.getElementById("app");
        this.setupRoutes();
        this.router.navigate(window.location.pathname); // Charge la bonne route au démarrage
    }
    setupRoutes() {
        this.router.register("/", () => this.render(new Menu()));
        this.router.register("/game", () => this.render(new GameUI()));
        this.router.register("/tournament", () => this.render(new TournamentUI()));
    }
    render(component) {
        this.root.innerHTML = "";
        this.root.appendChild(component.render());
    }
}
