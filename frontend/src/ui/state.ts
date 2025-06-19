export type GameState = "idle" | "playing" | "paused";

export const state = {
    user: null as null | { username: string, slug: string },
    game: { state: "idle" as GameState, id: 0 },
    canvas: {
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.6,
    },

    login(username: string, slug: string) {
        this.user = { username, slug };
        this.game.state = "idle";
        this.game.id = 0;
        localStorage.setItem('user-info', JSON.stringify(this.user));
    },

    logout() {
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user-info");
        this.game.state = "idle";
        this.game.id = 0;
    },

    isLoggedIn() {
        return this.user !== null;
    },

    play(id: number) {
        this.game.state = "playing";
        this.game.id = id;
    }
};