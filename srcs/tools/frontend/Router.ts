export class Router {
    private static instance: Router;
    private routes: { [key: string]: () => { render: () => HTMLElement, destroy?: () => void } } = {};
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

    public register(path: string, callback: () => { render: () => HTMLElement, destroy?: () => void }): void {
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

    public setCurrentComponent(component: { render: () => HTMLElement, destroy?: () => void }): void {
        this.currentComponent = component;
    }

    private destroyCurrentComponent(): void {
        if (this.currentComponent?.destroy) {
            console.log("call destroy");
            this.currentComponent.destroy();
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

        const componentFactory = this.routes[normalizedPath];
        if (componentFactory) {
            console.log(`Route found for ${normalizedPath}`);
            this.destroyCurrentComponent();

            while (this.appElement.firstChild) {
                this.appElement.removeChild(this.appElement.firstChild);
            }
            try {
                const newComponent = componentFactory();
                this.setCurrentComponent(newComponent); // Allows to call destroy before leaving

                const element = newComponent.render();
                this.appElement.appendChild(element);
                console.log("Successful content render");
            }
            catch (error) {
                console.error("Error while render:", error);
            }
        } else {
            console.error(`Unknown path: ${normalizedPath}`);
            console.log("Available paths:", Object.keys(this.routes));
            if (this.routes['/']) {
                console.log("Redirecting to '/'");
                this.navigate('/');
            }
        }
    }

	public initialize(): void {
        console.log("Router initialization");

        // Exposes router instance everywhere
        (window as any).router = this;

        window.navigateTo = (path: string) => {
            console.log(`navigateTo called with: ${path}`);
            this.navigate(path);
        };

        // Treat calls stocked before initialization
        if ((window as any).navigateCalls && Array.isArray((window as any).navigateCalls)) {
            const calls = (window as any).navigateCalls;
            if (calls.length > 0) {
                console.log(`Treating ${calls.length} delayed calls to navigateTo`);
                // Only treat last call to avoid multiple redirections
                this.navigate(calls[calls.length - 1]);
            }
        }

        // Render initial route if no call has been stocked
        else {
            this.renderCurrentRoute();
        }
    }
}

// Declare types for window
declare global {
    interface Window {
        navigateTo: (path: string) => void;
        router: Router;
        navigateCalls: string[];
    }
}