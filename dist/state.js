export class State {
    static instance;
    // Données stockées
    player;
    gameState;
    tournament;
    constructor() {
        this.player = { id: 0, name: "", score: 0 };
        this.gameState = "idle";
        this.tournament = { players: [], matches: [] };
    }
    // Singleton : une seule instance de State dans l'application
    static getInstance() {
        if (!State.instance) {
            State.instance = new State();
        }
        return State.instance;
    }
    // Méthodes pour modifier l'état
    setPlayer(name) {
        this.player.name = name;
    }
    setGameState(state) {
        this.gameState = state;
    }
    setTournament(players, matches) {
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
