import { state } from "../ui/state.js";
import { navigate } from "../router.js";

export function getHomePage() {
    const app = document.getElementById('app');
    if (!app)
        return;

    const banner = document.getElementById('banner');
    if (!banner)
        return;

    if (state.isLoggedIn()) {
        banner.innerHTML = `
            <div style="background: #eef; padding: 1em;">Connected as : <strong>${state.user?.username}</strong> <button id="logout-btn">Logout</button></div>
        `;

        app.innerHTML = `
            <h1>Welcome to Pong !</h1>
            <p>Ready to play?</p>
            <button id="play-btn">Play</button>
        `;

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            state.logout();
            navigate('/');
        });

        document.getElementById('play-btn')?.addEventListener('click', () => {
            navigate('/game');
        });

    } else {
        banner.innerHTML = `
            <div style="background: #eef; padding: 1em;">You are not connected. <a href="/login" data-link>Connexion</a> <a href="/register" data-link>New User</a></div>
        `;
        app.innerHTML = `
            <h1>Welcome to Pong !</h1>
            <p>Please, connect to play.</p>
        `;
    }
}


// <div style="background: #eef; padding: 1em;">Connected as : <strong>${state.user?.username}</strong></div>