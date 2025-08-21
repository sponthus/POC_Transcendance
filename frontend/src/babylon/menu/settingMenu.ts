import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import {Color} from "../Color";
import {windowMenu} from "./windowMenu";

export class settingMenu {

	private _WindowPanel: windowMenu;

	public constructor(scene: BABYLON.Scene, guiTexture: GUI.AdvancedDynamicTexture, colors : Color[]) {
		this._WindowPanel = new windowMenu(scene, guiTexture, colors, "Setting");
	}
	public getWindow(): windowMenu {
		return this._WindowPanel;
	}
}

// private	_creatColorCursor(name: string, value: number, currentCursor: GUI.Slider) {
// 	const panel = new GUI.StackPanel() as GUI.StackPanel;
// 	panel.isVertical = false;
// 	panel.height = "40px";
// 	panel.paddingTop = "10px";

// 	const textBlock = new GUI.TextBlock() as GUI.TextBlock;
// 	textBlock.text = name;
// 	textBlock.width = "60px";
// 	textBlock.color = this._color4ToCss(this._colorText._color);
// 	textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
// 	panel.addControl(textBlock);

// 	currentCursor.minimum = 0;
// 	currentCursor.maximum = 255;
// 	currentCursor.value = value;
// 	currentCursor.height = "20px";
// 	currentCursor.width = "150px";
// 	panel.addControl(currentCursor);
	
// 	const valueBlock = new GUI.TextBlock() as GUI.TextBlock;
// 	valueBlock.text = currentCursor.value.toFixed(0).toString();
// 	valueBlock.width = "30px";
// 	valueBlock.color = this._color4ToCss(this._colorText._color);
// 	valueBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
// 	panel.addControl(valueBlock);
	
// 	currentCursor.onValueChangedObservable.add((NewValue) => {
// 		currentCursor.value = NewValue;
// 		valueBlock.text = NewValue.toFixed(0).toString();
// 		console.log("new value =", NewValue.toFixed(0));
// 		if (name == "r")
// 			this._colorBackground._r = NewValue;
// 		if (name == "g")	
// 			this._colorBackground._g = NewValue;
// 		if (name == "b")
// 			this._colorBackground._b = NewValue;
// 		this._colorBackground._updateColor();
// 		// this._colorPreview.background = this._color4ToCss(this._colorBackground._color);
// 	});
// 	return panel;
// }
// private	_setupColorMenu() {
// 	const titleTex = new GUI.TextBlock as GUI.TextBlock;
// 	titleTex.text = "Color Menu";
// 	titleTex.width = "100px";
// 	titleTex.height = "50px";
// 	titleTex.color = this._color4ToCss(this._colorText._color);
// 	titleTex.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
// 	titleTex.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
// 	titleTex.fontFamily = "lato";
// 	this._colorBackgroundPanel.addControl(titleTex);
// 	this._colorPreview.width = "100px";
// 	this._colorPreview.height = "100px";
// 	this._colorPreview.color = "black";
// 	this._colorPreview.thickness = 2;
// 	this._colorPreview.background = "rgb(45,24,248)";
// 	this._colorBackgroundPanel.addControl(this._colorPreview);
// 	this._colorBackgroundPanel.addControl(this._creatColorCursor("r", this._colorBackground._r, this._rCursor));
// 	this._colorBackgroundPanel.addControl(this._creatColorCursor("g", this._colorBackground._g, this._gCursor));
// 	this._colorBackgroundPanel.addControl(this._creatColorCursor("b", this._colorBackground._b, this._bCursor));
// 	this._colorBackgroundPanel.isVisible = false;
// 	this._guiTexture.addControl(this._colorBackgroundPanel);
// }