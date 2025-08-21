import { state } from "../ui/state.js";
import { navigate } from "../router.js";
import { checkLog } from "../api/user-service/connection/check-log.js";
import { BasePage } from "./BasePage.js";

import { getUserInfo } from "../api/user-service/user-info/getUserInfo.js";
import { updateUsername } from "../api/user-service/user-info/updateUsername.js";
import { addFriend } from "../api/user-service/menu/friendsList.js";

export class HomePage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        this.renderBanner();
        const res = await checkLog();
        console.log('HOME PAGE res = ', res);
        if (!res.ok && res.error)
        {
            alert(res.error); //que si 401 (expired token)? ou si d'autre erreurs ?
        }
        
        if (state.isLoggedIn()) {
            this.app.innerHTML = `
            <h1>Welcome to Pong !</h1>
            <p>Ready to play?</p>
            <button id="play-btn">Play</button>
        `;

            console.log("COUCOU");
            let res2 = await addFriend("TOM");
            if (res2.ok)
            {
                console.log('userInfo = ', res2.ok);
            }
            else
                console.log('Error = ', res2.error);

       }
        else {
            this.app.innerHTML = `
            <h1>Welcome to Pong !</h1>
            <p>Please, connect to play.</p>
        `;
        }

        document.getElementById('play-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            navigate('/game');
        });

    }
}