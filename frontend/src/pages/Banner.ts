import { navigate } from '../router.js';
import { state } from "../ui/state";

/**********not sur we keep this page , i will add banner into babylonjs game******************/
export function renderBaseBanner(banner: HTMLElement): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center justify-between p-4 bg-white shadow-md';

    const logo = document.createElement('div');
    logo.className = 'flex items-center'

    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.textContent = 'Pong';
	logoLink.className = 'text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors'
    logo.appendChild(logoLink);
    wrapper.appendChild(logo);

    const userInfo = document.createElement('div');
    userInfo.className = 'text-sm text-gray-600';
    userInfo.id = 'user-info';

    const navLinks = document.createElement('ul');
    navLinks.className = 'flex space-x-4 list-none';
    navLinks.id = 'nav-links';

    wrapper.appendChild(userInfo);
    wrapper.appendChild(navLinks);

    banner.innerHTML = ''; // cleans existing
    banner.appendChild(wrapper);
}

export async function renderLoggedOutBanner(banner: HTMLElement): Promise<void> {
    const navLinks = document.getElementById('nav-links');
    const userInfo = document.getElementById('user-info');
    if (!navLinks || !userInfo) {
        if (!navLinks)
            console.log("No nav link");
        if (!userInfo)
            console.log("No user info");
        banner.innerHTML = '<div class="text-red-500 font-semibold">Error</div>';
        return;
    }

    userInfo.textContent = 'You are not connected.';
	userInfo.className = 'text-sm text-gray-500';

    const loginItem = document.createElement('li');
    const loginLink = document.createElement('a');
    loginLink.href = '/login';
    loginLink.textContent = 'Connexion';
	loginLink.className = 'px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors';
    loginItem.appendChild(loginLink);

    const registerItem = document.createElement('li');
    const registerLink = document.createElement('a');
    registerLink.href = '/register';
    registerLink.textContent = 'New User';
	registerLink.className = 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors';
    registerItem.appendChild(registerLink);

    navLinks.appendChild(loginItem);
    navLinks.appendChild(registerItem);
}

export async function renderLoggedInBanner(banner: HTMLElement): Promise<void> {
    const navLinks = document.getElementById('nav-links');
    const userInfo = document.getElementById('user-info');
    if (!navLinks || !userInfo || !state.user) {
        if (!navLinks)
            console.log("No nav link");
        if (!userInfo)
            console.log("No user info");
        if (!state.user) {
            console.log("No user in state");
        }
        banner.innerHTML = '<div class="text-red-500 font-semibold">Error</div>';
        return;
    }

    userInfo.innerHTML = `<span class="text-sm text-gray-600">Connected as : <strong class="text-gray-900">${state.user?.username}</strong></span>`;

    const profileItem = document.createElement('li');
    const profileLink = document.createElement('a');
    profileLink.href = `/user/${state.user?.slug}`;
    profileLink.textContent = 'Profile';
	profileLink.className = 'px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors';
    profileItem.appendChild(profileLink);
    navLinks.appendChild(profileItem);

    const logoutItem = document.createElement('li');
    const logoutLink = document.createElement('a');
    logoutLink.href = '/';
    logoutLink.textContent = 'Logout';
	logoutLink.className = 'px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors cursor-pointer';
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        state.logout();
        await navigate('/');
    });
    logoutItem.appendChild(logoutLink);
    navLinks.appendChild(logoutItem);
}
