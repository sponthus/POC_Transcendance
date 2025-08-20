import { createDiv, createButton, append} from '../../Utils/elementMaker.js';
import { createLocalGame, startGame } from "../../api/game.js"
import { LocalGamePage } from './LocalGamePage.js';
import { State } from "../../core/state.js";
import { GamePage } from './GamePage.js';
import { navigate } from '../../core/router.js';
import { launchPong } from './LaunchPong.js';

const state = State.getInstance();

enum PageState {MOD = 0, PARTY = 1, NEWGAME = 2};

export class Event {


	private StatePage!: number;
	private LocalGamePage!: LocalGamePage;
	private GamePage: GamePage;
	private LaunchPong: launchPong;

	constructor(LocalGamePage: LocalGamePage, GamePage: GamePage) {
		this.StatePage = PageState.MOD;
		this.LocalGamePage = LocalGamePage;
		this.GamePage = GamePage;
		this.LaunchPong = new launchPong(this.GamePage._render);
	}

	render() {
		this.createReturnDiv();
	}

	/*************************************Function for creating Return and Save button*************************************/
	private async createReturnDiv(): Promise<void> {
		const Div: HTMLElement = createDiv("Submit", "flex items-center justify-center text-center p-4 bg-transparent py-3 px-4 h-[20%] w-full space-x-24");

		const ClassNameBtn: string = "bg-orange-200 hover:bg-orange-400 text-emerald-600 font-bold rounded-lg transition-colors duration-200transform w-[20%]";
		const ReturnBtn: HTMLButtonElement = createButton("Return", ClassNameBtn, "Return");
		const DeleteBtn: HTMLButtonElement = createButton("delete",ClassNameBtn + " hidden", "Delete");
		const SaveBtn: HTMLButtonElement = createButton("Save", ClassNameBtn, "Save");

		append(Div, [ReturnBtn, DeleteBtn, SaveBtn]);
		append(this.GamePage.Body, [Div]);
	}

	/*************************************Function for Manage Event Return and Save button*************************************/
	async ManageEvent() {
		this.ManageSaveEvent();
		this.ManageReturnEvent();
	}

