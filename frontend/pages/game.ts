import { state } from '../ui/state.js';
import { navigate } from '../router.js';

export function getGamePage() {
    const app = document.getElementById('app');
    if (!app)
        return;

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
        <p><a href="/" data-link>Back</a></p>
    `;

    document.getElementById('local-btn')?.addEventListener('click', () => {
        navigate('/local'); // TODO : Create /local page
    });
}
