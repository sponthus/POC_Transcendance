import { navigate } from '../../core/router.js';
import * as BABYLON from "@babylonjs/core";
import { State } from "../../core/state.js";
import { createLocalGame, getAvailableGames, startGame, deleteGame } from "../../api/game.js"
import { popUp } from '../../Utils/popUp.js';
import { renderScene } from '../../babylon/displaying/renderScene.js';
import { createDiv, createElement, createButton, createDropdownDiv, createFormDiv, createCheckBoxLabel, append} from '../../Utils/elementMaker.js';
import { LocalGamePage } from './LocalGamePage.js';

const state = State.getInstance();

enum PageState {MOD = 0, PARTY = 1, NEWGAME = 2};

export async function renderDropdown(Parent: HTMLElement, Options: string[], Name: string, TextContent: string): Promise<void> {
	const Div = createDropdownDiv(Options, Name, TextContent, 
		["flex items-center w-full h-[10%] justify-between p-4 bg-orange-300 focus:bg-orange-400  rounded-lg py-3 px-4 space-x-4",
		"w-[40%]  text-emerald-600 font-bold underline", 
		"w-[30%]  bg-orange-400 rounded-lg text-emerald-700"]);
	append(Parent, [Div]);
}

export class GamePage extends popUp {

	private Page!: HTMLElement;

	private NewGameForm!: HTMLElement;
	private PartyMap?: Map<number, HTMLInputElement>;
	private LocalGamePage!: LocalGamePage;

	private scene!: BABYLON.Scene;
	private engine!: BABYLON.Engine;
	private render!: renderScene;

	private StatePage!: number;

    constructor(render: renderScene) {
		super("Create Game");
		// this.PartyMap = new Map<number, HTMLInputElement>();
		this.scene = render.pongScene as  BABYLON.Scene;
		this.engine = render.engine as BABYLON.Engine;
		this.render = render;
		this.startGamePage();
    }

	private startGamePage() {
		this.StatePage = 0;
		// this.isBotGame = true;
		this.initPage();
		this.initPopUpPage();
		this.generateGamePage();
		this.LocalGamePage = new LocalGamePage(this.Page);
	}

	private initPage() {
		this.Page = document.createElement('div');
		this.Page.className = "flex flex-col items-center h-[80%] w-[80%] text-center border-4 border-orange-400 rounded-xl space-y-4 overflow-hidden";
	}

	private initPopUpPage() {
		this._Body.className = "flex flex-col items-center justify-center h-[60%] w-[60%] bg-orange-300 rounded-xl border-2 border-orange-400 shadow-2xl overflow-auto";
		this._Title.classList.add("text-emerald-600");
		this._Body.appendChild(this.Page);
	}


	/*********************************************function for rendering 1v1 Mod Page**********************************************/
	private async generate1v1GamePage() {
		this.cleanPage();
		this.LocalGamePage.render();
		this.NewGameForm = this.LocalGamePage._NewGameForm;
		this.PartyMap = this.LocalGamePage._PartyMap;
		this.addDeleteButton();
		this.manageNewGameEvent();
    }

	/*********************************************function for rendering Game Mod Select Page**********************************************/
	private async generateGamePage() {
		this.Page.classList.add("justify-center");
		await this.createGamePageDiv();
		await this.CreateDropDownGamePage();
	}

	/*********************************************function Utils for rendering Game Mod Select Page**********************************************/
	private async createGamePageDiv() {
		const TextDiv: HTMLElement =  createDiv("GamePage-title", "flex items-center justify-center h-[30%]");
		const GameModText: HTMLElement = createElement('h1', "GamePage-title", "Please Choose your game mod (local only, coming soon: tournament)",  "text-emerald-600 text-center underline");

		append(TextDiv, [GameModText]);
		append(this.Page, [TextDiv]);
	}

	private async CreateDropDownGamePage() {
		await renderDropdown(this.Page ,["1v1", "tournament"], "GameMod", "Pong Game Mod:");
		await renderDropdown(this.Page ,["local"], "PlayerMod", "Pong player Mod :");
	}

