import { state } from "../ui/state.js";
import { navigate } from "../router.js";
import { checkLog } from "../api/user-service/check-log.js";
import { BasePage } from "./BasePage.js";
import { changeCharacterAsset, getCharacterAsset } from "../api/user-service/characterAsset.js";
import { changeNpcAsset, getNpcAsset } from "../api/user-service/npcAsset.js";

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

            let res = await getNpcAsset();
            if (res.ok)
            {
                console.log('asset = ', res.asset);
            }
            else
                console.log('Error = ', res.error);

            res = await changeNpcAsset(10);
            if (res.ok)
            {
                console.log('asset = ', res.asset);
            }
            else
                console.log('Error = ', res.error);

        } else {
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