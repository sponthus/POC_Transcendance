// This page is the basic logic : every page should inherit from her.
// Has render() and destroy()
import {renderBaseBanner, renderLoggedInBanner, renderLoggedOutBanner} from "./Banner";
import { State } from "../core/state.js";

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

        if (state.isLoggedIn()) {
            const user: null | { username: string, slug: string, id: number } = state.user;
            if (user) {
                await renderLoggedInBanner(this.banner);
            }
            else
                await renderLoggedOutBanner(this.banner);
        }
        else
            await renderLoggedOutBanner(this.banner);
    }

    // Optional : does nothing, can be overloaded if needed, to destroy listeners
    destroy(): void {}
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
