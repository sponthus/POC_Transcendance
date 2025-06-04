import { state } from '../ui/state.js';
import { navigate } from '../router.js';

export function renderBanner(): void {
    const banner = document.getElementById('banner');
    if (!banner)
        return;

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
    const navLinks = document.createElement('ul');
    navLinks.className = 'nav-links';

    if (state.isLoggedIn() && state.user?.username) {
        userInfo.innerHTML = `Connected as : <strong>${state.user?.username}</strong>`;

        const profileItem = document.createElement('li');
        const profileLink = document.createElement('a');
        profileLink.href = `/user/${state.user.username}`;
        profileLink.textContent = 'Profile';
        profileItem.appendChild(profileLink);
        navLinks.appendChild(profileItem);

        const logoutItem = document.createElement('li');
        const logoutLink = document.createElement('a');
        logoutLink.href = '/';
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            state.logout();
            navigate('/');
        });
        logoutItem.appendChild(logoutLink);
        navLinks.appendChild(logoutItem);
    } else {
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

    wrapper.appendChild(userInfo);
    wrapper.appendChild(navLinks);

    banner.innerHTML = ''; // cleans existing
    banner.appendChild(wrapper);
}
