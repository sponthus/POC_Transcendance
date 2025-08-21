import { state } from "../ui/state.js";
import { navigate } from "../router.js";
import { checkLog } from "../api/user-service/check-log.js";
import { BasePage } from "./BasePage.js";
import { changeCharacterAsset, getCharacterAsset } from "../api/user-service/characterAsset.js";
import { changeNpcAsset, getNpcAsset } from "../api/user-service/npcAsset.js";

import { getBackgroundColor, changeBackgroundColor } from "../api/user-service/backgroundColor.js";
import { getUserInfo } from "../api/user-service/getUserInfo.js";
import { updateUsername } from "../api/user-service/updateUsername.js";

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

            let res2 = await getUserInfo();
            if (res2.ok)
            {
                console.log('userInfo = ', res2.userInfo);
            }
            else
                console.log('Error = ', res2.error);



            let res = await updateUsername("TOM");
            if (res.ok)
            {
                console.log('userInfo = ', res.user);
            }
            else
                console.log('Error = ', res.error);

            res2 = await getUserInfo();
            if (res2.ok)
            {
                console.log('userInfo = ', res2.userInfo);
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