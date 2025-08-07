import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Color } from "../Color";

export class windowMenu {
	private _Panel: GUI.Rectangle;
	private _bodyPanel: GUI.Rectangle;
	private _bodyRectangle: GUI.Rectangle;
	private _highBar: GUI.Rectangle;

	private _isDragging: boolean;

	private _title: string;
	private _colorBackground: Color;
	private _colorText: Color;
	private _guiTexture: GUI.AdvancedDynamicTexture;

	private _scene:BABYLON.Scene;

	public constructor (scene: BABYLON.Scene, guiTexture: GUI.AdvancedDynamicTexture, colors : Color[], title: string) {
		this._scene = scene;
		this._guiTexture = guiTexture;
		this._colorBackground = colors[0];
		this._colorText = colors[1];
		this._title = title;
		this._isDragging = false;

		this._Panel = new GUI.Rectangle();
		this._bodyPanel = new GUI.Rectangle();
		this._bodyRectangle = new GUI.Rectangle();
		this._highBar = new GUI.Rectangle;

		this._initSettingPanel();
		this._initBodyPanel();
		this._createHighBar();
		this._setUpBodyPanel();
		this._handleResizeWindow();
		this._guiTexture.addControl(this._Panel);
	}
	/*****************************init Window menu*****************************/
	private _initSettingPanel() {
		this._Panel.width = "520px";
		this._Panel.height = "520px";
		this._Panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		this._Panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
		this._Panel.background = "transparent"; //this._color4ToCss(this._colorBackground._color);
		this._Panel.thickness = 0;
		this._Panel.isVisible = false;
	}
	/*****************************init body of Window menu*****************************/
	private _initBodyPanel() {
		this._bodyPanel.width = "100%";
		this._bodyPanel.height = "100%";
		this._bodyPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		this._bodyPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		this._bodyPanel.background = this._colorBackground._color4ToCss();
		this._bodyPanel.thickness = 0;
		this._bodyPanel.cornerRadius = 12;
		this._Panel.addControl(this._bodyPanel);
	}
	/*****************************set Up body for Window menu*****************************/
	private _setUpBodyPanel() {
		const titlText = new GUI.TextBlock() as GUI.TextBlock;
		const titlRectangle = new GUI.Rectangle() as GUI.Rectangle;

		titlText.text = this._title;
		titlText.width = "100%";
		titlText.color = this._colorText._color4ToCss();
		titlText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
		titlText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		titlText.fontFamily = "sans-serif";

		titlRectangle.width = "50%";
		titlRectangle.height = "7%";
		titlRectangle.cornerRadius = 12;
		titlRectangle.paddingBottom = "1%";
		titlRectangle.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		titlRectangle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

		this._bodyRectangle.width = "92%";
		this._bodyRectangle. height = "92%";
		this._bodyRectangle.cornerRadius = 12;
		this._bodyRectangle.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		this._bodyRectangle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
		this._bodyRectangle.paddingTop = "5%";

		titlRectangle.addControl(titlText);
		this._bodyPanel.addControl(this._bodyRectangle);
		this._bodyPanel.addControl(titlRectangle);
	}
	/*****************************create highbar for Window menu*****************************/
	private _createHighBar () {
		const highBarButton = GUI.Button.CreateSimpleButton("highBAr", "") as GUI.Button;
		const crossButton = GUI.Button.CreateSimpleButton("crossButton", "❌​") as GUI.Button;
		
		this._setUpHighBar(this._highBar, highBarButton, crossButton);
		this._Panel.addControl(this._highBar);

		this._addEventHighBarMenu(highBarButton, crossButton);
	}
	/*****************************set up highbar for Window menu*****************************/
	private _setUpHighBar(highBar: GUI.Rectangle, highBarButton: GUI.Button, crossButton: GUI.Button) {
		highBar.width = "100%";
		highBar.height = "3%";
		highBar.background = "white";
		highBar.color = "grey";
		highBar.thickness = 1;
		highBar.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
		highBar.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

		crossButton.width = "4%"
		crossButton.height = "100%";
		crossButton.color = "black";
		crossButton.background = "white";
		crossButton.thickness = 0;
		crossButton.fontSize = "100%";
		crossButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

		highBarButton.width = "96%";
		highBarButton.height = "100%";
		highBarButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		highBarButton.background = "white";
		highBarButton.pointerDownAnimation = () => {};
		highBarButton.pointerUpAnimation = () => {};
		highBarButton.pointerEnterAnimation = () => {};
		highBarButton.pointerOutAnimation = () => {};

		highBar.addControl(crossButton);
		highBar.addControl(highBarButton);
	}
	/*****************************set up event highbar for Window menu*****************************/
	private	_addEventHighBarMenu(highBarButton: GUI.Button, crossButton: GUI.Button) {

		let offsetX: number = 0;
		let offsetY: number = 0;

		highBarButton.onPointerDownObservable.add((evt, state) => {
			this._isDragging = true;

			offsetX = this._scene.pointerX - parseInt(this._Panel.left.toString());
			offsetY = this._scene.pointerY - parseInt(this._Panel.top.toString());
			});
		highBarButton.onPointerUpObservable.add(() => {
			this._isDragging = false;
			});
		this._scene.onPointerObservable.add((pointerInfo) => {
			switch (pointerInfo.type) {
				case BABYLON.PointerEventTypes.POINTERMOVE:
					if (this._isDragging) {
						const evt = pointerInfo.event;

						this._Panel.left = `${this._scene.pointerX  - offsetX}px`;
						this._Panel.top = `${this._scene.pointerY - offsetY}px`;
					}
					break;
			}
			});
		crossButton.onPointerDownObservable.add(() => {
			this._setVisible(false);
			});
	}
	private _handleResizeWindow() {
		const resizeHandle = GUI.Button.CreateSimpleButton("resizeButton","↖️​") as GUI.Button;
		resizeHandle.width = "3%";
		resizeHandle.height = "100%";
		resizeHandle.background = "transparent";
		resizeHandle.thickness = 0;
		resizeHandle.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
		resizeHandle.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
		resizeHandle.pointerDownAnimation = () => {};
		resizeHandle.pointerUpAnimation = () => {};
		resizeHandle.pointerEnterAnimation = () => {};
		resizeHandle.pointerOutAnimation = () => {};
		this._highBar.addControl(resizeHandle);

		let isResizing : boolean = false;
		let startX: number = 0;
		let startY: number = 0;
		let startWidth: number = 0;
		let startHeight: number = 0;
		let newWidth: number = 0;
		let newHeight: number = 0;
		resizeHandle.onPointerDownObservable.add(() =>{
			isResizing = true;
			
			startX = this._scene.pointerX;
			startY = this._scene.pointerY;

			startWidth = parseInt(this._Panel.width.toString());
			startHeight = parseInt(this._Panel.height.toString());
			
		});
		resizeHandle.onPointerUpObservable.add(() => {
			isResizing = false;
		});
		this._scene.onPointerObservable.add((PointerInfo) => {
			if (!isResizing)
				return ;
			switch (PointerInfo.type)
			{
				case BABYLON.PointerEventTypes.POINTERMOVE:
					const deltaX: number = this._scene.pointerX - startX;
					const deltaY: number = this._scene.pointerY - startY;
					newWidth = Math.max(100, startWidth - deltaX);
					newHeight = Math.max(100, startHeight - deltaY);
					
					if (newWidth >= 520)
						this._Panel.width = `${newWidth}px`;
					if (newHeight >= 520)
						this._Panel.height = `${newHeight}px`;
					break;
			}
		});
	}
	/*****************************set visibility of Window menu*****************************/
	public _setVisible (visible: boolean) {
		if (visible == false)
		{
			this._Panel.left = 0;
			this._Panel.top = 0;
			this._Panel.width = "520px";
			this._Panel.height = "520px";
		}
		this._Panel.isVisible = visible;
	}
	/*****************************check visibility of Window menu*****************************/
	public _isVisible(): boolean {
		return this._Panel.isVisible;
	}
	/*****************************getters Window menu*****************************/
	public getWindowBody(): GUI.Rectangle {
		return this._bodyRectangle;
	}
}