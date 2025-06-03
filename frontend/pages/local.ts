import { state } from '../ui/state.js';
import { navigate } from '../router.js';

export function getLocalGamePage() {
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
        <h1>Local game</h1>
        <p>Controls : ⬆️ ⬇️ and 🇪 🇩 - Pause : SPACE bar</p>
        <div id="score"> Score : </div>
        <canvas id="game"> Game canvas. </canvas>
        <a href="/" data-link>Back to home</a>
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