import { navigate } from '../router.js';
import { state } from "../ui/state";

export function renderBaseBanner(banner: HTMLElement): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'grid grid-cols-3 items-center justify-between p-4 bg-orange-200 shadow-md';
    
	const userInfo = document.createElement('div');
    userInfo.className = 'flex flex-wrap order-1 text-sm text-gray-600';
    userInfo.id = 'user-info';

    const logo = document.createElement('div');
    logo.className = 'mx-auto order-2'

    const logoLink = document.createElement('a');
    logoLink.href = '/';
    // logoLink.textContent = 'Island World';
	logoLink.className = 'text-2xl font-bold text-emerald-400 hover:text-emerald-800 transition-colors'
	
	const logoImg = document.createElement('img');
	logoImg.className = "mx-auto object-cover rounded-full hover:bg-emerald-600 object-center h-12 w-18";
	logoImg.src = "/logo/logoIlsandWorld.png";

	logoLink.appendChild(logoImg);
    logo.appendChild(logoLink);
	
    wrapper.appendChild(logo);


    const navLinks = document.createElement('ul');
    navLinks.className = 'flex justify-end space-x-4 order-3 list-none';
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
	userInfo.className = 'text-sm text-emerald-600';

    const loginItem = document.createElement('li');
    const loginLink = document.createElement('a');
    loginLink.href = '/login';
    loginLink.textContent = 'Login';
	loginLink.className = 'px-4 py-2 text-emerald-600  hover:text-emerald-800 hover:bg-orange-300 rounded-md transition-colors';
    loginItem.appendChild(loginLink);

    const registerItem = document.createElement('li');
    const registerLink = document.createElement('a');
    registerLink.href = '/register';
    registerLink.textContent = 'Register';
	registerLink.className = 'px-4 py-2 bg-emerald-600 text-green-200 hover:bg-emerald-800 rounded-md transition-colors';
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

	const usersForm = document.createElement('div');
	usersForm.className = "flex flex-col text-left text-sm text-emerald-600";

	const userState = document.createElement('div');
	userState.id = "user-state";
	userState.className = "";
	userState.textContent = "online 💚"; //  call API

	const userName = document.createElement('div');
	userName.id = "user-name";
	userName.className = "text-emerald-900";
	userName.textContent = state.user?.username;

	usersForm.appendChild(userState);
	usersForm.appendChild(userName);


	const userIconForm = document.createElement('div');
	userIconForm.className = "flex items-center mr-2";

	const userIcon = document.createElement('div');
	userIcon.className = "flex items-center justify-center bg-orange-300 rounded-full relative w-14 h-14";

	const userImg = document.createElement('img');
	userImg.id = "user-img";
	userImg.className = "w-12 h-12 rounded-full object-cover object-center";
	userImg.src = "asset/pic/carlo.jpg"; // call api for userImg
	
	userIcon.appendChild(userImg);

	userIconForm.appendChild(userIcon);

	userInfo.appendChild(userIconForm);
	userInfo.appendChild(usersForm);

	const settingItem = document.createElement('li');
	const settingLink = document.createElement('a');
	settingLink.href = '/setting';
	settingLink.textContent = "Setting";
	settingLink.className = "px-4 py-2 text-emerald-600 hover:text-emerald-800 hover:bg-orange-300 rounded-md transition-colors";
	settingItem.appendChild(settingLink);
	navLinks.appendChild(settingItem);

    const profileItem = document.createElement('li');
    const profileLink = document.createElement('a');
    profileLink.href = `/user/${state.user?.slug}`;
    profileLink.textContent = 'Profile';
	profileLink.className = 'px-4 py-2 text-emerald-600 hover:text-emerald-800 hover:bg-orange-300 rounded-md transition-colors';
    profileItem.appendChild(profileLink);
    navLinks.appendChild(profileItem);

	const logoutItem = document.createElement('li');
	const logoutLink = document.createElement('a');
	logoutLink.href = '/';
	logoutLink.textContent = 'Logout';
	logoutLink.className = 'px-4 py-2 text-red-200 bg-red-600 hover:text-red-300 hover:bg-red-800 rounded-md transition-colors cursor-pointer';
	logoutLink.addEventListener('click', async (e) => {
		e.preventDefault();
		state.logout();
		await navigate('/');
		location.reload();
	});
	logoutItem.appendChild(logoutLink);
	navLinks.appendChild(logoutItem);


}
