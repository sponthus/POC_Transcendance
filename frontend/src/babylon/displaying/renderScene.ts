/*****************************************************************export class for render scene*****************************************************************/
import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

export class renderScene {

	private _canvas: HTMLCanvasElement | null = null;
	private _engine: BABYLON.Engine | null = null;
	private _scene: BABYLON.Scene | null = null;
	private _isocamera?: BABYLON.FreeCamera;
	private _light?: BABYLON.HemisphericLight;


	constructor() {
		/**********************scene builder***********************/
		this._canvas = this._initCanvas();

		this._initEngine();
		this._initScene();
		this._initGravity();
		this._initIsoCamera();
		this._initLight();

		this._setdebugLayer();

		this._renderingloop();
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

	private _initScene() {
		this._scene = new BABYLON.Scene(this._engine!);
		this._scene.autoClear = true;
		this._scene.autoClearDepthAndStencil = true;
		this._scene.blockMaterialDirtyMechanism = true;
	}

	private _initEngine() {
		this._engine = new BABYLON.Engine(this._canvas, true);
	}

	private _initIsoCamera() {
		this._isocamera = new BABYLON.FreeCamera("isocamera", new BABYLON.Vector3(20, 20, -20), this._scene!);
		this._isocamera.mode = BABYLON.FreeCamera.ORTHOGRAPHIC_CAMERA;
		this._isocamera.setTarget(BABYLON.Vector3.Zero());
		this._isocamera.minZ = 0.1; 

		const zoom: number = 0.015;
		this._isocamera.orthoLeft = (-this._engine!.getRenderWidth() * zoom);
		this._isocamera.orthoRight = (this._engine!.getRenderWidth() * zoom);
		this._isocamera.orthoTop = (this._engine!.getRenderHeight() * zoom);
		this._isocamera.orthoBottom =( -this._engine!.getRenderHeight() * zoom);
		this._isocamera.detachControl();
		this._scene!.activeCamera = this._isocamera;
	}

	private _initLight() {
		this._light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), this._scene!);
	}

	private _initGravity() {
		this._scene!.collisionsEnabled = true; // activation colision
		this._scene!.gravity = new BABYLON.Vector3(0, -0.1, 0); // activation gravity
	}

	get scene(): BABYLON.Scene | null {
		return this._scene;
	}
	get engine(): BABYLON.Engine | null{
		return this._engine;
	}
	get	canvas(): HTMLCanvasElement | null {
		return this._canvas;
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
				this._scene!.render();
			}
		});
	}
	private _setdebugLayer() {
		console.log("Debug layer:", this._scene?.debugLayer);
		window.addEventListener('keydown', (ev) => {
			if (ev.shiftKey && ev.ctrlKey && ev.altKey &&(ev.key == "i" || ev.key == "I")) {
				if (this._scene!.debugLayer.isVisible())
					this._scene!.debugLayer.hide();
				else
					this._scene!.debugLayer.show(); }
		});
	}
}