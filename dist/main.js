import { App } from "./ui/App.js";
window.navigateCalls = [];
document.addEventListener("DOMContentLoaded", () => {
    new App();
    console.log("App created");
});
// const ws = new WebSocket('ws://localhost:8080');
// ws.addEventListener('open', () => {
//   console.log('Connected to server');
// });
// ws.addEventListener('message', (event) => {
//   const data = JSON.parse(event.data.toString());
//   const valueDisplay = document.getElementById('counter-value');
//   if (data.counter !== undefined && valueDisplay) {
//     valueDisplay.textContent = data.counter.toString();
//   }
// });
// // After page loading we attach buttons
// window.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('increaseByOne')?.addEventListener('click', () => {
//     ws.send(JSON.stringify({ type: 'increment', value: 1 }));
//   });
//   document.getElementById('increaseByTwo')?.addEventListener('click', () => {
//     ws.send(JSON.stringify({ type: 'increment', value: 2 }));
//   });
//   document.getElementById('decreaseByOne')?.addEventListener('click', () => {
//     ws.send(JSON.stringify({ type: 'decrement', value: 1 }));
//   });
//   document.getElementById('decreaseByTwo')?.addEventListener('click', () => {
//     ws.send(JSON.stringify({ type: 'decrement', value: 2 }));
//   });
// });
