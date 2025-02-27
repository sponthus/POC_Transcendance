export class Router {
	private static instance: Router;
	private routes: { [key: string]: () => void } = {};
  
	private constructor() {
	  window.addEventListener("popstate", () => this.handleRouteChange());
	}
  
	// Singleton : s'assurer qu'on utilise toujours la même instance
	public static getInstance(): Router {
	  if (!Router.instance) {
		Router.instance = new Router();
	  }
	  return Router.instance;
	}
  
	// ✅ Permet d'enregistrer une route avec un callback qui sera exécuté lorsqu'on navigue vers cette route
	public register(path: string, callback: () => void): void {
	  this.routes[path] = callback;
	}
  
	// ✅ Gère la navigation et met à jour l'URL sans recharger la page
	public navigate(path: string): void {
	  if (this.routes[path]) {
		history.pushState({}, "", path);
		this.routes[path](); // Exécute le callback associé à la route
	  } else {
		console.error(`Route non définie : ${path}`);
	  }
	}
  
	// ✅ Gère les changements de route (ex: bouton "Précédent" du navigateur)
	private handleRouteChange(): void {
	  const path = window.location.pathname;
	  if (this.routes[path]) {
		this.routes[path]();
	  } else {
		console.error(`Route inconnue : ${path}`);
	  }
	}
  }
