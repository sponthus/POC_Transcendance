/*****************************************************************export class for dialogue*****************************************************************/

import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Color } from "../Color";
import { state } from "../../ui/state";
import { navigate } from '../../router.js';

export class dialogueBox {

	private _dialogue: GUI.Rectangle;
	private _texture: GUI.AdvancedDynamicTexture;
	private _dialoguetext: GUI.TextBlock;

	constructor(msg: string) {
		this._texture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

		this._dialoguetext = new GUI.TextBlock;

		this._dialogue = new GUI.Rectangle;
		this._dialogue.width = "20%";
		this._dialogue.height = "10%";
		this._dialogue.cornerRadius = 20;
		this._dialogue.color = "white";
		this._dialogue.thickness = 2;
		this._dialogue.background = "black";
		this._dialogue.isVisible = false;

		this._dialoguetext.text = msg;
		this._dialoguetext.color = "white"
		this._dialoguetext.fontSize = 22;

		this._dialogue.addControl(this._dialoguetext);
		this._texture.addControl(this._dialogue);
	}

	_isvisible(): boolean {
		return this._dialogue.isVisible;
	}
	showDialogue() {
		this._dialogue.isVisible = true;
	}

	hideDialogue() {
		this._dialogue.isVisible = false;
	}

	changeDialogue(msg: string) {
		this._dialoguetext.text = "";
		this._dialoguetext.text = msg;
	}
}