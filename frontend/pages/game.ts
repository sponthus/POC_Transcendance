import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';
import {checkLog} from "../api/check-log";
import {startLocalGame} from "../api/game";

function generateGamePage(app: HTMLElement) {
    // Check user connexion
    if (!state.user) {
        navigate('/login');
        return;
    }

    // Show game options
    app.innerHTML = `
        <h1>Choose your game mode</h1>
        <p>Welcome, <strong>${state.user.username}</strong>!</p>

        <div class="game-modes">
            <button id="local-btn">🎮 Local Game</button>
            <button id="online-btn" disabled>🌐 Online vs Player (coming soon)</button>
            <button id="ai-btn" disabled>🤖 AI Opponent (coming soon)</button>
        </div>
    `;

    document.getElementById('local-btn')?.addEventListener('click', () => {
        navigate('/local'); // TODO : Create /local page
    });
}

export async function getGamePage() {
    renderBanner();

    // Check user connexion
    const res = await checkLog();
    if (!res.ok)
    {
        await navigate('/login');
        return;
    }

    const app = document.getElementById('app');
    if (!app)
        return;

    app.innerHTML = `<h1>Loading game...</h1>`;

    const token = localStorage.getItem("token");
    if (!token)
        return;

    const req = await startLocalGame();
    if (req.ok) {
        generateGamePage(app);
    }
    else {
        console.error(req.error);
        document.getElementById('app')!.innerHTML = `<h1>Error loading game page, try to log in.</h1>`;
    }
}
