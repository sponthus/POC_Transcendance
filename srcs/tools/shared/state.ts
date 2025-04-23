// import db from './backend/database.js'

type GameState = "idle" | "playing" | "paused" | "gameover";

export type Player = {
  id: number;
  name: string;
  score: number;
};

export class State {
  private static instance: State;

  public players: Map<number, Player> = new Map();
  public gameState: GameState;
  public tournament: { players: string[]; matches: string[][] };
  public localPlayerA: { id: number | null; connected: boolean } ;
  public localPlayerB: { id: number | null; connected: boolean };

  public game_width: number = 600;
  public game_height: number = 400;
  public paddle_height: number = 60;
  public paddle_width: number = 5;
  public paddle_padding: number = 10;
  public paddle_speed: number = 10;
  public ball_speed: number = 8;
  public ball_size: number = 10;

  private constructor() {
    this.gameState = "idle";
    this.tournament = { players: [], matches: [] };
    this.localPlayerA = { id: null, connected: false };
    this.localPlayerB = { id: null, connected: false };

  }

  // Singleton
  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }
    return State.instance;
  }

  public getPlayer(id: number): Player | undefined {
    return this.players.get(id);
  }

  public getPlayerByName(name: string): Player | undefined {
    for (const player of this.players.values()) {
      if (player.name === name) {
        return player;
      }
    }
    return undefined;
  }

  public getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  public getMaxPlayerId(): number {
    return this.players.size;
  }

  public addPlayer(id: number, name: string) {
    if (!this.players.has(id)) {
      // db.prepare(`INSERT OR IGNORE INTO players (id, name) VALUES (?, ?)`).run(id, name);
      // const row = db.prepare(`SELECT * FROM players WHERE id = ?`).get(id);
      this.players.set(id, { id, name, score: 0 });
    }
  }

  public setPlayerName(id: number, name: string) {
    const player = this.players.get(id);
    if (player !== undefined)
    {
      player.name = name
    }
  }

  public getLocalPlayerA(): Player | null {
    return this.localPlayerA.id !== null ? this.players.get(this.localPlayerA.id) ?? null : null;
  }

  public getLocalPlayerB(): Player | null {
    return this.localPlayerB.id !== null ? this.players.get(this.localPlayerB.id) ?? null : null;
  }

  public setLocalPlayerA(id: number): void {
    this.localPlayerA.id = id;
  }

  public setLocalPlayerB(id: number): void {
    this.localPlayerB.id = id;
  }

  public setGameState(state: GameState) {
    this.gameState = state;
  }

  public updateScore(id: number, delta: number) {
    const player = this.players.get(id);
    if (!player)
      return;
    player.score += delta;
    this.players.set(id, player);
    // db.prepare(`UPDATE players SET score = ? WHERE id = ?`).run(player.score, id);
  }

  public getScore(id: number): number {
    const player = this.players.get(id);
    if (!player)
      return -1;
    return player.score;
  }

  public setTournament(players: string[], matches: string[][]) {
    this.tournament.players = players;
    this.tournament.matches = matches;
  }
}
