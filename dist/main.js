import { App } from "./ui/App";
document.addEventListener("DOMContentLoaded", () => {
    new App();
});
function navigateTo(route) {
    console.log("Navigating to:", route);
    window.history.pushState({}, "", route);
    window.dispatchEvent(new Event("popstate"));
}
console.log("Defining navigateTo");
window.navigateTo = navigateTo;
console.log("window.navigateTo : ", window.navigateTo);