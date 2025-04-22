export class Router {
    private static instance: Router;
    private routes: { [key: string]: () => HTMLElement } = {};
    private appElement: HTMLElement | null;
    private currentComponent: any = null;

    private constructor() {
        this.appElement = document.getElementById('app');
      
        if (!this.appElement) {
            console.error("Élément #app non trouvé dans le DOM");
        }
      
        window.addEventListener("popstate", () => {
            console.log("Événement popstate déclenché");
            this.handleRouteChange();
        });
    }
  
    public static getInstance(): Router {
        if (!Router.instance) {
            Router.instance = new Router();
        }
        return Router.instance;
    }
  
    public register(path: string, callback: () => HTMLElement): void {
        console.log(`Route enregistrée: ${path}`);
        this.routes[path] = callback;
    }
  
    public navigate(path: string): void {
        console.log(`Navigation vers: ${path}`);
        
        if (this.routes[path]) {
            window.history.pushState({}, "", path);
            this.renderCurrentRoute();
        } else {
            console.error(`Route non définie: ${path}`);
        }
    }
  
    private handleRouteChange(): void {
        this.renderCurrentRoute();
    }
    
    private renderCurrentRoute(): void {
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
            if (this.currentComponent && typeof this.currentComponent.destroy === 'function') {
                this.currentComponent.destroy();
            }

            while (this.appElement.firstChild) {
                this.appElement.removeChild(this.appElement.firstChild);
            }
            try {
                const element = this.routes[normalizedPath]();
                this.currentComponent = element; // Allows to call destroy before leaving
                this.appElement.appendChild(element);
                console.log("Contenu rendu avec succès");
            }
            catch (error) {
                console.error("Erreur lors du rendu:", error);
            }
        } else {
            console.error(`Route inconnue: ${normalizedPath}`);
            console.log("Routes disponibles:", Object.keys(this.routes));
            if (this.routes['/']) {
                console.log("Redirection vers la route par défaut '/'");
                this.navigate('/');
            }
        }
    }

	public initialize(): void {
        console.log("Initialisation du router");
        
        // Exposes router instance everywhere
        (window as any).router = this;
        
        // Remplacer la fonction temporaire par la vraie
        window.navigateTo = (path: string) => {
            console.log(`navigateTo appelé avec: ${path}`);
            this.navigate(path);
        };
        
        // Traiter les appels qui ont été stockés avant l'initialisation
        if ((window as any).navigateCalls && Array.isArray((window as any).navigateCalls)) {
            const calls = (window as any).navigateCalls;
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

// Déclarer les types pour window
declare global {
    interface Window {
        navigateTo: (path: string) => void;
        router: Router;
        navigateCalls: string[];
    }
}