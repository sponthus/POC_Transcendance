import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';

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
    const app = document.getElementById('app');
    if (!app)
        return;

    app.innerHTML = `<h1>Loading game...</h1>`;

    const token = localStorage.getItem("token");
    if (!token)
        return;
    try {
        const res = await fetch('/api/game', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!res.ok)
            throw new Error('Failed to load game page info');
        const data = await res.json(); // Possibility to update state with data

        generateGamePage(app);
    } catch (err) {
        console.error(err);
        document.getElementById('app')!.innerHTML = `<h1>Error loading game page, try to log in.</h1>`;
    }
}
