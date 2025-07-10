import { navigate } from '../router.js';
import { checkLog } from "../api/check-log.js";
import { loginUser } from "../api/user.js";
import { BasePage } from "./BasePage.js";

export class LoginPage extends BasePage {
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
            <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Login</h1>
                        <p class="text-gray-600">Sign in to your account</p>
                    </div>
                    
                    <form id="login-form" class="space-y-6">
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username"
                                placeholder="Enter your username" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                            />
                        </div>
                        
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password"
                                placeholder="Enter your password" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Sign In
                        </button>
                    </form>
                    
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-600">
                            Don't have an account? 
                            <a href="/register" class="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);

            const username = formData.get('username') as string;
            const password = formData.get('password') as string;

            const req = await loginUser(username, password);
            if (req.ok) {
                await navigate('/');
                return ;
            }
            else {
                if (req.error)
                    alert("Connexion failure : " + req.error);
                else
                    alert("Connexion failure");
            }
        });
    }
}

