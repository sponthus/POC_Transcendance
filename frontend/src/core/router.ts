import { BasePage } from '../pages/BasePage.js';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';
import { LocalGamePage } from '../pages/LocalGamePage.js';
import { UserPage } from '../pages/UserPage.js';
import { GamePage } from '../pages/GamePage.js';
import { State } from "./state.js";
import {buttonClass} from "../pages/Tournaments.js";

const state = State.getInstance();

// Typed by abstraction : needs to inherit from BasePage
let currentPage: BasePage | null = null;

export async function renderRoute(path: string) {
    currentPage?.destroy();

    // Dynamic routes
    if (path.startsWith('/user/')) {
        console.log("before navigation" + state.user?.username);
        const username = path.slice('/user/'.length);
        // const { UserPage } = await import('./pages/UserPage.js');
        currentPage = new UserPage(username);
    }
    else {
        console.log("before navigation" + state.user?.username);
        // Static routes
        switch (path) {
            case '/':
                currentPage = new HomePage();
                break;
            case '/login':
                currentPage = new LoginPage();
                break;
            case '/register':
                currentPage = new RegisterPage();
                break;
            case '/game':
                // const { GamePage } = await import('./pages/GamePage.js');
                currentPage = new GamePage();
                break;
            case '/local':
                currentPage = new LocalGamePage();
                break;
            case '/tournament':
                currentPage = new buttonClass(); // TODO = DEBUG only
                break;
            default:
                currentPage = null;
                break;
        }
    }

    if (currentPage) {
        await currentPage.render();
    }
    else {
        document.getElementById('app')!.innerHTML = `<h1>404 - Page not found</h1>`;
    }
}

export async function navigate(path: string) {
    history.pushState(null, '', path);
    await renderRoute(path);
}

export async function setupRouter() {
    // Handles clicks on intern <a>
    document.body.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.matches('[data-link]')) {
            event.preventDefault();
            const href = target.getAttribute('href');
            if (href)
                navigate(href);
        }
    });

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
        renderRoute(location.pathname);
    });

    await renderRoute(location.pathname); // Shows good screen when loading
}