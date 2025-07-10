import { navigate } from '../router.js';
import { checkLog } from "../api/check-log.js";
import { registerUser } from "../api/user.js";
import { BasePage } from "./BasePage.js";

export class RegisterPage extends BasePage {
    constructor() {
        super();
    }

    async render(): Promise<void> {
        this.renderBanner();

        const res = await checkLog();
        if (res.ok) {
            this.app.innerHTML = `
                <h1></h1>
                <h1>Already logged in as ${res.user.username}.</h1>
            `;
            return ;
        }

        this.app.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
                <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                    <div class="text-center mb-8">
                        <div class="mb-4">
                            <svg class="w-12 h-12 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                        </div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                        <p class="text-gray-600">Join us and start playing!</p>
                    </div>
                    
                    <form id="register-form" class="space-y-6">
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username"
                                placeholder="Choose a username" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 placeholder-gray-400"
                            />
                            <p class="mt-1 text-xs text-gray-500">Choose a unique username</p>
                        </div>
                        
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password"
                                placeholder="Create a password" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 placeholder-gray-400"
                            />
                            <p class="mt-1 text-xs text-gray-500">Use a strong password</p>
                        </div>
                        
                        <button 
                            type="submit" 
                            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                        >
                            Create Account
                        </button>
                    </form>
                    
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-600">
                            Already have an account? 
                            <a href="/login" class="text-purple-600 hover:text-purple-800 font-medium hover:underline">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;
        const form = document.getElementById('register-form') as HTMLFormElement;
        if (!form) {
            this.app.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-8">
                    <div class="bg-white rounded-xl shadow-2xl p-12 max-w-md w-full text-center">
                        <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h1 class="text-3xl font-bold text-red-600 mb-4">Error</h1>
                        <p class="text-gray-600 mb-6">Unable to load the registration form</p>
                        <a href="/" class="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
                            Go to Home
                        </a>
                    </div>
                </div>
            `;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;

            const req = await registerUser(username, password);
            if (req.ok) {
                await navigate('/');
                return ; // back to home
            }
            else {
                return ; // registerUser already alerts user
            }
        });
    }
}
