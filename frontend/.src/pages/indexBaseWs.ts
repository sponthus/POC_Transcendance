// const app = document.getElementById('app');

// const fetchData = async (url: string) => {
//     const res = await fetch(url);
//     const data = await res.json();
//     const div = document.createElement('div');
//     div.textContent = `${url}: ${data.message}`;
//     app?.appendChild(div);
// };

// fetchData('/api/user');
// fetchData('/api/games');

// const ws = async () => {
//     let socket: WebSocket = new WebSocket(`wss://localhost:4443/ws/`);
//
//     socket.onopen = () => {
//         console.log("Connected to WebSocket server");
//         socket.send(JSON.stringify({
//             type: "join" }));
//     };
//     socket.onerror = (error) => {
//         console.error("Error WebSocket:", error);
//     };
//     socket.onclose = () => {
//         console.log("Connexion WebSocket closed");
//     };
// }
//
// ws();