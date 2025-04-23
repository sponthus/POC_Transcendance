import { App } from "./App";

window.navigateCalls = [];

document.addEventListener("DOMContentLoaded", () => {
    new App();
    console.log("App created");
});
