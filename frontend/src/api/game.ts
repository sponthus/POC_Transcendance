import { State } from "../core/state.js";

const state = State.getInstance();

type Result =
    | { ok: true; gameId: number, status: string, player_a: string, player_b: string }
    | { ok: false; error: string }

type PendingGameInfos = {
    id: number;
    status: 'pending' | 'ongoing' | 'finished' | 'canceled';
    player_a: string;
    player_b: string;
    score_a: number;
    score_b: number;
    created_at: string;
}

type Failure = { ok: false; error: string };

type AvailableGamesList = { ok: true; games: PendingGameInfos[] }

export type AvailableGamesResult = AvailableGamesList | Failure;

// POST /games/game request creates a new game for the user, taking names for players
export async function createLocalGame(userId, player_a, player_b): Promise<Result> {
    // TODO = Log check not functional
    const token = localStorage.getItem("token");
    if (!token)
        return { ok: false, error: "No token"};

    console.log('userId = ' + userId + ' playA ' + player_a + ' playB ' + player_b);
    const res = await fetch('/api/games/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            userId: userId,
            player_a: player_a,
            player_b: player_b,
        })
    });
    const data = await res.json(); // Possibility to update state with data

    if (res.ok) {
        return {
            ok: true,
            gameId: data.game_id,
            status: data.status,
            player_a: data.player_a,
            player_b: data.player_b,
        };
    } else {
        // Invalid or expired token = Disconnect
        alert("Error starting game : " + data?.error || "Game start impossible");
        return { ok: false, error: data?.error || "Game start impossible" };
    }
}

// POST /:game_id to launch a game and reserve game server in backend
// Response: {
//   game_id: number,
//   status: "ongoing",
//   players: [string, string]
// }
export async function startGame(gameId: number): Promise<Result> {
    // TODO = Add log check

    if (!gameId) {
        return { ok: false, error: "No game ID given" };
    }
    try {
        const request = await fetch(`api/games/${gameId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Auth header
            }
        });
        if (!request.ok) {
            throw new Error('Unable to start game ' + request.status);
        }
        const data = await request.json();
        return { ok: true, gameId: data.game_id, status: data.status, player_a: data.players[0], player_b: data.players[1] };
    }
    catch (error) {
        return { ok: false, error: error };
    }
}

// GET /:userId/games = all available pending games for a user
export async function getAvailableGames(userId): Promise<AvailableGamesResult> {
    // TODO = Add log check

    if (!userId) {
        return { ok: false, error: 'User ID is required' };
    }
    try {
        const response = await fetch(`/api/games/${userId}/games`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Auth header
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const games: PendingGameInfos[] = await response.json();

        return { ok: true, games: games };

    } catch (error) {
        console.error('Error fetching available games:', error);
        return { ok: false, error: error };
    }
}