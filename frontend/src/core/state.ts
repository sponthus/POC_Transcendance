import { Socket } from "./Socket.js";

type GameState = "idle" | "playing" | "paused";

export class State {
    static instance: null | State;
    user: null | { username: string, slug: string, id: number } = null;
    game: { state: GameState, id: number } = { state: "idle", id: 0 };
    canvas: { width: number; height: number } = { width: window.innerWidth * 0.6, height: window.innerHeight * 0.6 };
    ws: Socket | null = null;

    constructor() {
        console.log("State constructor called");
        if (State.instance) {
            throw new Error('state instance already exists');
        }
        State.instance = this;
        this.restoreFromStorage()
        console.log("New State instance created");
    }

    private async restoreFromStorage() {
        try {
            const userInfo = localStorage.getItem('user-info');
            if (userInfo) {
                this.user = JSON.parse(userInfo);
                console.log("User restored from localStorage:", this.user?.username);
                await this.launchSocket();
            }
        } catch (error) {
            console.error("Failed to restore user from localStorage:", error);
        }
    }

    static getInstance() {
        console.log("getInstance called from:", new Error().stack?.split('\n')[1]);
        if (!State.instance)
            State.instance = new State();
        return State.instance;
    }

    async login(username: string, slug: string, id: number) {
        console.log("login called on state", username, slug, id);
        this.user = { username, slug, id };
        this.game.state = "idle";
        this.game.id = 0;
        localStorage.setItem('user-info', JSON.stringify(this.user));
        await this.launchSocket();
    }

    private async launchSocket() {
        // console.log("=== State.launchSocket DEBUG ===");
        // console.log("Current State.ws:", !!this.ws);
        // console.log("Global socket exists:", !!(window as any).GLOBAL_WEBSOCKET);
        // console.log("User ID:", this.user?.id);

        if (!this.user?.id) {
            console.error("Cannot launch socket: no user");
            return;
        }

        try {
            this.ws = Socket.getInstance(this.user.id);
            // console.log("Socket assigned to State.ws:", !!this.ws);
            // console.log("=== END State.launchSocket DEBUG ===");
        } catch (error) {
            console.error("Error starting game socket with error: ", error);
        }
    }

    logout() {
        console.log("logout called");
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user-info");
        this.game.state = "idle";
        this.game.id = 0;
        if (this.ws) {
            console.log("closing socket")
            this.ws.close();
            this.ws = null;
        }
        else {
            console.log("no socket to close");
        }
    }

    isLoggedIn() {
        // TODO = Real check of log ? Then usable everywhere ?
        if (this.user) {
            console.log("user logged in", this.user);
            return true;
        }
        else
            return false;
    }

    launchGame(gameId: number) {
        this.game.state = "paused";
        this.game.id = gameId;
    }

    play() {
        this.game.state = "playing";
    }

    pause() {
        this.game.state = "paused";
    }

    stop() {
        this.game.id = 0;
        this.game.state = "idle";
    }
};