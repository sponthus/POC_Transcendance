import { state } from "../ui/state.js";
import { navigate } from "../router.js";
import { checkLog } from "../api/check-log.js";
import { BasePage } from "./BasePage.js";

export function initBackground(): HTMLElement {
	const BackgroundHome = document.createElement('div');
	BackgroundHome.className = "flex flex-col items-center min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 p-8";
	BackgroundHome.style.backgroundImage = "url('/background1.gif')";
	BackgroundHome.style.backgroundSize = "cover";
	BackgroundHome.style.backgroundPosition = "center";
	return BackgroundHome;
}


export class HomePage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        this.renderBanner();
        checkLog();

        if (state.isLoggedIn()) {
			const BackgroundHome = initBackground();

			const front = document.createElement('div');
			front.className = "flex rounded-xl shadow-2xl p-12 max-w-md w-full text-center";

			const logoDiv = this.initLogo();

			const playButton = document.createElement('button');
			playButton.id = 'play-btn';
			playButton.textContent = "click to play";
			playButton.className = "w-full mt-8 bg-sky-600 hover:bg-sky-700 text-orange-100 font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300";

			front.appendChild(playButton);
			BackgroundHome.appendChild(logoDiv);
			BackgroundHome.appendChild(front);
			

			this.app.appendChild(BackgroundHome);

        } else {
			const BackgroundHome = initBackground();

			const front = document.createElement('div');
			front.className = "rounded-xl shadow-2xl p-12 max-w-md w-full text-center";

			const logoDiv = this.initLogo();

			const ButtonDiv = document.createElement('div');
			ButtonDiv.className = "flex flex-col space-y-4";

			const loginButton = document.createElement('a');
			loginButton.href = "/login";
			loginButton.className = "bg-orange-300 hover:bg-orange-400 text-emerald-600 font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform 	hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300";
            loginButton.textContent = "Login";

			const registerButton = document.createElement('a');
			registerButton.href = "/login";
			registerButton.className = "bg-orange-300 hover:bg-orange-400 text-emerald-600 font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform";
			registerButton.textContent = "Register";
		
			ButtonDiv.appendChild(loginButton);
			ButtonDiv.appendChild(registerButton);

			front.appendChild(ButtonDiv);
			BackgroundHome.appendChild(logoDiv);
			BackgroundHome.appendChild(front);

			this.app.appendChild(BackgroundHome);

        }

        document.getElementById('play-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            navigate('/game');
			location.reload();
        });
    }
	private initLogo(): HTMLElement {
		const logoDiv = document.createElement('div');
			logoDiv.className = "flex items-center justify-center relative h-full w-full ";
			
			const logo = document.createElement('img');
			logo.id = "logo-img";
			logo.className = "mx-auto object-cover object-center h-1/2 w-1/2";
			logo.src = "/logo/logoIlsandWorld.png";

			const logoTitleText = document.createElement('img');
			logoTitleText.id = "logo-title-Text";
			logoTitleText.className = "absolute h-1/2 w-1/2 bottom-4";
			logoTitleText.src = "/logo/IslandWorldText.png";

			const loglWelcomeText = document.createElement('img');
			loglWelcomeText.id = "logo-Welcome.text";
			loglWelcomeText.className = "absolute h-1/2 w-1/2 translate-x-14";
			loglWelcomeText.src = "/logo/welcomeText.png";

			logoDiv.appendChild(logo);
			logoDiv.appendChild(loglWelcomeText);
			logoDiv.appendChild(logoTitleText);

			return logoDiv;
	}
}