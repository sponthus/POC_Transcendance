
import { State } from "../../core/state.js";
import { createDiv, createElement, createButton, createDropdownDiv, createFormDiv, createCheckBoxLabel, append} from '../../Utils/elementMaker.js';
import { createLocalGame, getAvailableGames, startGame, deleteGame } from "../../api/game.js"

const state = State.getInstance();

export class availableGames {
	private Page: HTMLElement;
	private PartyMap: Map<number, HTMLInputElement>;

	constructor(page: HTMLElement,  PartyMap: Map<number, HTMLInputElement>) {
		this.Page = page;
		this.PartyMap = PartyMap;
	}
	render () {
		this.createAvailableGame();
	}

	private async createAvailableGame() {
		const AvailableDiv: HTMLElement = createDiv("available-games", "flex flex-col items-center w-[90%] h-[90%] space-y-8  mb-auto");

		const TitlePartys = createElement('p', "Title-Party", "", "text-center text-emerald-600 w-[50%] font-bold border-4 rounded-xl translate-y-4border-orange-400 shadow-xl")

		const BodyParty: HTMLElement = createDiv("Body-Party", "flex flex-col w-[90%] h-64 border-4 border-orange-400 rounded-xl -translate-y-2shadow-xl overflow-auto");

		append(AvailableDiv, [TitlePartys, BodyParty]);
		append(this.Page, [AvailableDiv]);
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
					const PartyDiv: HTMLElement = createDiv("game-item" + index.toString(), "flex border-2 border-orange-600 w-full h-[40%]space-x-10");

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
		const GameIdText = createElement('h2', "party-item " + index.toString(), `Game #${Party.id} :` , "text-emerald-600 text-center underlinefont-bold") as HTMLElement;

		append(GameIdDivs, [GameIdText]);
		append(Div, [GameIdDivs]);
	}

	private CreatePlayerNamesDiv(Div: HTMLElement, index: number, Party: any) {
		const PLayersNameDivs = createDiv("party-Players-Name" + index.toString(), "grid grid-rows-4 items-center justify-center") as HTMLElement;
		const PlayerText =  createElement('h2', "party-Players-Name" + index.toString(), "Players : ", "text-emerald-600 text-center font-boldunderline") as HTMLElement;
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
		const CreatedAtText = createElement('h2', "party-statue" + index.toString(), `Created At : `, "text-emerald-600 text-center underlinefont-bold") as HTMLElement;
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
}
