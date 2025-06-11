import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';
import {checkLog} from "../api/check-log.js";

export async function getLocalGamePage() {
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


    // Show game options
    app.innerHTML = `
        <h1>Local game</h1>
        <p>Controls : ⬆️ ⬇️ and 🇪 🇩 - Pause : SPACE bar</p>
        <div id="score"> Score : </div>
        <canvas id="game"> Game canvas. </canvas>
    `;

    const canvas = document.getElementById('game') as HTMLCanvasElement;
    if (!canvas) {
        console.error("Canvas element not found.");
        return;
    }
    resizeCanvas(canvas);
    canvas.style.border = "1px solid red";

    window.addEventListener('resize', () => resizeCanvas(canvas));
}

function resizeCanvas(canvas: HTMLCanvasElement) {
    if (window.innerWidth * 0.6 >= 600)
        state.canvas.width = window.innerWidth * 0.6;
    else
        state.canvas.width = 600;
    if (window.innerHeight * 0.6 >= 400)
        state.canvas.height = window.innerHeight * 0.6;
    else
        state.canvas.height = 400;
    canvas.width = state.canvas.width;
    canvas.height = state.canvas.height;
}