import { navigate } from '../router.js';
import { renderBanner } from './menu.js';
import { checkLog } from "../api/check-log.js";
import { loginUser } from "../api/user.js";

export async function getLoginPage() {
    renderBanner();

    const app = document.getElementById('app');
    if (!app)
        return;

    const res = await checkLog();
    if (res.ok)
    {
        app.innerHTML = `
                <h1></h1>
                <h1>Already logged in as ${res.user.username}.</h1>
            `;
        return ;
    }

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

        const req = await loginUser(username, password);
        if (req.ok) {
            await navigate('/');
            return ;
        }
        else {
            alert("Connexion failure" + req.error);
        }
    });
}