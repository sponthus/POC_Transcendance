import { setupRouter } from './router.js';
import { state } from './ui/state.js';

console.log("JS loaded !");

const app = document.getElementById("app");
if (app) {
    app.innerHTML = "<h1>Home page</h1>";
} else {
    console.warn("No div#app found !");
}

async function restoreSession() {
    const token = localStorage.getItem("token");
    if (!token)
        return;

    const res = await fetch('/api/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (res.ok) {
        const data = await res.json();
        state.login(data.username); // Restore user in state
    } else {
        // Invalid or expired tokem = Disconnect
        localStorage.removeItem("token");
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await restoreSession();
    setupRouter();
});