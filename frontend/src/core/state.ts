import { Socket } from "./Socket.js"

export type GameState = "idle" | "playing" | "paused";

export const state = {
    user: null as null | { username: string, slug: string, id: number },
    game: { state: "idle" as GameState, id: 0 },
    canvas: {
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.6,
    },
    ws: null as Socket | null,

    login(username: string, slug: string, id: number) {
        this.user = { username, slug, id };
        this.game.state = "idle";
        this.game.id = 0;
        localStorage.setItem('user-info', JSON.stringify(this.user));
        try {
            this.ws = new Socket();
        } catch (error) {
            console.error("Failed to create socket because ", error);
        }
    },

    logout() {
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user-info");
        this.game.state = "idle";
        this.game.id = 0;
        this.ws?.close();
        this.ws = null;
    },

    isLoggedIn() {
        return this.user !== null;
    },

    play(id: number) {
        this.game.state = "playing";
        this.game.id = id;
    }
};
