import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { state } from "../ui/state.js";
import	{DropDownMenu } from "./menu/dropDown";
import { BasePage } from "../pages/BasePage.js";
import { renderScene } from "./displaying/renderScene";
import { renderMap } from "./displaying/renderMap";
import { renderAnimation } from "./displaying/animationCharacter";	
import { PlayerInput } from "./displaying/inputController";
// import { Player } from "./displaying/characterController";
import { renderAsset } from "./displaying/renderAsset";


enum State {START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3}

export class App extends BasePage {

	private	_renderScene?: renderScene;
	private	_renderAsset?: renderAsset;
	private	_renderMap?: renderMap;
	private _animation?: renderAnimation;
	private _input?: PlayerInput;
	// private Player?: Player;
	private _slug: string;

	/***********dropdown menu************/
	private	_dropDown: DropDownMenu | null = null;

	constructor(slug: string) {
		super();
		this._slug = slug;
	}
	async render(): Promise<void>  {
		//document.body.innerHTML = "";
		await this.renderBanner();

		this._renderScene = new renderScene();
		this._renderAsset = new renderAsset(this._renderScene.scene!);
		
		await this._renderAsset._load();

		this._animation = new renderAnimation(this._renderScene.scene!);
		this._animation.startidle();
		this._renderMap = new renderMap(this._renderScene.scene!,  this._renderAsset.LoadedMap!);

		this._input = new PlayerInput(this._renderScene.scene!, this._renderAsset.playermesh, this._animation);
		this._dropDown = new DropDownMenu(this._renderScene.scene!);

	}
}

