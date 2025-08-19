import { navigate } from "../core/router";
import { BasePage } from "./BasePage";
import { State } from "../core/state.js";
import { createDiv, createElement, createButton, createDropdownDiv, createFormDiv, createCheckBoxLabel, append, createImage} from '../Utils/elementMaker.js';
import { CreateDecoderAsync } from "@babylonjs/core";

const state = State.getInstance();

export class SettingPage extends BasePage {

	private front!: HTMLElement;
	private ButtonDiv!: HTMLElement;
	private SettingDiv!: HTMLElement;
	private SettingText!: HTMLElement;

	private ReturnDiv!: HTMLElement;
	constructor () {
		super();
	}

	async render(): Promise<void> {
		if (state.isLoggedIn()) {

			this.renderBanner();

			await this.createHomeSetting();
			await this.createSettingDiv();
			await this.createReturnDiv();

			await this.renderHomeSetting();
		}
		else
			navigate('/');
	}

	/*********************************************function for creating Home Setting**********************************************/
	private async createHomeSetting() {
	
			const Background: HTMLElement = this.initBackground();
			Background.className = "flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 p-8";

			this.createFrontSettting();
			this.createSettingText();
			this.createButtonDiv();	
			

			Background.appendChild(this.front);

			this.app.appendChild(Background);
	}

	private createFrontSettting() {
		this.front = createDiv("grid Setting_front", "rounded-xl shadow-2xl p-12 max-w-md w-full text-center space-y-4");
	}

	private createSettingText() {
		this.SettingText = createElement('h1', "setting_text", "Settings", "text-emerald-600 text-2xl py-3 px-6");
		append(this.front, [this.SettingText]);
	}

	private createButtonDiv() {
		this.ButtonDiv = createDiv("Button_setting", "flex flex-col space-y-4");
		append(this.front, [this.ButtonDiv]);
	}

	private async createSettingDiv() {
		this.SettingDiv = createDiv("setting", "flex flex-col space-y-4");
		append(this.front, [this.SettingDiv]);
	}

	private async renderHomeSetting(): Promise<void> {
		this.createGameSettingButton();
		this.createProfileSettingButton();
	}

	private createGameSettingButton() {
		const gameSettingButton = createButton("Game-Setting", "bg-orange-300 hover:bg-orange-400 text-emerald-600 font-bold py-3 px-6 rounded-lg", "Game-Setting");
		gameSettingButton.addEventListener('click', async(e) => {
			this.renderGameSetting();
		});
		append(this.ButtonDiv, [gameSettingButton]);
	}

	private createProfileSettingButton() {
		const ProfileSettingButton = createButton("profile-setting", "bg-orange-300 hover:bg-orange-400 text-emerald-600 font-bold py-3 px-6 rounded-lg", "Profile Setting");
		ProfileSettingButton.addEventListener('click', async(e) => {
			this.renderProfileSetting();
		});
		append(this.ButtonDiv, [ProfileSettingButton]);
	}

	/*********************************************function for creating Game Setting**********************************************/
	private async renderGameSetting(): Promise<void> {
		this.SettingText.textContent = "Game Settings";
		this.ButtonDiv.classList.add('hidden');
		append(this.SettingDiv, [this.createAvatarBtn("Lobby-user-avatar", 18, "/asset/Characters/Previews/Previews/", "change Lobby user Avatar :")
								,this.createAvatarBtn("Lobby-png-avatar", 11, "/asset/Characters/Previews/Previews1/", "change Lobby png Avatar :")]);
		
		this.manageEventAvatar("Lobby-user-avatar-btn", "Lobby-user-avatar-btn-div");
		this.manageEventAvatar("Lobby-png-avatar-btn", "Lobby-png-avatar-btn-div");
		this.ReturnDiv.classList.remove('hidden');
	}
	
	private createAvatarBtn(Id: string, MaxI: number, Folder: string, TextContent: string) : HTMLElement {
		const Div = createDiv(Id, "flex flex-col items-center justify-center space-y-8");
		append(Div, [createButton(Id, "text-emerald-600 text-center bg-orange-300 hover:bg-orange-400 hover:font-bold py-3 px-6  rounded-lg", TextContent)
								, this.createDropdownAvatar(Id, MaxI, Folder)]);
		return Div;
	}

	private createDropdownAvatar(Id: string, MaxI: number, Folder: string): HTMLElement {
		const BtnDiv = createDiv(Id + "-btn", "flex flex-wrap items-center justify-center gap-4 hidden");

		this.AddAvatarBtns(BtnDiv, Id, MaxI, Folder);
		return BtnDiv;
	}

	private AddAvatarBtns(parent: HTMLElement,Id: string, MaxI: number, Folder: string) {
			for (let i = 0; i < MaxI; i++) {
			const btn: HTMLButtonElement = createButton(`${Id}${i.toString()}`, "h-16 aspect-square border-2 border-orange-300 hover:bg-orange-400", "")
			
			const src = `${Folder}character-${i.toString()}.png`;
			console.log('src = ', src);
			const img: HTMLImageElement = createImage(`${Id}${i.toString()}`, "h-14 aspect-square", src);

			btn.appendChild(img);
			parent.appendChild(btn);
		}
	}

	private manageEventAvatar(IdBtn: string, IdDiv: string) {
		const btn = document.getElementById(IdBtn) as HTMLButtonElement;
		const Div = document.getElementById(IdDiv) as HTMLElement;

		btn.addEventListener('click', () =>{
			if (Div.classList.contains("hidden"))
				Div.classList.remove('hidden');
			else
				Div.classList.add('hidden');
		})
	}

	/*********************************************function for creating Profile Setting**********************************************/
	private async renderProfileSetting(): Promise<void> {
		this.SettingText.textContent = "Profile Settings";
		this.ButtonDiv.classList.add('hidden');

		this.ReturnDiv.classList.remove('hidden');
	}

	/*********************************************function utils**********************************************/
	private async createReturnDiv() {
		this.ReturnDiv = createDiv("return", "grid grid-cols-2 items-center justify-between p-4 bg-transparent py-3 px-4 space-x-4 hidden");
		
		this.createReturnBtn();
		this.createSaveBtn();
		this.front.appendChild(this.ReturnDiv);
		this.manageReturnEvent();
	}

	private createReturnBtn() {
		const ReturnButton: HTMLButtonElement = createButton("return", "bg-orange-300 hover:bg-orange-400 text-emerald-600 font-bold rounded-lg transition-colors duration-200transform", "return");

		this.ReturnDiv.appendChild(ReturnButton);
	}

	private createSaveBtn() {
		const DoneButton: HTMLButtonElement = createButton("done", "bg-orange-300 hover:bg-orange-400 text-emerald-600 font-bold rounded-lg transition-colors duration-200transform", "Done");

		this.ReturnDiv.appendChild(DoneButton);
	}

	/*********************************************function utils for manage event**********************************************/
	private manageReturnEvent() {
		const returnBtn = document.getElementById("return-btn") as HTMLButtonElement;
		const DoneButton = document.getElementById("done-btn") as HTMLButtonElement;

		returnBtn.addEventListener('click', async(e) => {
			await this.Return();
		})

		DoneButton.addEventListener('click', async(e) => {
			await this.Return();
		})
	}

	private async Return(): Promise<void> {
		this.SettingText.textContent = "Settings";
		Array.from(this.SettingDiv.children).forEach((child, index)=>{
			child.remove();
		})
		this.ButtonDiv.classList.remove('hidden');
	}
}