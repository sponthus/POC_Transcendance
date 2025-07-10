import { state } from "./ui/state.js";
import {App} from "./babylon/main.js"
import { BasePage } from "./pages/BasePage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { HomePage } from './pages/HomePage.js';

let currentPage: BasePage | null = null;

export async function renderRoute(path: string) {
    currentPage?.destroy();

    // Dynamic routes
    if (path.startsWith('/user/')) {
        const username = path.slice('/user/'.length);
        const { UserPage } = await import('./pages/UserPage');
		currentPage = new UserPage("username");
    }
    else {
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
                currentPage = new App();
                break;
        }
    }

    if (currentPage) {
        await currentPage.render();
    }
    else {
        document.getElementById('app')!.innerHTML = `<h1>404 - Page not found</h1>`;
    }
    const savedUser = localStorage.getItem('user-info');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
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