import { navigate } from '../../core/router.js';
import { checkLog } from "../../api/check-log.js";
import { BasePage } from "../BasePage.js";
import * as BABYLON from "@babylonjs/core";
import { State } from "../../core/state.js";
import { createLocalGame, getAvailableGames, startGame, deleteGame } from "../../api/game.js"
import { popUp } from '../../Utils/popUp.js';
import { renderScene } from '../../babylon/displaying/renderScene.js';
import { DropDown } from "../../Utils/dropDown";
import { createDiv, createElement, createButton, createDropdownDiv, createFormDiv, createCheckBoxLabel, append} from '../../Utils/elementMaker.js';
import { Checkbox } from '@babylonjs/inspector/fluent/primitives/checkbox';

const state = State.getInstance();

enum PageState {MOD = 0, PARTY = 1, NEWGAME = 2};

export class GamePage extends popUp {

	private Page!: HTMLElement;
	private NewGameForm!: HTMLElement;
	private PartyMap?: Map<number, HTMLInputElement>;

	private scene!: BABYLON.Scene;
	private engine!: BABYLON.Engine;
	private render!: renderScene;

	private StatePage!: number;

	// private isBotGame!: boolean;
	// private PopUp?: popUp;

    constructor(render: renderScene) {
		super("Create Game");
		this.PartyMap = new Map<number, HTMLInputElement>();
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
		this.Page.classList.remove("justify-center");

		await this.create1v1PageDiv();
		await this.create1v1FormDiv();
		await this.createAvailableGame();

		this.addDeleteButton();
		this.manageNewGameEvent();
		this.open1v1GameForm();
    }

	/*********************************************function utils for rendering 1v1 Mod Page**********************************************/
						/*********************************create 1v1 page div*********************************/
	private async create1v1PageDiv() {
		const Div : HTMLElement = createDiv("New", "flex flex-col items-center justify-center");
		
		this.createNewGameText(Div);
		this.createNewGameBtn(Div);
		append(this.Page, [Div]);
	}
	private createNewGameText(Div: HTMLElement) {
		const TextDiv: HTMLElement =  createDiv("1v1Page-title", "flex items-center justify-center");
		const GameModText: HTMLElement = createElement('h1', "1v1Page-title", "Create New Game",  "text-emerald-600 text-center underline");
		append(TextDiv, [GameModText]);

		if (Div)
			append(Div, [TextDiv]);
	}

	private createNewGameBtn(Div: HTMLElement) {
		const BtnDiv: HTMLElement = createDiv("New", "flex items-center justify-center text-center p-4 bg-transparent py-3 px-4 w-full space-x-24");

		const ClassNameBtn: string = "bg-orange-200 hover:bg-orange-400 text-emerald-600 font-bold rounded-lg transition-colors duration-200transform w-full";
		const NewBtn: HTMLButtonElement = createButton("New", ClassNameBtn, "New");

		append(BtnDiv, [NewBtn]);
		if (Div)
			append(Div, [BtnDiv]);
	}
						/*********************************create 1v1 Form div*********************************/
	private async create1v1FormDiv() {
		this.NewGameForm = createDiv("Form", "flex flex-col items-center justify-center w-full space-y-6 hidden");
		append(this.Page, [this.NewGameForm]);
		this.render1v1FormDiv();
	}

	private async render1v1FormDiv() {
		this.renderNewGameFormDropDown();

		const FormsDiv: HTMLFormElement = this.createNewGameFormDiv();
		this.addPlayersNameForm(FormsDiv, "Player1", "player_a_me", "Player 1 Name");
		this.addPlayersNameForm(FormsDiv, "Player2", "player_b_me", "Player 2 Name");
	}

	private createNewGameFormDiv() : HTMLFormElement {
		const FormsDiv: HTMLFormElement = document.createElement('form');
		FormsDiv.id = "new-game-form";
		FormsDiv.className =  "flex items-center justify-center w-full";
		append(this.NewGameForm, [FormsDiv]);

		return FormsDiv
	}

	private renderNewGameFormDropDown() {
		this.renderDropdown(this.NewGameForm ,["1 player vs AI", "Local Multiplayer"], "PlayerMod", "Pong player Mod :");
		this.renderDropdown(this.NewGameForm ,["5", "10", "15", "20", "No Limit"], "ScoreLimit", "Score Limit");
	}

