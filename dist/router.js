export class Router {
    constructor() {
        this.routes = {};
        window.addEventListener("popstate", () => this.handleRouteChange());
    }
    // Singleton : s'assurer qu'on utilise toujours la même instance
    static getInstance() {
        if (!Router.instance) {
            Router.instance = new Router();
        }
        return Router.instance;
    }
    // ✅ Permet d'enregistrer une route avec un callback qui sera exécuté lorsqu'on navigue vers cette route
    register(path, callback) {
        this.routes[path] = callback;
    }
    // ✅ Gère la navigation et met à jour l'URL sans recharger la page
    navigate(path) {
        if (this.routes[path]) {
            history.pushState({}, "", path);
            this.routes[path](); // Exécute le callback associé à la route
        }
        else {
            console.error(`Route non définie : ${path}`);
        }
    }
    // ✅ Gère les changements de route (ex: bouton "Précédent" du navigateur)
    handleRouteChange() {
        const path = window.location.pathname;
        if (this.routes[path]) {
            this.routes[path]();
        }
        else {
            console.error(`Route inconnue : ${path}`);
        }
    }
}
