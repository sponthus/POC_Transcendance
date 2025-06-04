export const state = {
    user: null as null | { username: string },
    canvas: {
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.6,
    },

    login(username: string) {
        this.user = { username };
        localStorage.setItem('username', JSON.stringify(this.user));
    },

    logout() {
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    },

    isLoggedIn() {
        return this.user !== null;
    }
};