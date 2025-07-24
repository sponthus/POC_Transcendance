/*****************************************************************export class for render scene*****************************************************************/
import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { PongGame } from "../pong/pong_game";

enum state {HOME = 0, PONG = 1};

export class renderScene {

	private _canvas: HTMLCanvasElement | null = null;
	private _engine: BABYLON.Engine | null = null;

	private _homeScene: BABYLON.Scene | null = null;
	private _pongScene: BABYLON.Scene | null = null;

	private _isocamera?: BABYLON.FreeCamera;
	private _light?: BABYLON.HemisphericLight;

	private _state: number;


	constructor() {
		/**********************scene builder***********************/
		this._canvas = this._initCanvas();

		this._initEngine();
		this._homeScene = this._initScene();
		this._pongScene = this._initScene();
		this._initPongGame();
		this._initGravity();
		this._initIsoCamera();
		this._initLight();

		this._setdebugLayer();

		this._renderingloop();
		this._state = 0;
	}

	private _initCanvas(): HTMLCanvasElement {
		/**********************canvas builder***********************/
		document.documentElement.style["overflow"] = "hidden";
		document.documentElement.style.overflow = "hidden";
		document.documentElement.style.width = "100%";
		document.documentElement.style.height = "100%";
		document.documentElement.style.margin = "0";
		document.documentElement.style.padding = "0";
		document.body.style.overflow = "hidden";
		document.body.style.width = "100%";
		document.body.style.height = "100%";
		document.body.style.margin = "0";
		document.body.style.padding = "0";
		//create the canvas html element and attach it to the webpage
		this._canvas = document.createElement("canvas");
		this._canvas.style.width = "100%";
		this._canvas.style.height = "100%";
		this._canvas.id = "gameCanvas";
		document.body.appendChild(this._canvas);

		console.log("Canvas create and add to DOM");
		return this._canvas;
	}

	private async _initPongGame(): Promise<void> {
		const pong = new PongGame();
		await pong.start(this.pongScene!, this.canvas!, this.engine!)
	}

	private _initScene(): BABYLON.Scene {
		const scene: BABYLON.Scene = new BABYLON.Scene(this._engine!);
		scene.autoClear = true;
		scene.autoClearDepthAndStencil = true;
		scene.blockMaterialDirtyMechanism = true;
		return scene;
	}

	private _initEngine() {
		this._engine = new BABYLON.Engine(this._canvas, true);
	}

	private _initIsoCamera() {
		this._isocamera = new BABYLON.FreeCamera("isocamera", new BABYLON.Vector3(2, 15, -20), this._homeScene!);
		this._isocamera.position = new BABYLON.Vector3(2, 15, -20);
		this._isocamera.mode = BABYLON.FreeCamera.ORTHOGRAPHIC_CAMERA;
		this._isocamera.setTarget(BABYLON.Vector3.Zero());
		this._isocamera.minZ = 0.1; 

		const zoom: number = 0.000012 * screen.width; // evantually to change with Dell machines
		console.log('zoom :', zoom);
		this._isocamera.orthoLeft = (-this._engine!.getRenderWidth() * zoom);
		this._isocamera.orthoRight = (this._engine!.getRenderWidth() * zoom);
		this._isocamera.orthoTop = (this._engine!.getRenderHeight() * zoom);
		this._isocamera.orthoBottom =( -this._engine!.getRenderHeight() * zoom);
		// this._isocamera.detachControl();
		this._isocamera.attachControl(this._canvas, true);
		this._homeScene!.activeCamera = this._isocamera;
	}

	private _initLight() {
		this._light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this._homeScene!);
	}

	private _initGravity() {
		this._homeScene!.collisionsEnabled = true; // activation colision
		this._homeScene!.gravity = new BABYLON.Vector3(0, -0.5, 0); // activation gravity
	}

	get homeScene(): BABYLON.Scene | null {
		return this!._homeScene;
	}

	get pongScene(): BABYLON.Scene | null {
		return this!._pongScene;
	}

	get engine(): BABYLON.Engine | null{
		return this!._engine;
	}

	get	canvas(): HTMLCanvasElement | null {
		return this!._canvas;
	}

	set setState(state: number) {
		this._state = state;
	}

	private	_renderingloop() {
		let lastTime = 0;
		const targetFPS = 60;
		const frameDuration = 1000 / targetFPS;
		let now;
		let delta;

		this._engine!.runRenderLoop(() => {
			now = performance.now();
			delta = now - lastTime;
			if (delta >= frameDuration) {
				lastTime = now;
				switch (this._state) {
					case state.HOME:
						this._homeScene!.render();
						break;
					case state.PONG:
						this._pongScene!.render();
						break;
				}
			}
		});
	}

	private _setdebugLayer() {
		console.log("Debug layer:", this._homeScene?.debugLayer);
		window.addEventListener('keydown', (ev) => {
			if (ev.shiftKey && ev.ctrlKey && ev.altKey &&(ev.key == "i" || ev.key == "I")) {
				if (this._homeScene!.debugLayer.isVisible())
					this._homeScene!.debugLayer.hide();
				else
					this._homeScene!.debugLayer.show(); }
		});
	}
}