	private addPlayersNameForm(Div: HTMLElement, IdForm: string, idCheckBox: string, TextContent: string) {
		const Player: HTMLElement = createFormDiv(["text", IdForm, TextContent , true]
										,IdForm
										,""
										,["flex items-center flex-row-reverse space-x-4"
											,"block text-sm font-medium text-emerald-600 mb-2"
											,"w-full border bg-orange-200 border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-8 00 transition-colors duration-200 placeholder-emerald-600 text-center"
											,"block text-sm text-center font-medium text-emerald-500 mb-2"]);
	
		const checkbox = createCheckBoxLabel(idCheckBox, idCheckBox, "me", ["text-emerald-600",""]);
		append(Player, [checkbox]);
		append(Div, [Player]);
	}

						/*********************************create available games div*********************************/
	private async createAvailableGame() {
		const AvailableDiv: HTMLElement = createDiv("available-games", "flex flex-col items-center w-[90%] h-[90%] space-y-8  mb-auto");

		const TitlePartys = createElement('p', "Title-Party", "", "text-center text-emerald-600 w-[50%] font-bold border-4 rounded-xl translate-y-4 border-orange-400 shadow-xl")

		const BodyParty: HTMLElement = createDiv("Body-Party", "flex flex-col w-[90%] h-64 border-4 border-orange-400 rounded-xl -translate-y-2 shadow-xl overflow-auto");

		append(AvailableDiv, [TitlePartys, BodyParty]);
		append(this.Page, [AvailableDiv]);
	}

						/*********************************create open games Form*********************************/
	private async open1v1GameForm() {
        const playerAMeCheckbox = document.getElementById('player_a_me-input') as HTMLInputElement;
        const playerBMeCheckbox = document.getElementById('player_b_me-input') as HTMLInputElement;
        const playerAInput = document.getElementById('Player1-input') as HTMLInputElement;
        const playerBInput = document.getElementById('Player2-input') as HTMLInputElement;

		// playerBInput.value = "Crabby the Bot";
		this.meCheckBox1ChoiceOnly(playerAMeCheckbox, playerAInput, playerBMeCheckbox, playerBInput);
		this.meCheckBox1ChoiceOnly(playerBMeCheckbox, playerBInput, playerAMeCheckbox, playerAInput);

		await this.refreshAvailableGames();
    }

    async refreshAvailableGames() {
		this.PartyMap!.clear();
		const BodyParty = document.getElementById("Body-Party-div")  as HTMLElement;
		BodyParty.innerHTML = '';

		const availableGamesDiv = document.getElementById('available-games-div');
		if (!availableGamesDiv || !state.user?.id) {
			console.log('availableGames debug');
			if(!availableGamesDiv)
			   this.Page.innerHTML = `Error don't find availables games`;
			return;
		}

        try {
            const result = await getAvailableGames(state.user?.id);
            if (!result.ok) {
                availableGamesDiv.innerHTML = 'Error loading games.';
                return;
            }
            const games = result.games;

			const TitlePartys = document.getElementById('Title-Party-p') as HTMLElement;

            if (games.length === 0) {
                TitlePartys.textContent = 'No games available';
            }
			else {
				TitlePartys.textContent = 'available Partys';
				games.map((Party: any, index: number) => {
					const PartyDiv: HTMLElement = createDiv("game-item" + index.toString(), "flex border-2 border-orange-600 w-full h-[40%] space-x-10");

					this.CreateGameIdDiv(PartyDiv, index, Party);
					this.CreatePlayerNamesDiv(PartyDiv, index, Party);
					this.createGameStatusDiv(PartyDiv, index, Party);
					this.createCreatedAtDiv(PartyDiv, index, Party);
					this.createCheckBoxDiv(PartyDiv, index, Party);
					append(BodyParty, [PartyDiv]);
				})
				this.ManagePartyEvent();
			}
        }
        catch (error) {
            console.error('Error fetching games:', error);
            availableGamesDiv.innerHTML = '<p>Error loading games</p>';
        }
    }

