import { state } from '../ui/state.js';
import { navigate } from '../router.js';

export function getRegisterPage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <h1>Create a new user</h1>
        <form id="register-form">
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Create account</button>
        </form>
        <p><a href="/" data-link>Back</a></p>
    `;

    const form = document.getElementById('register-form') as HTMLFormElement;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            const res = await fetch('/post/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                state.login(username); // local login
                navigate('/'); // back to home
            } else {
                const error = await res.json();
                alert("Erreur : " + error?.error || "Account creation impossible");
            }

        } catch (err) {
            alert("Connexion error with server");
            console.error(err);
        }
    });
}
