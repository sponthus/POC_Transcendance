import { App } from "./ui/App.js";
import { Router } from "./router.js"

window.navigateCalls = [];

document.addEventListener("DOMContentLoaded", () => {
    new App();
    console.log("App created");
});