	async manageNewGameEvent() {
		document.getElementById('New-btn')?.addEventListener('click', async () => {
			this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Cancel"]
			, [document.getElementById("Save-btn")  as HTMLButtonElement, "Save New Game"]);
	
			this.StatePage = PageState.NEWGAME;
			this.removeDeleteButton();
			this.LocalGamePage._NewGameForm.classList.remove("hidden");
		});
	}

	/*************************************Function for Event Return button*************************************/
	private async ManageReturnEvent() {
		const ReturnButton = document.getElementById("Return-btn") as HTMLButtonElement;
		if (!ReturnButton)
			console.log("pas de bouton retour");
		ReturnButton.addEventListener('click', async(e) => {
			switch(this.StatePage) {
				case PageState.MOD:
					this.ReturnToLobby();
					break;
				case PageState.PARTY:
					this.returnToGameMod();
					break;
				case PageState.NEWGAME:
					this.CancelNewGame();
					break;
				default: break;
			}
		})
	}

					/*********************************function utils for return*********************************/
	private ReturnToLobby(){
		this.GamePage.cleanPage();
		this.GamePage.cleanBody();
		this.GamePage.removeOverlayToWindow();
		this.GamePage.startGamePage();
		this.LaunchPong.returnLobby();
	}

	private returnToGameMod() {
		this.ChangeButtonText(document.getElementById("Save-btn") as HTMLButtonElement, "Save");
		this.StatePage = PageState.MOD;
		Array.from(this.GamePage._Page.children).forEach((child)=>{
			child.remove();
		})

		this.removeDeleteButton();

		this.GamePage._Page.classList.add("border-4");
		this.GamePage.generateGamePage();
	}

	private CancelNewGame() {
		this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Return"]
		, [document.getElementById("Save-btn")  as HTMLButtonElement, "Play"]);

		this.StatePage = PageState.PARTY;
	
		this.addDeleteButton();
	
		console.log("Cancel New Game function called")
		this.LocalGamePage._NewGameForm.classList.add('hidden');
	}

	/*************************************Function for Event Save button*************************************/
	private async ManageSaveEvent() {
		 document.getElementById("Save-btn")?.addEventListener('click', async(e) => {
				switch(this.StatePage) {
				case PageState.MOD:
					this.SaveGameMod();
					break;
				case PageState.PARTY:
					this.PlayGame();
					break;
				case PageState.NEWGAME:
					this.SaveNewParty();
					break;
				default: break;
			}
		})
	}

				/*********************************function utils for saving games*********************************/
	private async SaveGameMod() {
		const SelectValue = this.FindSelectValue("GameMod-DropDown-div");
		if (SelectValue == "1v1") {
			(document.getElementById("Save-btn") as HTMLButtonElement).textContent = "Play";
			this.StatePage = 1;
			this.GamePage._Page.classList.remove("border-4");
			await this.GamePage.generate1v1GamePage();
		}
		else if (SelectValue == "tournament")
			alert("tournament in build please choose 1v1 mode");
		else if (!SelectValue)
			alert("Please Select Value");
	}

	private FindSelectValue(Id: string): string | undefined {
		const Select = (document.getElementById(Id) as HTMLElement)?.querySelector('select');

		return Select?.value;
	}

	private PlayGame() {
		this.LocalGamePage._PartyMap?.forEach(async(value, key) => {
			if (value.checked) {
				this.launchGame(key);
				return ;
			}
		})
		alert("please choose a Party");
	}

	private async launchGame(gameId: number) {
		try {
			const request = await startGame(gameId);
			if (!request.ok) {
				throw new Error('Unable to start game : ' + request.error);
			}
			state.launchGame(gameId);
			this.GamePage.removeOverlayToWindow();
			this.renderGame();
		} 
		catch (error) {
			alert(error);
			await navigate('/game');
		}
	}

	private renderGame() {
		this.LaunchPong.render();
	}

	private async SaveNewParty() {
		this.saveParty()
		this.StatePage = PageState.PARTY;
		this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Return"]
		, [document.getElementById("Save-btn")  as HTMLButtonElement, "Play"]);
		this.addDeleteButton();
		this.LocalGamePage._NewGameForm.classList.add("hidden");
		await this.LocalGamePage.refreshAvailableGames();
	}

	private saveParty() {
		const formData = new FormData(document.getElementById('new-game-form') as HTMLFormElement) ;

		const PlayerA = this.GetDataForm('Player1', formData);
		const PlayerB = this.GetDataForm('Player2', formData);

		if (!PlayerA || !PlayerB)
			return ;
		if (PlayerA === PlayerB) {
			alert('Player names must be different');
			return;
		}
		this.addPartyToServer(PlayerA, PlayerB);
		alert('Game created successfully!');
	}

	private GetDataForm(id: string, formData: any): string {
		const PlayerRaw = formData.get(id);
		console.log("Raw values: ", PlayerRaw);
		console.log("types:", typeof PlayerRaw);

		const Player = (PlayerRaw as string)?.trim() || "";
		console.log('After trim:', Player );
		console.log('Lengths:', Player.length);
		if (!Player)
			alert('Please enter both player names');
		return Player;
	}
	
	private async addPartyToServer(PlayerA: string, PlayerB: string) {
		try {
			if (!state.user?.id)
				throw new Error('user not connected');
			const req = await createLocalGame(state.user?.id, PlayerA, PlayerB);
			if (!req.ok) 
				throw new Error('Failed to create Game');
		}
		catch (error) {
			console.log("Error creating Games : ", error);
			alert('Error creating Game PLease try again: ' + error);
		}
	}

	/*************************************Function utils*************************************/
	private ChangeBackPageButtonText(Return: [ReturnBtn: HTMLButtonElement, ReturnText: string], Save: [Savebtn: HTMLButtonElement, SaveText: string]) {
		this.ChangeButtonText(Return[0], Return[1]);
		this.ChangeButtonText(Save[0], Save[1]);
	}

	private ChangeButtonText(btn: HTMLButtonElement, TextContent: string) {
		btn.textContent = TextContent;
	}
	
	addDeleteButton() {
		const deletebtn = document.getElementById("delete-btn");
		deletebtn?.classList.remove('hidden');
	}
	
	private removeDeleteButton() {
		const deletebtn = document.getElementById("delete-btn");
		deletebtn?.classList.add('hidden');
	}
	
	set setStatePage(State: number) {
		this.StatePage = State;
	}

}