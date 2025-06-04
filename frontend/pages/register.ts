import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';

export function getRegisterPage() {
    renderBanner();

    const app = document.getElementById('app');
    if (!app)
        return;

    app.innerHTML = `
        <h1></h1>
        <form id="register-form">
            <h1>New User</h1>
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Create account</button>
        </form>
    `;

    const form = document.getElementById('register-form') as HTMLFormElement;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log('token is ' + data.token);
                localStorage.setItem("token", data.token);
                state.login(data.username); // local login
                navigate('/'); // back to home
            } else {
                const error = await res.json();
                alert("Error : " + error?.error || "Account creation impossible");
            }

        } catch (err) {
            alert("Connexion error with server");
            console.error(err);
        }
    });
}
