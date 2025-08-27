// This page is the basic logic : every page should inherit from her.
// Has render() and destroy()
import { renderBaseBanner, renderLoggedInBanner, renderLoggedOutBanner } from "./Banner";
import { State } from "../core/state.js";
import { checkLog } from "../api/user-service/connection/check-log";
import { getUserInfo } from "../api/user-service/user-info/getUserInfo";

const state = State.getInstance();

export abstract class BasePage {
    protected app: HTMLElement;
    protected banner: HTMLElement;

    // Protected = Cannot be instantiated directly
    protected constructor() {
        const appDiv = document.getElementById('app');
        if (!appDiv)
            throw new Error('App element not found');
        this.app = appDiv;
        const bannerDiv = document.getElementById('banner');
        if (!bannerDiv)
            throw new Error('Banner element not found');
        this.banner = bannerDiv;
    }

    // Mandatory : Implement this in pages
    abstract render(): Promise<void>;

    protected async renderBanner(): Promise<void> {
        renderBaseBanner(this.banner);

        const res = await checkLog();
        if (res.ok) {
            const req = await getUserInfo();
            if (!req.ok) {
                return; // Afficher une erreur ??
            }
            const userData = req.userInfo;
            await renderLoggedInBanner(this.banner, userData);
        }
        else {
            await renderLoggedOutBanner(this.banner);
            //alert(res.error); pas d'alerte peut etre la 
        }
    }

    protected initBackground(): HTMLElement {
        const BackgroundHome = document.createElement('div');
        BackgroundHome.className = "flex flex-col items-center min-h-screen p-8";
        BackgroundHome.style.backgroundImage = "url('/background1.gif')";
        BackgroundHome.style.backgroundSize = "cover";
        BackgroundHome.style.backgroundPosition = "center";
        return BackgroundHome;
    }
    // Optional : does nothing, can be overloaded if needed, to destroy listeners
    destroy(): void { }
}


// How to inherit from BasePage :
// export class GamePage extends BasePage {
//     private onKeydown: (e: KeyboardEvent) => void;
//     constructor() {
//          super(); // Calls the parent constructor
//         this.onKeydown = this.handleKeydown.bind(this);
//     }
//     render(): void {
//         this.app.innerHTML = `
//       <h1>Page de jeu</h1>
//       <p>Paragraph</p>
//     `;
//         window.addEventListener('keydown', this.onKeydown);
//     }
//     private handleKeydown(e: KeyboardEvent): void {
//         console.log('Pressed key :', e.key);
//     }
//     destroy(): void {
//         window.removeEventListener('keydown', this.onKeydown);
//         this.app.innerHTML = ''; // Clean visual
//     }
// }
