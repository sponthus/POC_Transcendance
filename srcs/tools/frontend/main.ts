import { App } from "./ui/App.js";

window.navigateCalls = [];

document.addEventListener("DOMContentLoaded", () => {
    new App();
    console.log("App created");
});
