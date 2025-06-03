export const state = {
    user: null as null | { username: string },
    canvas: {
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.6,
    },

    login(username: string) {
        this.user = { username };
    },

    logout() {
        this.user = null;
    },

    isLoggedIn() {
        return this.user !== null;
    }
};