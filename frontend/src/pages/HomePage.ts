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
            this.app.innerHTML =  `
					<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
						<div class="bg-white rounded-xl shadow-2xl p-12 max-w-md w-full text-center">
							<h1 class="text-4xl font-bold text-gray-800 mb-6">Welcome to Pong !</h1>
							<p class="text-lg text-gray-600 mb-8">Ready to play?</p>
							<button id="play-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 		transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
								Play
							</button>
						</div>
					</div>
					 `;
        } else {
            this.app.innerHTML = `
				<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
					<div class="bg-white rounded-xl shadow-2xl p-12 max-w-md w-full text-center">
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
        });

    }
}