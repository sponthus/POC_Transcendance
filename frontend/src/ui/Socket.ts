import { state } from "./state.js"

export class Socket {
    private ws: WebSocket | null = null;
    private reconnectInterval: number = 5000;
    private userId: number | null = null;

    constructor() {
        if (!state.isLoggedIn()) {
            throw new Error("Must be authenticated to open ws!");
        }
        if (state.user == null)
            throw new Error("Must be authenticated to open ws!");
        this.userId = state.user.id;

        try {
            this.ws = new WebSocket(this.getWsUrl());
            this.setupEventListeners();
        } catch (error) {
            console.error("Failed to create socket", error);
            throw error;
        }
    }

    private setupEventListeners() {
        if (!this.ws) {
            console.error("No socket connection found to configurate");
            return;
        }
        this.ws.onopen = () => {
            console.log("Connected to WebSocket server");
            this.send(JSON.stringify({
                type: "auth",
                userId: this.userId
            }));
        };
        this.ws.onerror = (error) => {
            console.error("Error WebSocket:", error);
        };
        this.ws.onclose = () => {
            console.log("Connexion WebSocket closed");
        };
    }
    private getWsUrl(): string {
        // const status = import.meta.env.MODE;
        // if (status === "development")
        //     return 'ws://localhost:8080/ws/';
        // else
            return `wss://${window.location.host}/ws/`;
    }

    public  send(data: string) {
        if (this.ws && this.isOpen())
            this.ws.send(data);
        else
            console.error("WebSocket is not open to send data", data);
    }

    public  addEventListener(type: string, listener: (event: any) => void) {
        if (!this.ws)
            return;
        this.ws.addEventListener(type as any, listener);
    }

    public  removeEventListener(type: string, listener: (event: any) => void) {
        if (!this.ws)
            return;
        this.ws.removeEventListener(type as any, listener);
    }

    public isOpen(): boolean {
        if (!this.ws)
            return false;
        return this.ws.readyState === WebSocket.OPEN;
    }

    close(): void {
        if (!this.ws)
            return;
        this.ws.close();
    }
}