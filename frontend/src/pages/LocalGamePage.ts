import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { checkLog } from "../api/check-log.js";
// import { startLocalGame } from "../api/game.js";
import { PongGame } from "../game/pong_game.js";
import { BasePage } from "./BasePage.js";

export class LocalGamePage extends BasePage {
    protected slug: string;

    constructor() {
        super();
    }

    // Possibility : If several game modes are available = inherits from a game page with several players
    async render(): Promise<void> {
        this.renderBanner();

        // Check user connexion
        const res = await checkLog();
        if (!res.ok) {
            await navigate('/login');
            return;
        }

        this.app.innerHTML = `<h1>Loading game...</h1>`;
        // Insert here logic to check which game to join + ws initialization

        // Show game options
        this.app.innerHTML = `
            <h1>Local game</h1>
            <p>Controls : ⬆️ ⬇️ (not implemented - auto right now) and  🇦 🇩  - Pause : SPACE bar (not implemented)</p>
            <div id="score"> Score : </div>
            <canvas id="game"> Game canvas. </canvas>
        `;

        const canvas = document.getElementById('game') as HTMLCanvasElement;
        if (!canvas) {
            console.error("Canvas element not found.");
            return;
        }
        this.resizeCanvas(canvas);

        new PongGame();
        console.log("Pong game created");
    }

    // TODO = Add this in a listener of resizing ?
    resizeCanvas(canvas: HTMLCanvasElement) {
        if (window.innerWidth * 0.6 >= 600)
            state.canvas.width = window.innerWidth * 0.6;
        else
            state.canvas.width = 600;
        state.canvas.height = state.canvas.width * 2/3;
        canvas.width = state.canvas.width;
        canvas.height = state.canvas.height;
    }
}
//
// export async function getLocalGamePage() {
//     renderBanner();
//
//     // Check user connexion
//     const res = await checkLog();
//     if (!res.ok)
//     {
//         await navigate('/login');
//         return;
//     }
//
//     const app = document.getElementById('app');
//     if (!app)
//         return;
//
//
//     app.innerHTML = `<h1>Loading game...</h1>`;
//     // Insert here logic to check which game to join + ws initialization
//
//     // Show game options
//     app.innerHTML = `
//         <h1>Local game</h1>
//         <p>Controls : ⬆️ ⬇️ (not implemented - auto right now) and  🇦 🇩  - Pause : SPACE bar (not implemented)</p>
//         <div id="score"> Score : </div>
//         <canvas id="game"> Game canvas. </canvas>
//     `;
//
//     const canvas = document.getElementById('game') as HTMLCanvasElement;
//     if (!canvas) {
//         console.error("Canvas element not found.");
//         return;
//     }
//     resizeCanvas(canvas);
//
//     new PongGame();
//     console.log("Pong game created");
//
//     // const req = await startLocalGame();
//     // if (req.ok) {
//     //     // Show game options
//     //     app.innerHTML = `
//     //         <h1>Local game</h1>
//     //         <p>Controls : ⬆️ ⬇️ and 🇪 🇩 - Pause : SPACE bar</p>
//     //         <div id="score"> Score : </div>
//     //         <canvas id="game"> Game canvas. </canvas>
//     //     `;
//     //
//     //     const canvas = document.getElementById('game') as HTMLCanvasElement;
//     //     if (!canvas) {
//     //         console.error("Canvas element not found.");
//     //         return;
//     //     }
//     //     resizeCanvas(canvas);
//     //     canvas.style.border = "1px solid red";
//     //
//     //     window.addEventListener('resize', () => resizeCanvas(canvas));
//     // }
//     // else {
//     //     console.error(req.error);
//     //     document.getElementById('app')!.innerHTML = `<h1>Error loading game page, try to log in.</h1>`;
//     //     return;
//     // }
// }
