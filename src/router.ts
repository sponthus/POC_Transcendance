export class Router {
    private static instance: Router;
    private routes: { [key: string]: () => HTMLElement } = {};
    private appElement: HTMLElement | null;
  
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
            if (!this.appElement) {
                console.error("Élément #app introuvable");
                return;
            }
        }
        
        const path = window.location.pathname;
        console.log(`Rendu de la route: ${path}`);
        
        if (this.routes[path]) {
            // Vider l'élément app
            while (this.appElement.firstChild) {
                this.appElement.removeChild(this.appElement.firstChild);
            }
            
            // Générer et insérer le nouvel élément
            try {
                const element = this.routes[path]();
                this.appElement.appendChild(element);
                console.log("Contenu rendu avec succès");
            } catch (error) {
                console.error("Erreur lors du rendu:", error);
            }
        } else {
            console.error(`Route inconnue: ${path}`);
            if (this.routes['/']) {
                this.navigate('/');
            }
        }
    }

	public initialize(): void {
        console.log("Initialisation du router");
        
        // Exposer l'instance du router globalement
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
        
        // Rendre la route initiale si aucun appel n'a été stocké
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