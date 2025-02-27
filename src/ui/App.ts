// App.ts : Entrypoint from UI
// ui/App.ts
import { Router } from "../router";
import { Menu } from "./Menu";
import { GameUI } from "./GameUI";
import { TournamentUI } from "./TournamentUI";
import { State } from "../state";

declare global {
	interface Window {
	  navigateTo: (path: string) => void;
	}
}

export class App {
  private router: Router;
  private state = State.getInstance();

  constructor() {
    // Initialiser l'état avec des données de test
    this.initializeState();
    
    // Obtenir l'instance du router
    this.router = Router.getInstance();
    
    // Définir les routes
    this.router.register('/', () => new Menu().render());
    this.router.register('/game', () => new GameUI().render());
    this.router.register('/tournament', () => new TournamentUI().render());
    
    // Initialiser le routeur avec la route actuelle
    this.router.initialize();
    
    // Remplacer la fonction navigateTo globale pour utiliser notre router
    window.navigateTo = (path: string) => {
      this.router.navigate(path);
    };
  }
  
  private initializeState(): void {
    // Ajouter des données de test pour le tournoi si nécessaire
    if (this.state.tournament.players.length === 0) {
      this.state.setTournament(
        ['Alice', 'Bob', 'Charlie', 'Diana'],
        [['Alice', 'Bob'], ['Charlie', 'Diana']]
      );
    }
    
    // Initialiser le nom du joueur si nécessaire
    if (!this.state.player.name) {
      this.state.setPlayer("Joueur 1");
    }
  }
}