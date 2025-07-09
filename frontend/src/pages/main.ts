/****3D animation use babylonjs*****/
import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
// import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import	{DropDownMenu } from "./menu/dropDown";

import { BasePage } from "./BasePage.js";
// import { PlayerInput } from "./inputController";
// import { Player } from "./characterController";

import { Engine, Scene, ArcRotateCamera, SceneLoader, Vector3, HemisphericLight, Mesh, MeshBuilder} from "@babylonjs/core";
import { Dropdown } from "@babylonjs/inspector/fluent/primitives/dropdown";

enum State {START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3}

export class App extends BasePage {
	/**for general engine**/
	private _scene: Scene;
	private _canvas: HTMLCanvasElement | null = null;
	private _engine: Engine;
	private _isocamera: BABYLON.FreeCamera;

	/**fps calculator**/
	private _lastUpdateTime: number = 0; // last update for fps
	/**for statement **/
	private _state:number = 0; // state of the game

	/**for Player***/
	// public   assets;
	private _previousAngle: number | null = null; //player angle state
	private _player: BABYLON.Mesh | null = null; // mesh player
		
	/**for animation player**/
	private _walkAnimation: BABYLON.AnimationGroup | null = null;
	private _rotateAnimation: BABYLON.AnimationGroup | null = null;

	/*******for environement****/
	// private _Sand: BABYLON.Mesh | null = null;
	private     _map: BABYLON.TransformNode | null = null

	/**for input**/
	private _inputMap: {[key: string]: boolean} = {}; //input keyboard map
	// private _gamescene: Scene;

	/***********dropdown menu************/
	private	_dropDown: DropDownMenu | null = null;

	constructor() {
		super();
	}
	async render(): Promise<void>  {
		await this.renderBanner();
		this._initBabylon();
	}
	private _initBabylon() {
		this._canvas = this._createCanvas();
		this._engine = new Engine(this._canvas, true);
		this._scene = new Scene(this._engine);
		
		/*******set Camera*******/
		this._isocamera = new BABYLON.FreeCamera("isocamera", new Vector3(20, 20, -20), this._scene);
		this._isocamera.mode = BABYLON.FreeCamera.ORTHOGRAPHIC_CAMERA;
		this._isocamera.setTarget(Vector3.Zero());
		this._isocamera.minZ = 0.1; 
		
		const zoom = 1/50;
		this._isocamera.orthoLeft = -this._engine.getRenderWidth() * zoom;
		this._isocamera.orthoRight = this._engine.getRenderWidth() * zoom;
		this._isocamera.orthoTop = this._engine.getRenderHeight() * zoom;
		this._isocamera.orthoBottom = -this._engine.getRenderHeight() * zoom;
		this._isocamera.detachControl();
		this._scene.activeCamera = this._isocamera;
		/*****set light*****/
		var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);
		
