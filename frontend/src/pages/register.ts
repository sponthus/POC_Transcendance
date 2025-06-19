import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { renderBanner } from './menu.js';
import { checkLog } from "../api/check-log.js";
import {registerUser} from "../api/user.js";

export async function getRegisterPage() {
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

        const req = await registerUser(username, password);
        if (req.ok) {
            await navigate('/');
            return ; // back to home
        }
        else {
            return ; // registerUser already alerts user
        }
    });
}
