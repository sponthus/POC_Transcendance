import { state } from '../ui/state.js';
import { navigate } from '../router.js';

export function getLoginPage() {
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

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            state.logout();
            navigate('/');
        });
    } else {
        banner.innerHTML = `
            <div style="background: #eef; padding: 1em;">You are not connected. <a href="/login" data-link>Connexion</a> <a href="/register" data-link>New User</a></div>
        `;
    }

    app.innerHTML = `
    <h1>Connexion</h1>
    <form id="login-form">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Connexion</button>
    </form>
    <p><a href="/" data-link>Back</a></p>
  `;

    // const form = document.getElementById('login-form') as HTMLFormElement;
    // form.addEventListener('submit', async (e) => {
    //     e.preventDefault();
    //
    //     const username = (document.querySelector('input[name="username"]') as HTMLInputElement).value;
    //     const password = (document.querySelector('input[name="password"]') as HTMLInputElement).value;
    //
    //     console.log('Trying to login with :', username, password);
    //
    //     const res = await fetch('/post/', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ username, password }),
    //     });
    //
    //     console.log("request posted");
    //     if (res.ok) {
    //         window.location.href = '/';
    //     } else {
    //         const data = await res.json();
    //         alert(`Error: ${data.error}`);
    //     }
    // });

    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        // Appel au backend ici
        const res = await fetch('/post/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            state.login(username); // Stocks user when login success
            navigate('/');
        } else {
            alert("Connexion failure");
        }
    });
}