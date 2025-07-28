import { state } from "../ui/state.js";
import { navigate } from "../router.js";
import { checkLog } from "../api/check-log.js";
import { BasePage } from "./BasePage.js";

export class HomePage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        this.renderBanner();
        checkLog();

        if (state.isLoggedIn()) {
			const BackgroundHome = document.createElement('div');
			BackgroundHome.className = "flex flex-col items-center min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 p-8";
			BackgroundHome.style.backgroundImage = "url('/background1.gif')";
			BackgroundHome.style.backgroundSize = "cover";
			BackgroundHome.style.backgroundPosition = "center";

			const front = document.createElement('div');
			front.className = "flex rounded-xl shadow-2xl p-12 max-w-md w-full text-center";

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

			const playButton = document.createElement('button');
			playButton.id = 'play-btn';
			playButton.textContent = "click to play";
			playButton.className = "w-full mt-8 bg-sky-600 hover:bg-sky-700 text-orange-100 font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300";

			front.appendChild(playButton);
			BackgroundHome.appendChild(logoDiv);
			BackgroundHome.appendChild(front);
			

			this.app.appendChild(BackgroundHome);
            // this.app.innerHTML =  `
			// 		<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 p-8">
			// 			<div class="bg-orange-300 rounded-xl shadow-2xl p-12 max-w-md w-full text-center">
			// 				<h1 class="text-4xl font-bold text-emerald-500 mb-6">Welcome to Island World</h1>
			// 				<p class="text-lg text-emerald-400 mb-8">Ready to play?</p>
			// 				<button id="play-btn" class="w-full bg-sky-600 hover:bg-sky-700 text-orange-100 font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 		transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
			// 					Play
			// 				</button>
			// 			</div>
			// 		</div>
			// 		 `;
        } else {
            this.app.innerHTML = `
				<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
					<div class="bg-orange-300 rounded-xl shadow-2xl p-12 max-w-md w-full text-center">
						<h1 class="text-4xl font-bold text-gray-800 mb-6">Welcome to Pong !</h1>
						<p class="text-lg text-gray-600 mb-8">Please, connect to play.</p>
						<div class="flex flex-col space-y-4">
							<a href="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform 	hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
								Login
							</a>
							<a href="/register" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform 	hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300">
								Register
							</a>
						</div>
					</div>
				</div>
			`;
        }
        document.getElementById('play-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            navigate('/game');
			location.reload();
        });

    }
}