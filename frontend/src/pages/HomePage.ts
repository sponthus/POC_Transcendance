import { navigate } from "../core/router.js";
import { BasePage } from "./BasePage.js";
import { State } from "../core/state.js";

const state = State.getInstance();

export class HomePage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        await this.renderBanner();

        // TODO = Add real check of log
        if (state.user) {
            this.app.innerHTML = `
            <h1>Welcome to Pong !</h1>
            <p>Ready to play?</p>
            <button id="play-btn">Play</button>
        `;
        } else {
            this.app.innerHTML = `
            <h1>Welcome to Pong !</h1>
            <p>Please, connect to play.</p>
        `;
        }

        document.getElementById('play-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await navigate('/game');
        });

    }
}
