import { getHomePage } from './pages/home.js';
import { getLoginPage } from './pages/login.js';
import { getRegisterPage } from './pages/register.js';
import { getGamePage } from "./pages/game.js";
import { getLocalGamePage } from "./pages/local.js";
import { getUserPage } from "./pages/user.js";
import { state } from "./ui/state.js";

const routes: Record<string, () => void> = {
    '/': getHomePage,
    '/login': getLoginPage,
    '/register': getRegisterPage,
    '/game': getGamePage,
    '/local': getLocalGamePage,
};

export async function renderRoute(path: string) {
    const view = routes[path] || (() => {
        document.getElementById('app')!.innerHTML = `<h1>404 - Page not found</h1>`;
    });

    const savedUser = localStorage.getItem('user-info');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
    }

    // Dynamic routes : ie user/me
    if (path.startsWith('/user/')) {
        const username = path.slice('/user/'.length);
        await getUserPage(username);
        return;
    }

    view();
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