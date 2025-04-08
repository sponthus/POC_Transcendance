// state.ts : Gestion de l'état global
type GameState = "idle" | "playing" | "paused" | "gameover";

export class State {
  private static instance: State;

  // Données stockées
  public player: { id: number; name: string; score: number };
  public gameState: GameState;
  public tournament: { players: string[]; matches: string[][] };

  private constructor() {
    this.player = { id: 0, name: "", score: 0 };
    this.gameState = "idle";
    this.tournament = { players: [], matches: [] };
  }

  // Singleton : une seule instance de State dans l'application
  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }
    return State.instance;
  }

  // Méthodes pour modifier l'état
  public setPlayer(name: string) {
    this.player.name = name;
  }

  public setGameState(state: GameState) {
    this.gameState = state;
  }

  public setTournament(players: string[], matches: string[][]) {
    this.tournament.players = players;
    this.tournament.matches = matches;
  }
}

// Exemple d'utilisation
const appState = State.getInstance();
appState.setPlayer("Alice");
appState.setGameState("playing");

console.log(appState.player.name); // Alice
console.log(appState.gameState); // playing
