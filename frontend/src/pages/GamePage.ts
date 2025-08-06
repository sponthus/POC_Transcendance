import { navigate } from '../core/router.js';
import { checkLog } from "../api/check-log.js";
import { BasePage } from "./BasePage.js";
import * as BABYLON from "@babylonjs/core";
import { State } from "../core/state.js";
import { createLocalGame, getAvailableGames, startGame, deleteGame } from "../api/game.js"
import { popUp } from '../Utils/popUp.js';
import { renderScene } from '../babylon/displaying/renderScene.js';
import { DropDown } from "../Utils/dropDown";
import { createDiv, createElement, createButton, createDropdownDiv, createFormDiv, createCheckBoxLabel, append} from '../Utils/elementMaker.js';

const state = State.getInstance();

enum PageState {MOD = 0, PARTY = 1, NEWGAME = 2};

export class GamePage extends popUp {

	private Page!: HTMLElement;
	private NewGameForm!: HTMLElement;

	private scene!: BABYLON.Scene;
	private engine!: BABYLON.Engine;
	private render!: renderScene;

	private StatePage!: number;

	private isBotGame!: boolean;
	// private PopUp?: popUp;

    constructor(render: renderScene) {
		super("Create Game");
		this.scene = render.pongScene as  BABYLON.Scene;
		this.engine = render.engine as BABYLON.Engine;
		this.render = render;
		this.startGamePage();
    }