	/*********************************************function To Manage Event**********************************************/
	private async manageNewGameEvent() {
		document.getElementById('New-btn')?.addEventListener('click', async () => {
			this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Cancel"]
			, [document.getElementById("Save-btn")  as HTMLButtonElement, "Save New Game"]);
	
			this.StatePage = 2;
			this.removeDeleteButton();
			this.LocalGamePage._NewGameForm.classList.remove("hidden");
		});
	}

	private async ManageEvent() {
		this.ManageSaveEvent();
		this.ManageReturnEvent();
	}

	private async ManageReturnEvent() {
		const ReturnButton = document.getElementById("Return-btn") as HTMLButtonElement;
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
	
	private async ManageSaveEvent() {
		const SaveButton = document.getElementById("Save-btn") as  HTMLButtonElement;

		SaveButton.addEventListener('click', async(e) => {
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

	/*********************************************function utils To Manage Event**********************************************/
	private async launchGame(gameId: number) {
		try {
			const request = await startGame(gameId);
			if (!request.ok) {
			    throw new Error('Unable to start game : ' + request.error);
			}
			state.launchGame(gameId);
			this.removeOverlayToWindow();
			this.renderGame();
           
        } catch (error) {
            alert(error);
            await navigate('/game');
        }
    }

	private renderGame() {
		let lastTime = 0;
		const targetFPS = 120;
		const frameDuration = 1000 / targetFPS;
		let now;
		let delta;
		window.addEventListener('keydown', (ev) => {
		if (ev.key == "Escape") {
			console.log("escape has been called")
			this.engine.stopRenderLoop();
			this.render.setState = 0;
			this.render.callRenderLoop();
			}
		});
		this.engine.runRenderLoop(() => {
			now = performance.now();
			delta = now - lastTime;
			if (delta >= frameDuration) {
				lastTime = now;
				this.scene.render();
			}
		})
	}

	private FindSelectValue(Id: string): string | undefined {
		const DropDownDiv =  document.getElementById(Id) as HTMLElement;
		const Select = DropDownDiv.querySelector('select');

		return Select?.value;
	}

	private async SaveGameMod() {
		const SelectValue = this.FindSelectValue("GameMod-DropDown-div");
		if (SelectValue == "1v1") {
			const SaveButton = document.getElementById("Save-btn") as HTMLButtonElement;
			SaveButton.textContent = "Play";
			this.StatePage = 1;
			this.Page.classList.remove("border-4");
			await this.generate1v1GamePage();
		}
		else if (SelectValue == "tournament")
			alert("tournament in build please choose 1v1 mode");
		else if (!SelectValue)
			alert("can't find Select Value");
	}

	private async SaveNewParty() {
		this.saveParty()
		this.StatePage = 1;
		this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Return"]
		, [document.getElementById("Save-btn")  as HTMLButtonElement, "Play"]);
		this.addDeleteButton();
		this.LocalGamePage._NewGameForm.classList.add("hidden");
		await this.LocalGamePage.refreshAvailableGames();
	}

	private saveParty() {
		const form = document.getElementById('new-game-form');
		const formData = new FormData(form as HTMLFormElement) ;

		const PlayerA = this.GetDataForm('Player1', formData);
		const PlayerB = this.GetDataForm('Player2', formData);

		if (!PlayerA && !PlayerB)
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
			if (!req) 
				throw new Error('Failed to create Game');
		}
		catch (error) {
			console.log("Error creating Games : ", error);
			alert('Error creating Game. PLease try again');
		}
	}

	private PlayGame() {
		this.PartyMap?.forEach(async(value, key) => {
			if (value.checked) {
				this.launchGame(key);
			}
		})
	}

	private ReturnToLobby(){
		this.cleanPage();
		this.cleanBody();
		this.removeOverlayToWindow();
		this.render.setState = 0;
		this.startGamePage();
		this.engine.stopRenderLoop();
		this.render.callRenderLoop();
	}

	private returnToGameMod() {
		this.ChangeButtonText(document.getElementById("Save-btn") as HTMLButtonElement, "Save");
		this.StatePage = 0;
		Array.from(this.Page.children).forEach((child)=>{
			child.remove();
		})

		this.removeDeleteButton();

		this.Page.classList.add("border-4");
		this.generateGamePage();
	}

	private CancelNewGame() {
		this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Return"]
		, [document.getElementById("Save-btn")  as HTMLButtonElement, "Play"]);

		this.StatePage = 1;
	
		this.addDeleteButton();
	
		console.log("Cancel New Game function called")
		this.NewGameForm.classList.add('hidden');
	}

	/*********************************************function Utils*********************************************/
	private addDeleteButton() {
		const deletebtn = document.getElementById("delete-btn");
		deletebtn?.classList.remove('hidden');
	}

	private removeDeleteButton() {
		const deletebtn = document.getElementById("delete-btn");
		deletebtn?.classList.add('hidden');
	}

	private async createReturnDiv(): Promise<void> {
		const Div: HTMLElement = createDiv("Submit", "flex items-center justify-center text-center p-4 bg-transparent py-3 px-4 h-[20%] w-full space-x-24");

		const ClassNameBtn: string = "bg-orange-200 hover:bg-orange-400 text-emerald-600 font-bold rounded-lg transition-colors duration-200transform w-[20%]";
		const ReturnBtn: HTMLButtonElement = createButton("Return", ClassNameBtn, "Return");
		const DeleteBtn: HTMLButtonElement = createButton("delete",ClassNameBtn + " hidden", "Delete");
		const SaveBtn: HTMLButtonElement = createButton("Save", ClassNameBtn, "Save");

		append(Div, [ReturnBtn, DeleteBtn, SaveBtn]);
		append(this._Body, [Div]);
	}

	private ChangeButtonText(btn: HTMLButtonElement, TextContent: string) {
		btn.textContent = TextContent;
	}

	private ChangeBackPageButtonText(Return: [ReturnBtn: HTMLButtonElement, ReturnText: string], Save: [Savebtn: HTMLButtonElement, SaveText: string]) {
		this.ChangeButtonText(Return[0], Return[1]);
		this.ChangeButtonText(Save[0], Save[1]);
	}

	/*********************************************Global rendering function*********************************************/
	renderGamePage() {
		this.createReturnDiv();
		this.addOverlayToWindow();
		this.ManageEvent();
	}

	cleanPage() {
		Array.from(this.Page.children).forEach((child)=>{
			child.remove();
		})
	}
}
