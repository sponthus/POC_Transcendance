import { state } from "../ui/state.js";
import { navigate } from "../router.js";
import { checkLog } from "../api/check-log.js";
import { BasePage } from "./BasePage.js";

export class HomePage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        this.renderBanner();
        checkLog();

        if (state.isLoggedIn()) {
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
            navigate('/game');
        });

    }
}
//
// export function getHomePage() {
//     renderBanner();
//     checkLog();
//     const app = document.getElementById('app');
//     if (!app)
//         return;
//
//     if (state.isLoggedIn()) {
//         app.innerHTML = `
//             <h1>Welcome to Pong !</h1>
//             <p>Ready to play?</p>
//             <button id="play-btn">Play</button>
//         `;
//     } else {
//         app.innerHTML = `
//             <h1>Welcome to Pong !</h1>
//             <p>Please, connect to play.</p>
//         `;
//     }
//
//     document.getElementById('play-btn')?.addEventListener('click', async (e) => {
//         e.preventDefault();
//         navigate('/game');
//     });
//
// }

// <div style="background: #eef; padding: 1em;">Connected as : <strong>${state.user?.username}</strong></div>