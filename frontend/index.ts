import { setupRouter } from './router.js';

console.log("JS loaded !");
const app = document.getElementById("app");
if (app) {
    app.innerHTML = "<h1>Home page</h1>";
} else {
    console.warn("No div#app found !");
}

window.addEventListener('DOMContentLoaded', () => {
    setupRouter();
});