		this._scene.collisionsEnabled = true; // activation colision
		this._scene.gravity = new BABYLON.Vector3(0, -0.1, 0); // activation gravity
		/*******for debug window******/
		window.addEventListener('keydown', (ev) => {
			if (ev.shiftKey && ev.ctrlKey && ev.altKey &&(ev.key == "i" || ev.key == "I")) {
				if (this._scene.debugLayer.isVisible())
					this._scene.debugLayer.hide();
				else
					this._scene.debugLayer.show(); }
		});
		this._setupInput();
		/*******run main render loop********/
		this._engine.runRenderLoop(() => {
			this._update();
			this._scene.render();
		});
		this._main();
	}
	private _createCanvas(): HTMLCanvasElement {
		document.body.innerHTML = "";
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

		console.log("Canvas créé et ajouté au DOM");
		return this._canvas;
	}

	/***********keyboard input Event**************/
	private async _setupInput() {
		this._scene.actionManager = new BABYLON.ActionManager(this._scene);
		this._scene.onKeyboardObservable.add((kbInfo) => {
			const key = kbInfo.event.key.toLowerCase();
			if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN)
				this._inputMap[key] = true;
			else if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP) 
				this._inputMap[key] = false;
		});
	}

	/*************update position and state**********/
	private _update() {
		if (!this._player)
		    return ;
		const speed = 0.05;
		let move = new Vector3(0, 0, 0);
		let direction = BABYLON.Vector3.Zero();
		if (this._inputMap['z'] || this._inputMap["arrowup"]) {
			direction.x += 1;
			direction.z += 1;
			console.log("touch z :");
			move.z += speed;
			move.x -= speed;
		}
		if (this._inputMap['s'] || this._inputMap["arrowdown"]) {
			direction.x -= 1;
			direction.z -= 1;
			console.log("touch s:");
			move.z -= speed;
			move.x += speed;
		}
		if (this._inputMap['q'] || this._inputMap["arrowleft"]) {
			direction.z += 1;
			direction.x -= 1;
			console.log("touch q:");
			move.x -= speed;
			move.z -= speed;
		}
		if (this._inputMap['d'] || this._inputMap["arrowright"]) {
			direction.x += 1;
			direction.z -= 1;
			console.log("touch d :");
			move.z += speed;
			move.x += speed;
		}
		if (direction.equals(BABYLON.Vector3.Zero())) {
			this._walkAnimation?.stop();
			return ;
		}
		else {
			this._walkAnimation?.start(true, 1.0, this._walkAnimation.from, this._walkAnimation.to, false);
			direction = direction.normalize();
			const gravity = this._scene.gravity;
			move = move.add(gravity);
			this._player.moveWithCollisions(move);
			const angle = Math.atan2(direction.x, direction.z);
			const correctionAngle = Math.PI / 2;
			const finalAngle = angle + correctionAngle;
			if (this._previousAngle == null || Math.abs(finalAngle - this._previousAngle) > 0.1) {
				this._player.rotation.y = finalAngle;
				this._previousAngle = finalAngle;
			}
		}
	}

	/********main function of the game*******************/
	private async _main(): Promise<void>  {
		/************set up player**********/
		const player = await BABYLON.SceneLoader.ImportMeshAsync(null, "/asset/Characters/Models/GLBformat/", "character-q.glb", this._scene);
		if (player)
			console.log("Meshes import succesfully", player.meshes);
		/************set up mesh**********/
		player.meshes.forEach(mesh => {
			mesh.position =   new BABYLON.Vector3(5, 0, 5);
			mesh.rotation = new BABYLON.Vector3(0, 0, 0);
			mesh.rotation.x = 0;
			mesh.rotation.y = 0;
			mesh.rotation.z = 0;
			mesh.scaling.scaleInPlace(1.0);
			// Matériau temporaire au cas où
			if (mesh instanceof BABYLON.Mesh && !mesh.material) {
				const mat = new BABYLON.StandardMaterial("forceMat", this._scene);
				mat.diffuseColor = BABYLON.Color3.Green();
				mat.backFaceCulling = false;
				mesh.material = mat;
			}
		});
		this._player = player.meshes[0] as BABYLON.Mesh;
		this._player.checkCollisions = true; // activation collision for player
		this._player.ellipsoid = new BABYLON.Vector3(0.7, 1.5, 0.7); // define collision arround player
		this._player.ellipsoidOffset = new BABYLON.Vector3(0, 1.5, 0); // center collision not necessary
		this._walkAnimation = this._scene?.getAnimationGroupByName("walk");
		this._rotateAnimation = this._scene?.getAnimationGroupByName("idle");
		this._rotateAnimation?.start(true, 0.5, this._rotateAnimation.from, this._rotateAnimation.to, false);

		/************generate environement map**********/
		const mapLayout: number[] = [
			0, 0, 0, 0, 0, 0, 0, 0, 6, 6,
			0, 1, 2, 2, 0, 0, 0, 0, 6, 6,
			1, 3, 4, 1, 2, 1, 2, 7, 7, 7,
			3, 1, 1, 2, 1, 2, 2, 3, 6, 6,
			4, 1, 2, 2, 1, 2, 2, 3, 7, 7,
			0, 0, 2, 3, 2, 2, 3, 6, 6, 6,
			1, 3, 1, 3, 7, 8, 2, 7, 7, 7,
			1, 1, 1, 6, 9, 8, 8, 7, 7, 7,
			1, 1, 8, 6, 7, 9, 8, 0, 0, 0,
			0, 0, 0, 0, 7, 8, 8, 0, 0, 0
		];
		const titleType: Record<number, string> = {
			0: "nothing",
			1: "/asset/environements/Models/GLBformat/patch-sand-foliage.glb",
			2: "/asset/environements/Models/GLBformat/patch-sand.glb",
			3: "/asset/environements/Models/GLBformat/patch-grass.glb",
			4: "/asset/environements/Models/GLBformat/patch-grass-foliage.glb",
			6: "/asset/environements/Models/GLBformat/rocks-a.glb",
			7: "/asset/environements/Models/GLBformat/rocks-b.glb",
			8: "/asset/environements/Models/GLBformat/rocks-sand-a.glb",
			9: "/asset/environements/Models/GLBformat/rocks-sand-b.glb"
		}
		const Loaded: Record<string, BABYLON.AbstractMesh> = {};
		for (const type in titleType) {
			if (titleType[type] != "nothing")
			{
				const result = await BABYLON.SceneLoader.ImportMeshAsync("", "", titleType[type], 				this._scene);
				const mesh = result.meshes[0];
				mesh.scaling.scaleInPlace(2);
				mesh.position =  BABYLON.Vector3.Zero();
				mesh.setEnabled(false);
				Loaded[type] = mesh;
			}
		}
		const titleSize: number = 2;
		let x:number = 0;
		let z:number = 0;
		const gridWidth: number = 10;
		const gridHeigt: number = 10;
		this._map = new BABYLON.TransformNode("map", this._scene);
		while (z < gridWidth) {
			x = 0;
			while (x < gridHeigt){
				const index: number = z * gridWidth + x;
				if (mapLayout[index] != 0) { 	
					let titleid: number = mapLayout[index];
					const template = Loaded[titleid.toString()] as BABYLON.AbstractMesh;
					if (!template)
					{
						console.warn("no template here");
						continue;
					}
					const instance = template.instantiateHierarchy() as   BABYLON.TransformNode;
					instance.parent = this._map;
					instance.position.set(x * titleSize, 0, z * titleSize);
					instance.setEnabled(true);
					instance.getChildMeshes().forEach(child => {
						child.checkCollisions = true;
						instance.scaling.scaleInPlace(0.35);
					});
				}
				x++;
			}
			z++;
		}
		this._map.position = new BABYLON.Vector3(-15, -1, -15);
		this._map.scaling.scaleInPlace(2.5);

		/***********************button*********************/
		this._dropDown = new DropDownMenu(this._scene);
	}
}

