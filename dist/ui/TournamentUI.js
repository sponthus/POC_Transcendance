import { State } from "../state";
export class TournamentUI {
    constructor() {
        this.state = State.getInstance();
    }
    render() {
        const container = document.createElement("div");
        const title = document.createElement("h2");
        title.innerText = "Tournoi en cours";
        const playersList = document.createElement("ul");
        this.state.tournament.players.forEach((player) => {
            const li = document.createElement("li");
            li.innerText = player;
            playersList.appendChild(li);
        });
        container.append(title, playersList);
        return container;
    }
}
