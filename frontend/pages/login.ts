import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';

export function getLoginPage() {
    renderBanner();

    const app = document.getElementById('app');
    if (!app)
        return;

    app.innerHTML = `
    <h1></h1>
    <form id="login-form">
        <h1>Login</h1>
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Connexion</button>
    </form>
  `;

    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        // Appel au backend ici
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("token", data.token);
            state.login(data.username);
            console.log('token is ' + data.token);
            navigate('/');
        } else {
            alert("Connexion failure");
        }
    });
}