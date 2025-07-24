import { navigate } from '../core/router.js';
import { checkLog } from "../api/check-log.js";
import { BasePage } from "./BasePage.js";
import { State } from "../core/state.js";
import { createLocalGame, getAvailableGames, startGame } from "../api/game.ts"

const state = State.getInstance();

export class GamePage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        await this.renderBanner();
        // TODO = Check user connexion
        // const res = await checkLog();
        // if (!res.ok) {
        //     await navigate('/login');
        //     return;
        // }

        await this.generateGamePage();
    }

    async launchGame(gameId: number) {
        try {
            const request = await startGame(gameId);
            if (!request.ok) {
                throw new Error('Unable to start game : ' + request.error);
            }
            state.launchGame(gameId);
            await navigate(`/local`);

        }
        catch (error) {
            alert(error.message);
            await navigate('/game');
        }
    }

    async refreshAvailableGames() {
        const availableGamesDiv = document.getElementById('available-games');
        if (!availableGamesDiv) {
            console.log('availableGames debug');
            this.app.innerHTML = `Error`;
            return;
        }
        try {
            // GET games for userId
            const result = await getAvailableGames(state.user?.id);
            if (!result.ok) {
                availableGamesDiv.innerHTML = 'Error loading games.';
                return;
            }

            const games = result.games;

            // Render list of available games, possibility to show more info about each game if needed
            if (games.length === 0) {
                availableGamesDiv.innerHTML = '<p>No games available</p>';
            } else {
                availableGamesDiv.innerHTML = games.map((game: any) => `
                <div class="game-item" style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 5px;">
                    <h3>Game #${game.id}</h3>
                    <p><strong>Players:</strong> ${game.player_a} vs ${game.player_b}</p>
                    <p><strong>Status:</strong> ${game.status}</p>
                    <p><strong>Created:</strong> ${game.created_at}</p>
                    <button class="play-btn" data-game-id="${game.id}" style="background: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">
                        ▶️ Play
                    </button>
                </div>
                `).join('');

                // TODO : Add a cancel button to suppress a game, will call API with cancelGame(gameId)

                // Add functionality for "Play button"
                document.querySelectorAll('.play-btn').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const gameId = (e.target as HTMLElement).getAttribute('data-game-id') as number;
                        console.log('Button clicked for gameId ' + gameId);
                        await this.launchGame(gameId);
                    });
                });
            }
        }
        catch (error) {
            console.error('Error fetching games:', error);
            availableGamesDiv.innerHTML = '<p>Error loading games</p>';
        }
    }

    async open1v1GameForm(localGameDiv: HTMLElement) {
        localGameDiv.innerHTML = `
            <form id="new-game-form">
                <div style="margin-bottom: 15px;">
                    <label for="player_a">Player A:</label>
                    <input type="text" id="player_a" name="player_a" placeholder="Enter player A name" required />
                    <label>
                        <input type="checkbox" id="player_a_me" name="player_a_me" />
                        Me
                    </label>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="player_b">Player B:</label>
                    <input type="text" id="player_b" name="player_b" placeholder="Enter player B name" required />
                    <label style="margin-top: 5px; display: block;">
                        <input type="checkbox" id="player_b_me" name="player_b_me" style="margin-right: 5px;" />
                        Me
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" id="create-btn">Create Game</button>
                    <button type="button" id="cancel-btn" >Cancel</button>
                </div>
            </form>
        `;

        const playerAMeCheckbox = document.getElementById('player_a_me') as HTMLInputElement;
        const playerBMeCheckbox = document.getElementById('player_b_me') as HTMLInputElement;
        const playerAInput = document.getElementById('player_a') as HTMLInputElement;
        const playerBInput = document.getElementById('player_b') as HTMLInputElement;

        // Add functionality : only 1 checkbox is available
        playerAMeCheckbox?.addEventListener('change', () => {
            if (playerAMeCheckbox.checked) {
                playerBMeCheckbox.checked = false;
                playerAInput.value = state.user?.username || '';
                playerAInput.readOnly = true;
            } else {
                playerAInput.readOnly = false;
                playerAInput.value = '';
            }
        });
        playerBMeCheckbox?.addEventListener('change', () => {
            if (playerBMeCheckbox.checked) {
                playerAMeCheckbox.checked = false;
                playerBInput.value = state.user?.username || '';
                playerBInput.readOnly = true;
            } else {
                playerBInput.readOnly = false;
                playerBInput.value = '';
            }
        });

        // Add the cancel button functionality
        document.getElementById('cancel-btn')?.addEventListener('click', () => {
            localGameDiv.innerHTML = '<button id="local-btn">🎮 Local Game</button>';
            document.getElementById('local-btn')?.addEventListener('click', async () => {
                await this.open1v1GameForm(localGameDiv);
            });
        });

        // Add the form functionality
        const form = document.getElementById('new-game-form');
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);

            const playerARaw = formData.get('player_a');
            const playerBRaw = formData.get('player_b');

            console.log('Raw values:', { playerARaw, playerBRaw });
            console.log('Types:', { typeA: typeof playerARaw, typeB: typeof playerBRaw });

            const playerA = (playerARaw as string)?.trim() || '';
            const playerB = (playerBRaw as string)?.trim() || '';

            console.log('After trim:', { playerA, playerB });
            console.log('Lengths:', { lengthA: playerA.length, lengthB: playerB.length });

            if (!playerA || !playerB) {
                alert('Please enter both player names');
                return;
            }

            if (playerA === playerB) {
                alert('Player names must be different');
                return;
            }

            try {
                // Create game with API
                const request = await createLocalGame(state.user?.id, playerA, playerB);
                if (!request.ok) {
                    throw new Error('Failed to create game');
                }
                // For now not using the returned data

            } catch (error) {
                console.error('Error creating game:', error);
                alert('Error creating game. Please try again.');
            }

            // Cancel render after success
            localGameDiv.innerHTML = '<button id="local-btn">🎮 New</button>';
            document.getElementById('local-btn')?.addEventListener('click', async () => {
                await this.open1v1GameForm(localGameDiv);
            });

            // Refresh available games
            await this.refreshAvailableGames();

            // Success message
            alert('Game created successfully!');
        });
    }

    async generate1v1GamePage() {
        this.app.innerHTML = `
            <h1></h1>
            <h1>1v1 game page</h1>
            <p>Welcome, <strong>${state.user?.username}</strong>!</p>
            
            <div class="game-settings">
                <h2>Create a new game</h2>
                <div id="new-game"><button id="new-btn">🎮 New</button></div>
                <h2>List of available games</h2>
                <div id="available-games"></div>
            </div>
        `;

        // Update content in available games
        await this.refreshAvailableGames();

        // Add functionality : click on local-games open the form to say who plays
        const newGameDiv = document.getElementById('new-game');
        if (!newGameDiv) {
            console.log('availableGames debug');
            this.app.innerHTML = `Error`;
            return;
        }
        document.getElementById('new-btn')?.addEventListener('click', async () => {
            await this.open1v1GameForm(newGameDiv);
        });
    }

    async generateGamePage() {
        // Show game options
        this.app.innerHTML = `
            <h1></h1>
            <h1>Choose your game mode</h1>
            <p>Welcome, <strong>${state.user?.username}</strong>!</p>
            <div class="game-modes">
                <div id="1v1-game"><button id="1v1-btn">🎮 1v1 Game</button></div>
                <div id="tournament"></div><button id="tournament-btn" disabled>Tournament (coming soon)</button></div>
            </div>
        `

        document.getElementById('1v1-btn')?.addEventListener('click', async () => {
            await this.generate1v1GamePage();
        });
    }
}
