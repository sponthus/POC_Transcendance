
export class Socket {
    private static instance: Socket;
    private socket: WebSocket;

    private constructor() {
        this.socket = new WebSocket(`wss://localhost:4443/ws/`);

        this.socket.onopen = () => {
            console.log("Connected to WebSocket server");
            this.socket.send(JSON.stringify({
                type: "join" }));
        };
        this.socket.onerror = (error) => {
            console.error("Error WebSocket:", error);
        };
        this.socket.onclose = () => {
            console.log("Connexion WebSocket closed");
        };
    }

    // Singleton
    public static getInstance(): Socket {
        if (!Socket.instance) {
            Socket.instance = new Socket();
        }
        return Socket.instance;
    }

    public send(data: string) {
        this.socket.send(data);
    }

    public addEventListener(type: string, listener: (event: MessageEvent) => void) {
        this.socket.addEventListener(type, listener);
    }

    public removeEventListener(type: string, listener: (event: MessageEvent) => void) {
        this.socket.removeEventListener(type, listener);
    }

    public isOpen(): boolean {
        return this.socket.readyState === WebSocket.OPEN;
    }
}