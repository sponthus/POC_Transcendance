// router.ts
export class Router {
	private static instance: Router;
	private routes: { [key: string]: () => HTMLElement } = {};
	private appElement: HTMLElement;
	
	private constructor() {
	  // Trouver l'élément #app pour y afficher le contenu
	  this.appElement = document.getElementById('app') as HTMLElement;
	  
	  if (!this.appElement) {
		console.error("Élément #app non trouvé dans le DOM");
	  }
	  
	  window.addEventListener("popstate", () => this.handleRouteChange());
	}
	
	// Singleton : s'assurer qu'on utilise toujours la même instance
	public static getInstance(): Router {
	  if (!Router.instance) {
		Router.instance = new Router();
	  }
	  return Router.instance;
	}
	
	// Permet d'enregistrer une route avec un callback qui retourne un élément HTML
	public register(path: string, callback: () => HTMLElement): void {
	  this.routes[path] = callback;
	}
	
	// Gère la navigation et met à jour l'URL sans recharger la page
	public navigate(path: string): void {
	  if (this.routes[path]) {
		history.pushState({}, "", path);
		this.renderRoute(path);
	  } else {
		console.error(`Route non définie : ${path}`);
	  }
	}
	
	// Gère les changements de route (ex: bouton "Précédent" du navigateur)
	private handleRouteChange(): void {
	  const path = window.location.pathname;
	  this.renderRoute(path);
	}
	
	// Nouvelle méthode pour rendre le contenu correspondant à une route
	private renderRoute(path: string): void {
	  if (!this.appElement) return;
	  
	  if (this.routes[path]) {
		// Vider le contenu actuel
		while (this.appElement.firstChild) {
		  this.appElement.removeChild(this.appElement.firstChild);
		}
		
		// Générer et afficher le nouveau contenu
		const element = this.routes[path]();
		this.appElement.appendChild(element);
	  } else {
		console.error(`Route inconnue : ${path}`);
		// Optionnel : afficher une page 404 ou rediriger vers la page d'accueil
		if (this.routes['/']) {
		  this.navigate('/');
		}
	  }
	}
	
	// Initialiser le routeur avec la route actuelle
	public initialize(): void {
	  this.handleRouteChange();
	}
  }