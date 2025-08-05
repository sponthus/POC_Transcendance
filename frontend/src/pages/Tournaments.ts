import { BasePage } from "./BasePage.js";
import { State } from "../core/state.js";

const state = State.getInstance();

// DEBUG CLASS, to erase later
export class buttonClass extends BasePage {

	private background?: HTMLElement
	private ButtonDiv!: HTMLElement;
	private ButtonDiv2?: HTMLElement;
	private RenderDiv!: HTMLElement;

	constructor() {
		super();
	}

	async render() {
		await this.renderBanner();
		this.background = this.initBackground();
		this.ButtonDiv = document.createElement('div');
		this.ButtonDiv.className = "flex items-center justify-center";

		this.ButtonDiv2 = document.createElement('div');
		this.ButtonDiv2.className = "flex items-center justify-center";

		this.RenderDiv = document.createElement('div');
		this.RenderDiv.id = "RenderDiv";
		this.RenderDiv.innerHTML = ``;
		this.RenderDiv.className = "flex items-center justify-center";


		this.addButtons();

		this.background.appendChild(this.ButtonDiv);
		this.app.appendChild(this.background);
		this.app.appendChild(this.RenderDiv);

		this.eventsManager();
	}

	private addButtons() {

//"flex items-center justify-center aspect-square bg-sky-500 hover:bg-sky-600 hover:font-bold rounded-lg" for the class of the buttons
// this.buttonDiv to give in parent class


// you can add some in button div 2
		this.createButton(this.ButtonDiv,
			"New tournament",
			"new",
			"flex items-center justify-center aspect-square bg-sky-500 hover:bg-sky-600 hover:font-bold rounded-lg");
		this.createButton(this.ButtonDiv,
			"Show all tournaments",
			"show-all",
			"flex items-center justify-center aspect-square bg-sky-500 hover:bg-sky-600 hover:font-bold rounded-lg")
		this.createButton(this.ButtonDiv,
			"Show available tournaments",
			"show-available",
			"flex items-center justify-center aspect-square bg-sky-500 hover:bg-sky-600 hover:font-bold rounded-lg")

		/***********************************create all button here***********************************/

	}

	private async createButton(Parent: HTMLElement, TextContent: string, Id: string, className: string) {
		const Button: HTMLButtonElement = document.createElement('button');
		Button.id = Id + "-btn";
		Button.className = className;
		Button.textContent = TextContent;

		Parent.appendChild(Button);
	}

	private initBackground(): HTMLElement {
		const BackgroundHome = document.createElement('div');
		BackgroundHome.className = "flex flex-col items-center min-h-screen p-8";
		return BackgroundHome;
	}

	async openTournamentForm(div: HTMLElement) {
		if (!div || !state.user?.id)
			return;

		div.innerHTML = `
			<form id="new-tournament-form">
                <div style="margin-bottom: 15px;">
                    <label for="player_a">Player 1:</label>
                    <input type="text" id="player1" name="player1" placeholder="Enter player 1 name" required />
                    <label>
                        <input type="checkbox" id="player1_me" name="player1_me" />
                        Me
                    </label>
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="player_b">Player 2:</label>
                    <input type="text" id="player2" name="player2" placeholder="Enter player 2 name" required />
                    <label style="margin-top: 5px; display: block;">
                        <input type="checkbox" id="player2_me" name="player2_me" style="margin-right: 5px;" />
                        Me
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" id="create-btn">Create Tournament</button>
                    <button type="button" id="more-btn" >More players</button>
                </div>
            </form>
		`;

		// ME boxes not functional + more player to implement ?

		const form = document.getElementById('new-tournament-form');
		form?.addEventListener('submit', async (e) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
		});
	}

	private eventsManager() {
	const Button1 = document.getElementById("new-btn") // recover all your buttons here

		const TabContent: HTMLButtonElement[] = [/**********add list of your button here*********/];

		TabContent.forEach(btn => {
			btn.addEventListener('click', () => {
				TabContent.forEach(button => { this.desactivatebutton(button); })// desactivate all button (in the class) not necessary

				this.activateButton(btn); // activate this button not necessary

				if (btn.id == "new-btn") {
					console.log("New btn clicked");//add function for this button
					this.openTournamentForm(this.RenderDiv);
				}
					// else if ()
			})
		})
	}

	private desactivatebutton(btn: HTMLButtonElement) {
		btn.classList.remove("bg-sky-600");
		btn.classList.remove("font-bold");
		btn.classList.add("bg-sky-500 ");
	}

	private activateButton(btn: HTMLButtonElement) {
		btn.classList.remove("bg-sky-500 ");
		btn.classList.add("bg-sky-600");
		btn.classList.add("font-bold");
	}
}