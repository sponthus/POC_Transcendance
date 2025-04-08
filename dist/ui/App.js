// App.ts : Entrypoint from UI
// ui/App.ts
import { Router } from "../router.js";
import { Menu } from "./Menu.js";
import { GameUI } from "./GameUI.js";
import { TournamentUI } from "./TournamentUI.js";
import { State } from "../state.js";
export class App {
    router;
    state = State.getInstance();
    constructor() {
        this.initializeState();
        this.initializeRoutes();
        this.router = Router.getInstance();
        this.router.initialize();
    }
    initializeState() {
        if (this.state.tournament.players.length === 0) {
            this.state.setTournament(['Alice', 'Bob', 'Charlie', 'Diana'], [['Alice', 'Bob'], ['Charlie', 'Diana']]);
        }
        if (!this.state.player.name) {
            this.state.setPlayer("Joueur 1");
        }
    }
    initializeRoutes() {
        this.router = Router.getInstance();
        this.router.register('/', () => new Menu().render());
        this.router.register('/game', () => new GameUI().render());
        this.router.register('/tournament', () => new TournamentUI().render());
    }
}
