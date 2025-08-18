import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { checkLog } from "../api/user-service/check-log.js";
import { BasePage } from "./BasePage.js";

export class GamePage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        this.renderBanner();

        // Check user connexion
        const res = await checkLog();
        if (!res.ok) {
            await navigate('/login');
            return;
        }

        const app = document.getElementById('app');
        if (!app)
            return;

        await this.generateGamePage();
    }

    async generateGamePage() {
        // Show game options
        this.app.innerHTML = `
            <h1>Choose your game mode</h1>
            <p>Welcome, <strong>${state.user?.username}</strong>!</p>

            <div class="game-modes">
                <button id="local-btn">🎮 Local Game</button>
                <button id="online-btn" disabled>🌐 Online vs Player (coming soon)</button>
                <button id="ai-btn" disabled>🤖 AI Opponent (coming soon)</button>
            </div>
        `;

        document.getElementById('local-btn')?.addEventListener('click', async () => {
            await navigate('/local');
        });
    }
}