	private CreateGameIdDiv(Div: HTMLElement, index: number, Party: any) {
		const GameIdDivs = createDiv("party-item" + index.toString(), "flex items-center") as HTMLElement;
		const GameIdText = createElement('h2', "party-item " + index.toString(), `Game #${Party.id} :` , "text-emerald-600 text-center underline font-bold") as HTMLElement;

		append(GameIdDivs, [GameIdText]);
		append(Div, [GameIdDivs]);
	}

	private CreatePlayerNamesDiv(Div: HTMLElement, index: number, Party: any) {
		const PLayersNameDivs = createDiv("party-Players-Name" + index.toString(), "grid grid-rows-4 items-center justify-center") as HTMLElement;
		const PlayerText =  createElement('h2', "party-Players-Name" + index.toString(), "Players : ", "text-emerald-600 text-center font-bold underline") as HTMLElement;
		const PlayerAText = createElement('h1', "party-Player-a-Name" + index.toString(), `${Party.player_a}`, "text-emerald-600 text-center") as HTMLElement;
		const VsText = createElement('h1', "party-vs-Name" + index.toString(), `vs`, "text-emerald-600 text-center") as HTMLElement;
		const PlayerBText = createElement('h1', "party-Player-b-Name" + index.toString(), `${Party.player_b}`, "text-emerald-600 text-center") as HTMLElement;

		append(PLayersNameDivs, [PlayerText, PlayerAText, VsText, PlayerBText]);
		append(Div, [PLayersNameDivs]);
	}

	private createGameStatusDiv(Div: HTMLElement, index: number, Party: any) {
		const GamesStatueDivs = createDiv("party-statue" + index.toString(), "grid grid-rows-4 items-center justify-center space-y-12") as HTMLElement;
		const StatueText = createElement('h2', "party-statue" + index.toString(), `Status : `, "text-emerald-600 text-center underline font-bold") as HTMLElement;
		const PartyStatueText = createElement('h1', "party-statue" + index.toString(), `${Party.status}`, "text-emerald-600 text-center") as HTMLElement;

		append(GamesStatueDivs, [StatueText, PartyStatueText]);
		append(Div, [GamesStatueDivs]);
	}

	private createCreatedAtDiv(Div: HTMLElement, index: number, Party: any) {
		const CreatedAtDivs = createDiv("party-item" + index.toString(), "grid grid-rows-4 items-center justify-center space-y-12") as HTMLElement;
		const CreatedAtText = createElement('h2', "party-statue" + index.toString(), `Created At : `, "text-emerald-600 text-center underline font-bold") as HTMLElement;
		const DateText = createElement('h1', "party-statue" + index.toString(), `${Party.created_at}`, "text-emerald-600 text-center") as HTMLElement;	
		
		append(CreatedAtDivs, [CreatedAtText, DateText]);
		append(Div, [CreatedAtDivs]);
	}

	private createCheckBoxDiv(Div: HTMLElement, index: number, Party: any) {
		const checkboxDiv = createDiv("party-check", "grid grid-rows-4 items-center justify-center space-y-12") as HTMLElement;
		const CheckBoxText = createElement('h2', "choose", "choose one :", "text-emerald-600 font-bold underline") as HTMLElement;
		const checkbox = createCheckBoxLabel(`$(Party.id)`, "choose", "", ["text-emerald-600 space-x-4",""]);
		this.PartyMap?.set(Party.id as number, (checkbox.querySelector('input')) as HTMLInputElement);

		append(checkboxDiv, [CheckBoxText, checkbox]);
		append(Div, [checkboxDiv]);
	}

	private ManagePartyEvent() {
		this.PartyMap?.forEach((value, key) =>{
			value.addEventListener('change', () => {
				this.PartyMap?.forEach((value, key) => {
					value.checked = false; })
				value.checked = true;
			})
		})

		document.getElementById("delete-btn")?.addEventListener('click', async (e) => {
			this.PartyMap?.forEach(async (value, key) => {
				if (value.checked) {
					await this.deleteGame(key);
					await this.refreshAvailableGames();
				}
			})
		})
	}

	/*********************************************function for rendering Game Mod Select Page**********************************************/
	private async generateGamePage() {
		// Show game options
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
		await this.renderDropdown(this.Page ,["1v1", "tournament"], "GameMod", "Pong Game Mod:");
		await this.renderDropdown(this.Page ,["local"], "PlayerMod", "Pong player Mod :");
	}

