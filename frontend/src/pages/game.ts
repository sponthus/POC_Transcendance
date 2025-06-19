import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';
import {checkLog} from "../api/check-log.js";
import {startLocalGame} from "../api/game.js";

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
        navigate('/local');
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

    generateGamePage(app);
}