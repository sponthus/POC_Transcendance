export class Router {
    constructor() {
        this.routes = {};
        this.appElement = document.getElementById('app');
        if (!this.appElement) {
            console.error("Élément #app non trouvé dans le DOM");
        }
        window.addEventListener("popstate", () => {
            console.log("Événement popstate déclenché");
            this.handleRouteChange();
        });
    }
    static getInstance() {
        if (!Router.instance) {
            Router.instance = new Router();
        }
        return Router.instance;
    }
    register(path, callback) {
        console.log(`Route enregistrée: ${path}`);
        this.routes[path] = callback;
    }
    navigate(path) {
        console.log(`Navigation vers: ${path}`);
        if (this.routes[path]) {
            window.history.pushState({}, "", path);
            this.renderCurrentRoute();
        }
        else {
            console.error(`Route non définie: ${path}`);
        }
    }
    handleRouteChange() {
        this.renderCurrentRoute();
    }
    renderCurrentRoute() {
        if (!this.appElement) {
            this.appElement = document.getElementById('app');
            console.log("Élément app trouvé?", !!this.appElement);
            if (!this.appElement) {
                console.error("Élément #app introuvable");
                return;
            }
        }
        let path = window.location.pathname;
        const normalizedPath = path === '' || path === '/' ? '/' : path;
        if (this.routes[normalizedPath]) {
            console.log(`Route trouvée pour ${normalizedPath}`);
            while (this.appElement.firstChild) {
                this.appElement.removeChild(this.appElement.firstChild);
            }
            try {
                const element = this.routes[normalizedPath]();
                this.appElement.appendChild(element);
                console.log("Contenu rendu avec succès");
            }
            catch (error) {
                console.error("Erreur lors du rendu:", error);
            }
        }
        else {
            console.error(`Route inconnue: ${normalizedPath}`);
            console.log("Routes disponibles:", Object.keys(this.routes));
            if (this.routes['/']) {
                console.log("Redirection vers la route par défaut '/'");
                this.navigate('/');
            }
        }
    }
    initialize() {
        console.log("Initialisation du router");
        // Exposes router instance everywhere
        window.router = this;
        // Remplacer la fonction temporaire par la vraie
        window.navigateTo = (path) => {
            console.log(`navigateTo appelé avec: ${path}`);
            this.navigate(path);
        };
        // Traiter les appels qui ont été stockés avant l'initialisation
        if (window.navigateCalls && Array.isArray(window.navigateCalls)) {
            const calls = window.navigateCalls;
            if (calls.length > 0) {
                console.log(`Traitement de ${calls.length} appels navigateTo retardés`);
                // Ne traiter que le dernier appel pour éviter les redirections multiples
                this.navigate(calls[calls.length - 1]);
            }
        }
        // // Rendre la route initiale si aucun appel n'a été stocké
        else {
            this.renderCurrentRoute();
        }
    }
}
