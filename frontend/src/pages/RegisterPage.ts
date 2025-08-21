import { navigate } from '../router.js';
import { checkLog } from "../api/user-service/connection/check-log.js";
import { registerUser } from "../api/user-service/connection/registerUser.js";
import { BasePage } from "./BasePage.js";

export class RegisterPage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        this.renderBanner();

        /*const res = await checkLog();
        if (res.ok) {
            this.app.innerHTML = `
                <h1></h1>
                <h1>Already logged in as ${res.user.username}.</h1>
            `;
            return ;
        }
        else {
            if (res.error)
                alert(res.error);
        }*/

        this.app.innerHTML = `
        <h1></h1>
        <form id="register-form">
            <h1>New User</h1>
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Create account</button>
        </form>
        `;

        const form = document.getElementById('register-form') as HTMLFormElement;
        if (!form) {
            this.app.innerHTML = `Error`;
        }

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
                alert (req.error);
                return ; // registerUser already alerts user
            }
        });
    }
}
