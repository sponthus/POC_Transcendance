import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import {Color} from "../Color";
import {windowMenu} from "./windowMenu";

export class messageMenu {

	private _WindowPanel: windowMenu;

	public constructor(scene: BABYLON.Scene, guiTexture: GUI.AdvancedDynamicTexture, colors : Color[]) {
		this._WindowPanel = new windowMenu(scene, guiTexture, colors, "Message");
	}
	public getWindow(): windowMenu {
		return this._WindowPanel;
	}
}