	private startGamePage() {
		this.StatePage = 0;
		this.isBotGame = true;
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

    async launchGame(gameId: number) {
        try {
			const request = await startGame(gameId);
			if (!request.ok) {
			    throw new Error('Unable to start game : ' + request.error);
			}
			state.launchGame(gameId);
			this.removeOverlayToWindow();
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
           
        } catch (error) {
            alert(error);
            await navigate('/game');
        }
    }

    async deleteGame(gameId: number) {
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

    async refreshAvailableGames() {
        const availableGamesDiv = document.getElementById('available-games-div');
        if (!availableGamesDiv || !state.user?.id) {
            console.log('availableGames debug');
			if(!availableGamesDiv)
         	   this.Page.innerHTML = `Error don't find availables games`;
            return;
        }

        try {
            // GET games for userId
            const result = await getAvailableGames(state.user?.id);
            if (!result.ok) {
                availableGamesDiv.innerHTML = 'Error loading games.';
                return;
            }
            const games = result.games;

			const TitlePartys = document.getElementById('Title-Party-p') as HTMLElement;
            // Render list of available games, possibility to show more info about each game if needed
            if (games.length === 0) {
                TitlePartys.textContent = 'No games available';
            }
			else {
				TitlePartys.textContent = 'available Partys';
				const BodyParty = document.getElementById("Body-Party-div")  as HTMLElement;
				let CheckBoxTab: HTMLLabelElement[];
				games.map((Party: any, index: number) => {
					const PartyDiv: HTMLElement = createDiv("game-item" + index.toString(), "flex border-2 border-orange-600 w-full h-[40%] space-x-4");

					const GameId = createElement('h3', "party-item" + index.toString(), `Game #${Party.id} `, "") as HTMLElement;		
					const PLayersName = createElement('p', "party-Players-Name" + index.toString(), `${Party.player_a} vs ${Party.player_b} `, "") as HTMLElement; 
					const GamesStatue = createElement('p', "party-statue" + index.toString(), `Status ${Party.status} `, "") as HTMLElement;
					const CreatedAt = createElement('p', "party-item" + index.toString(), `Status ${Party.status}`, "") as HTMLElement;
					const checkbox = createCheckBoxLabel("party-check", "choose", "choose one", ["text-emerald-600 space-x-4"," space-x-4 "]);
					// CheckBoxTab[index] = checkbox;

					append(PartyDiv, [GameId, PLayersName, GamesStatue, CreatedAt, checkbox]);
					append(BodyParty, [PartyDiv]);
				})

                // Add functionality for "Play button"
                document.querySelectorAll('.play-btn').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const gameIdStr = (e.target as HTMLElement).getAttribute('data-game-id');
                        const gameId = gameIdStr ? parseInt(gameIdStr, 10) : 0;
                        if (gameId == 0)
                            return;
                        console.log('Play button clicked for gameId ' + gameId);
                        await this.launchGame(gameId);
                    });
                });

                // Add functionality for "Delete button"
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const gameIdStr = (e.target as HTMLElement).getAttribute('data-game-id');
                        const gameId = gameIdStr ? parseInt(gameIdStr, 10) : 0;
                        if (gameId == 0)
                            return;
                        console.log('Delete button clicked for gameId ' + gameId);
                        await this.deleteGame(gameId);
                    });
                });
            }
        }
        catch (error) {
            console.error('Error fetching games:', error);
            availableGamesDiv.innerHTML = '<p>Error loading games</p>';
        }
    }

    // Add functionality : only 1 checkbox is available
    meCheckBox1ChoiceOnly(MeCheckbox: HTMLInputElement
						,MePlayerInput: HTMLInputElement
						,ElseCheckBox: HTMLInputElement
						,ElsePlayerInput: HTMLInputElement) {

		MeCheckbox?.addEventListener('change', () => {
			console.log("is bot game ? :", this.isBotGame);
			if (MeCheckbox.checked) {
				if (ElseCheckBox.checked) {
					ElseCheckBox.checked = false;
					if (this.isBotGame == true)
						ElsePlayerInput.value = 'Crabby The Bot';
					else {
						if (ElsePlayerInput.value )
						ElsePlayerInput.value = '';
					}
					ElsePlayerInput.readOnly = false;
				}
				MePlayerInput.value = state.user?.username || '';
				MePlayerInput.readOnly = true;
			} else {
				MePlayerInput.readOnly = false;
				MePlayerInput.value = '';
			}
		});

    }

    async open1v1GameForm() {

        const playerAMeCheckbox = document.getElementById('player_a_me-input') as HTMLInputElement;
        const playerBMeCheckbox = document.getElementById('player_b_me-input') as HTMLInputElement;
        const playerAInput = document.getElementById('PLayer1-input') as HTMLInputElement;
        const playerBInput = document.getElementById('Player2-input') as HTMLInputElement;

		this.checkLocalBot();
		this.meCheckBox1ChoiceOnly(playerAMeCheckbox, playerAInput, playerBMeCheckbox, playerBInput);
		this.meCheckBox1ChoiceOnly(playerBMeCheckbox, playerBInput, playerAMeCheckbox, playerAInput);

		await this.refreshAvailableGames();

    }

	private async checkLocalBot() {
		const playerBInput = document.getElementById('Player2-input') as HTMLInputElement;
	
		const Select = document.getElementById("PlayerMod-DropDown-Select") as HTMLSelectElement;
		Select?.addEventListener('change', () =>{
			console.log("select value : ", Select.value);
			console.log("event changer select", )
			if (Select.value == "1 player vs AI") {
				playerBInput.value = "Crabby The Bot";
				this.isBotGame = true;
			}
			else {
				playerBInput.value = "";
				this.isBotGame = false;
			}
		})
	}
	/*********************************************function for rendering Game Mod Select Page**********************************************/
	private async generate1v1GamePage() {
		this.cleanPage();
		this.Page.classList.remove("justify-center");
		this.create1v1PageDiv();
		this.create1v1FormDiv();
		this.createAvailableGame();

        document.getElementById('New-btn')?.addEventListener('click', async () => {
			this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Cancel"]
			, [document.getElementById("Save-btn")  as HTMLButtonElement, "Save New Game"]);
	
			this.StatePage = 2;

			this.NewGameForm.classList.remove("hidden");
        });

		this.open1v1GameForm();
    }

	private async create1v1FormDiv() {
		this.NewGameForm = createDiv("Form", "flex flex-col items-center justify-center w-full space-y-6 hidden");
		this.Page.appendChild(this.NewGameForm);
		this.render1v1FormDiv();
	}

	private async createAvailableGame() {
		const AvailableDiv: HTMLElement = createDiv("available-games", "flex flex-col items-center w-[90%] h-[90%] space-y-8  mb-auto");

		const TitlePartys = createElement('p', "Title-Party", "", "text-center text-emerald-600 w-[50%] font-bold border-4 rounded-xl translate-y-4 border-orange-400 shadow-xl")

		const BodyParty: HTMLElement = createDiv("Body-Party", "flex flex-col w-[90%] h-64 border-4 border-orange-400 rounded-xl -translate-y-2 shadow-xl overflow-auto");

		append(AvailableDiv, [TitlePartys, BodyParty]);
		append(this.Page, [AvailableDiv]);
	}
	private async render1v1FormDiv() {
		
		this.renderDropdown(this.NewGameForm ,["1 player vs AI", "Local Multiplayer"], "PlayerMod", "Pong player Mod :");
		this.renderDropdown(this.NewGameForm ,["5", "10", "15", "20", "No Limit"], "ScoreLimit", "Score Limit");



		const FormsDiv: HTMLFormElement = document.createElement('form');
		FormsDiv.id = "new-game-form";
		FormsDiv.className =  "flex items-center justify-between w-full";

		const Payer1Form: HTMLElement = createFormDiv(["text", "PLayer1", "Player 1 Name", true]
										,"Player1"
										,""
										,["flex items-center flex-row-reverse space-x-4 translate-x-32"
											,"block text-sm font-medium text-emerald-600 mb-2"
											,"w-full border bg-orange-200 border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-8 00 transition-colors duration-200 placeholder-emerald-600 text-center"
											,"block text-sm text-center font-medium text-emerald-500 mb-2"]);
		
		const checkbox1 = createCheckBoxLabel("player_a_me", "player_a_me", "me", ["text-emerald-600",""]);
		append(Payer1Form, [checkbox1]);

		const Payer2Form: HTMLElement = createFormDiv(["text", "Player2", "Player 2 Name", true]
										,"Player2"
										,""
										,["flex items-center flex-row-reverse space-x-4 -translate-x-32"
											,"block text-sm font-medium text-emerald-600 mb-2"
											,"w-full border bg-orange-200 border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-emerald-8 00 transition-colors duration-200 placeholder-emerald-600 text-center"
											,"block text-sm text-center font-medium text-emerald-500 mb-2"]);
	
		const checkbox2 = createCheckBoxLabel("player_b_me", "player_b_me", "me", ["text-emerald-600",""]);
		append(Payer2Form, [checkbox2]);


		append(FormsDiv, [Payer1Form, Payer2Form]);
		append(this.NewGameForm, [FormsDiv]);

	}

	private async create1v1PageDiv() {
		const Div : HTMLElement = createDiv("New", "flex flex-col items-center justify-center");

		const TextDiv: HTMLElement =  createDiv("1v1Page-title", "flex items-center justify-center");
		const GameModText: HTMLElement = createElement('h1', "1v1Page-title", "Create New Game",  "text-emerald-600 text-center underline");

		const BtnDiv: HTMLElement = createDiv("New", "flex items-center justify-center text-center p-4 bg-transparent py-3 px-4 w-full space-x-24");

		const ClassNameBtn: string = "bg-orange-200 hover:bg-orange-400 text-emerald-600 font-bold rounded-lg transition-colors duration-200transform w-full";
		const NewBtn: HTMLButtonElement = createButton("New", ClassNameBtn, "New");

		append(TextDiv, [GameModText]);
		append(BtnDiv, [NewBtn]);

		append(Div, [TextDiv, BtnDiv]);
		append(this.Page, [Div]);
	}

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
		// await this.renderDropdown(["1 player vs AI", "Local Multiplayer", "Mixed local AI"], "PlayerMod", "Pong player Mod :");
		// await this.createDropdown(["5", "10", "15", "20", "No Limit"], "ScoreLimit", "Score Limit");
	}

	/*********************************************function To Manage Event**********************************************/
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
					break;
				case PageState.NEWGAME:
					this.SaveNewParty();
					break;
				default: break;
			}
		})
	}

	/*********************************************function utils To Manage Event**********************************************/
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
		console.log("save party function called");
		const form = document.getElementById('new-game-form');
		const formData = new FormData(form as HTMLFormElement);

		const playerARaw = formData.get('Player1');
		const playerBRaw = formData.get('Player2');

		console.log('Raw values:', { playerARaw, playerBRaw });
		console.log('Types:', { typeA: typeof playerARaw, typeB: typeof playerBRaw });

		const playerA = (playerARaw as string)?.trim() || '';
		const playerB = (playerBRaw as string)?.trim() || '';

		console.log('After trim:', { playerA, playerB });
		console.log('Lengths:', { lengthA: playerA.length, lengthB: playerB.length });

		if (!playerA || !playerB) {
		    alert('Please enter both player names');
		    return;
		}
		if (playerA === playerB) {
		    alert('Player names must be different');
		    return;
		}

		try {
		    // Create game with API
		    if (!state.user?.id)
		        throw new Error('Not connected');
		    const request = await createLocalGame(state.user?.id, playerA, playerB);
		    if (!request.ok) {
		        throw new Error('Failed to create game');
		    }
		    // For now not using the returned data

		} catch (error) {
		    console.error('Error creating game:', error);
		    alert('Error creating game. Please try again.');
		}
		// Refresh available games
		await this.refreshAvailableGames();

		// Success message
		alert('Game created successfully!');

		this.StatePage = 1;

		this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Return"]
		, [document.getElementById("Save-btn")  as HTMLButtonElement, "Play"]);

		this.NewGameForm.classList.add("hidden");
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
		this.Page.classList.add("border-4");
		this.generateGamePage();
	}

	private CancelNewGame() {
		this.ChangeBackPageButtonText([document.getElementById("Return-btn") as HTMLButtonElement, "Return"]
		, [document.getElementById("Save-btn")  as HTMLButtonElement, "Play"]);

		this.StatePage = 1;
		console.log("Cancel New Game function called")
		this.NewGameForm.classList.add('hidden');
	}	
	/*********************************************function Utils*********************************************/
	private async renderDropdown(Parent: HTMLElement, Options: string[], Name: string, TextContent: string): Promise<void> {
		const Div = createDropdownDiv(Options, Name, TextContent, 
			["flex items-center w-full h-[10%] justify-between p-4 bg-orange-300 focus:bg-orange-400  rounded-lg py-3 px-4 space-x-4",
			"w-[40%]  text-emerald-600", 
			"w-[30%]  bg-orange-400 rounded-lg text-emerald-700"]);

		append(Parent, [Div]);
	}

	private async createReturnDiv(): Promise<void> {
		const Div: HTMLElement = createDiv("Submit", "flex items-center justify-center text-center p-4 bg-transparent py-3 px-4 h-[20%] w-full space-x-24");

		const ClassNameBtn: string = "bg-orange-200 hover:bg-orange-400 text-emerald-600 font-bold rounded-lg transition-colors duration-200transform w-[20%]";
		const ReturnBtn: HTMLButtonElement = createButton("Return", ClassNameBtn, "Return");
		const SaveBtn: HTMLButtonElement = createButton("Save", ClassNameBtn, "Save");

		append(Div, [ReturnBtn, SaveBtn]);
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
