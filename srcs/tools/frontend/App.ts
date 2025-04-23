// App.ts : Entrypoint from UI
import { Router } from "./Router";
import { Menu } from "./ui/Menu";
import { GameUI } from "./ui/GameUI";
import { TournamentUI } from "./ui/TournamentUI";
import { State } from "../shared/state";
import { LoginUI } from "./ui/LoginUI";
import { Socket } from "./WebSockets";

// import db from "../backend/database.js";

export class App {
    public router: Router = Router.getInstance();
    public state: State = State.getInstance();
    public socket: Socket = Socket.getInstance();

    private constructor() {
        this.initializeState();
        this.initializeRoutes();
        // this.initWebSocket();
        // db.exec();

	    this.router = Router.getInstance();
        this.router.initialize();
    }

    private initializeState(): void {
        if (this.state.tournament.players.length === 0) {
        this.state.setTournament(
            ['Alice', 'Bob', 'Charlie', 'Diana'],
            [['Alice', 'Bob'], ['Charlie', 'Diana']]
        );
        }
    }

    private initializeRoutes(): void {
        this.router.register('/', () => new Menu());
        this.router.register('/game', () => new GameUI());
        this.router.register('/tournament', () => new TournamentUI());
        this.router.register('/login', () => new LoginUI());
    }
}
