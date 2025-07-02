// import { state } from '../ui/state.js';
import { navigate } from '../router.js';
import { state } from "../ui/state";

export function renderBaseBanner(banner: HTMLElement): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';

    const logo = document.createElement('div');
    logo.className = 'logo';
    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.textContent = 'Pong';
    logo.appendChild(logoLink);
    wrapper.appendChild(logo);

    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.id = 'user-info';
    const navLinks = document.createElement('ul');
    navLinks.className = 'nav-links';
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
        banner.innerHTML = 'Errorrrr';
        return;
    }

    userInfo.textContent = 'You are not connected.';

    const loginItem = document.createElement('li');
    const loginLink = document.createElement('a');
    loginLink.href = '/login';
    loginLink.textContent = 'Connexion';
    loginItem.appendChild(loginLink);

    const registerItem = document.createElement('li');
    const registerLink = document.createElement('a');
    registerLink.href = '/register';
    registerLink.textContent = 'New User';
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
        banner.innerHTML = 'EError';
        return;
    }

    userInfo.innerHTML = `Connected as : <strong>${state.user?.username}</strong>`;

    const profileItem = document.createElement('li');
    const profileLink = document.createElement('a');
    profileLink.href = `/user/${state.user?.slug}`;
    profileLink.textContent = 'Profile';
    profileItem.appendChild(profileLink);
    navLinks.appendChild(profileItem);

    const logoutItem = document.createElement('li');
    const logoutLink = document.createElement('a');
    logoutLink.href = '/';
    logoutLink.textContent = 'Logout';
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        state.logout();
        await navigate('/');
    });
    logoutItem.appendChild(logoutLink);
    navLinks.appendChild(logoutItem);
}

// export function renderBanner(): void {
//     // const banner = document.getElementById('banner');
//     // if (!banner)
//     //     return;
//
//     // const wrapper = document.createElement('div');
//     // wrapper.className = 'wrapper';
//     //
//     // const logo = document.createElement('div');
//     // logo.className = 'logo';
//     // const logoLink = document.createElement('a');
//     // logoLink.href = '/';
//     // logoLink.textContent = 'Pong';
//     // logo.appendChild(logoLink);
//     // wrapper.appendChild(logo);
//     //
//     // const userInfo = document.createElement('div');
//     // const navLinks = document.createElement('ul');
//     // navLinks.className = 'nav-links';
//
//     if (state.isLoggedIn() && state.user?.username) {
//         // userInfo.innerHTML = `Connected as : <strong>${state.user.username}</strong>`;
//         //
//         // const profileItem = document.createElement('li');
//         // const profileLink = document.createElement('a');
//         // profileLink.href = `/user/${state.user.slug}`;
//         // profileLink.textContent = 'Profile';
//         // profileItem.appendChild(profileLink);
//         // navLinks.appendChild(profileItem);
//         //
//         // const logoutItem = document.createElement('li');
//         // const logoutLink = document.createElement('a');
//         // logoutLink.href = '/';
//         // logoutLink.textContent = 'Logout';
//         // logoutLink.addEventListener('click', (e) => {
//         //     e.preventDefault();
//         //     state.logout();
//         //     navigate('/');
//         // });
//         // logoutItem.appendChild(logoutLink);
//         // navLinks.appendChild(logoutItem);
//     } else {
//         userInfo.textContent = 'You are not connected.';
//
//         const loginItem = document.createElement('li');
//         const loginLink = document.createElement('a');
//         loginLink.href = '/login';
//         loginLink.textContent = 'Connexion';
//         loginItem.appendChild(loginLink);
//
//         const registerItem = document.createElement('li');
//         const registerLink = document.createElement('a');
//         registerLink.href = '/register';
//         registerLink.textContent = 'New User';
//         registerItem.appendChild(registerLink);
//
//         navLinks.appendChild(loginItem);
//         navLinks.appendChild(registerItem);
//     }
//
//     wrapper.appendChild(userInfo);
//     wrapper.appendChild(navLinks);
//
//     banner.innerHTML = ''; // cleans existing
//     banner.appendChild(wrapper);
// }