	/*********************************************function To Manage Event**********************************************/
	private meCheckBox1ChoiceOnly(MeCheckbox: HTMLInputElement
						,MePlayerInput: HTMLInputElement
						,ElseCheckBox: HTMLInputElement
						,ElsePlayerInput: HTMLInputElement) {

		const Select = document.getElementById("PlayerMod-DropDown-Select") as HTMLSelectElement;
		this.newPlayerCheckBoxEvent(MeCheckbox, MePlayerInput, ElseCheckBox, ElsePlayerInput, Select);
		this.newPlayerSelectEvent(MeCheckbox, ElseCheckBox, ElsePlayerInput, Select);
	}

	private async manageNewGameEvent() {
		document.getElementById('New-btn')?.addEventListener('click', async () => {
			this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Cancel"]
			, [document.getElementById("Save-btn")  as HTMLButtonElement, "Save New Game"]);
	
			this.StatePage = 2;
			this.removeDeleteButton();
			this.NewGameForm.classList.remove("hidden");
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

	private async deleteGame(gameId: number) {
		try {
			const request = await deleteGame(gameId);
			if (!request.ok) {
				throw new Error('Unable to delete game : ' + request.error);
			}
			alert("Game deleted");
		} catch (error) {
			alert(error);
		}
		await this.refreshAvailableGames();
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
		this.NewGameForm.classList.add("hidden");
		await this.refreshAvailableGames();
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

	private newPlayerCheckBoxEvent(MeCheckbox: HTMLInputElement
						,MePlayerInput: HTMLInputElement
						,ElseCheckBox: HTMLInputElement
						,ElsePlayerInput: HTMLInputElement
						, Select: HTMLSelectElement) {
			
			MeCheckbox?.addEventListener('change', () => {
			if (MeCheckbox.checked) {
				this.ChangePlayerNameInput(ElseCheckBox, ElsePlayerInput, Select.value);
				MePlayerInput.value = state.user?.username || '';
				MePlayerInput.readOnly = true;
			} 
			else {
				MePlayerInput.readOnly = false;
				MePlayerInput.value = '';
			}
		});
	}

	private newPlayerSelectEvent(MeCheckbox: HTMLInputElement
						,ElseCheckBox: HTMLInputElement
						,ElsePlayerInput: HTMLInputElement
						, Select: HTMLSelectElement) {

		if (!Select )
			alert('there is no Select')
		Select.addEventListener('change', () => {
			if (Select.value == "1 player vs AI") {
				if (MeCheckbox.checked) {
					ElsePlayerInput.value = "Crabby The Bot";
					ElsePlayerInput.readOnly = true;
					console.log("change player value to crabby the bot");
					console.log("Valeur réelle après 0.5s :", ElsePlayerInput.value);
				}
			}
			else {
				if (MeCheckbox.checked) {
					ElsePlayerInput.value = "";
					ElsePlayerInput.readOnly = false;
				}
			}
			console.log("Valeur réelle après 0.5s :", ElsePlayerInput.value);
		})
		
	}

	private ChangePlayerNameInput(ElseCheckBox: HTMLInputElement ,ElsePlayerInput: HTMLInputElement, SelectedValue: string) {
		ElseCheckBox.checked = false;
		console.log("selcted Value in checkbox: ", SelectedValue);
		if (SelectedValue == "1 player vs AI") {
			ElsePlayerInput.value = 'Crabby The Bot';
			ElsePlayerInput.readOnly = true;
		}
		else {
			console.log("bonjour");
			if (ElsePlayerInput.value)
				ElsePlayerInput.value = '';
			ElsePlayerInput.readOnly = false;
		}
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

	private async renderDropdown(Parent: HTMLElement, Options: string[], Name: string, TextContent: string): Promise<void> {
		const Div = createDropdownDiv(Options, Name, TextContent, 
			["flex items-center w-full h-[10%] justify-between p-4 bg-orange-300 focus:bg-orange-400  rounded-lg py-3 px-4 space-x-4",
			"w-[40%]  text-emerald-600 font-bold underline", 
			"w-[30%]  bg-orange-400 rounded-lg text-emerald-700"]);

		append(Parent, [Div]);
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
