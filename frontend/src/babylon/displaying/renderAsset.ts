/*****************************************************************export class for rendering assets*****************************************************************/

import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";

export class renderAsset {

	private _scene: BABYLON.Scene;
	private _player?: BABYLON.Mesh;

	private _chest?: BABYLON.TransformNode;
	private _sandcastle ?: BABYLON.TransformNode;

	private _loadedMap?: Record<string, BABYLON.AbstractMesh>;

	private _titleType: Record<number, string> = {
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
	
	constructor (scene: BABYLON.Scene) {
		this._scene = scene;
	}

	public async _load(): Promise<void> {
		
		await this._loadPlayer();
		await this._loadMap();
		await this.__loadStageSet();
	}

	private async _loadPlayer(){
		/******************************load player******************************/
		const result = await ImportMeshAsync("/asset/Characters/Models/GLBformat/character-q.glb", this._scene);
		if (result)
			console.log("Meshes Player import succesfully", result.meshes);
		this._setUpMesh(result, new BABYLON.Vector3(5, 0, 5), 1);
		this._player = result.meshes[0] as BABYLON.Mesh;
		if (!this._player)
			console.log("player not initialized:");
		this._addColision(this._player);
	}

	private  async _loadMap() {
		/******************************load maps Asset******************************/
		this._loadedMap = {};
		for (const type in this._titleType) {
			if (this._titleType[type] != "nothing")
			{
				const result1 = await ImportMeshAsync(this._titleType[type], this._scene);
				if (result1)
					console.log("Meshes map import succesfully", result1.meshes);
				else
					console.log("cannot map ", this._titleType[type]);
				this._setUpMesh(result1, BABYLON.Vector3.Zero(), 3.5);
				const mesh = result1.meshes[0];
				mesh.setEnabled(false);
				this._loadedMap[type] = mesh;
			}
		}
	}

	private async __loadStageSet(): Promise<void> {
	
		/**************************for boat 1**************************/
		const resBoat = await ImportMeshAsync("/asset/environements/Models/GLBformat/ship-pirate-large.glb", this._scene).then(function(resBoat) {
			var mesh: BABYLON.AbstractMesh = resBoat.meshes[0];
			mesh.setEnabled(false);
			var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
			instance.position = new BABYLON.Vector3(-26 , -1, 0);
			instance.rotation = new BABYLON.Vector3(0, 0, 0);
			instance.setEnabled(true);
			instance.scaling.scaleInPlace(2);
			instance.getChildMeshes().forEach(child => {
				child.checkCollisions = true;
			});
		});

		/**************************for boat 2**************************/
		const resBoat2 = await ImportMeshAsync("/asset/environements/Models/GLBformat/ship-ghost.glb", this._scene).then(function(resBoat2) {
			var mesh: BABYLON.AbstractMesh = resBoat2.meshes[0];
			mesh.setEnabled(false);
			var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
			instance.position = new BABYLON.Vector3(20 ,0, 20);
			instance.rotation = new BABYLON.Vector3(0, -1, 0.1);
			instance.setEnabled(true);
			instance.getChildMeshes().forEach(child => {
				child.checkCollisions = true;
			});
		});

		/**************************for boat 3**************************/
		const resBoat3 = await ImportMeshAsync("/asset/environements/Models/GLBformat/boat-row-small.glb", this._scene).then(function(resBoat3) {
			var mesh: BABYLON.AbstractMesh = resBoat3.meshes[0];
			mesh.setEnabled(false);
			var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
			instance.position = new BABYLON.Vector3(-20 ,0, 25);
			instance.rotation = new BABYLON.Vector3(0, -1, 0.1);
			instance.setEnabled(true);
			instance.scaling.scaleInPlace(2);
			instance.getChildMeshes().forEach(child => {
				child.checkCollisions = true;
			});
		});
		
		
		/**************************for plateform**************************/
		const resplateform = await  ImportMeshAsync("/asset/environements/Models/GLBformat/structure-platform.glb", this._scene).then(function (resplateform) {
			var mesh: BABYLON.AbstractMesh = resplateform.meshes[0];
			mesh.setEnabled(false);
			for (let index:number = 0; index < 25; index++) {
				var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
				instance.position = new BABYLON.Vector3(-21, 0, index - 5);
				instance.setEnabled(true);
				instance.getChildMeshes().forEach(child => {
					child.checkCollisions = true;
				});

			}
		})

		/**************************for bottle crate**************************/
		const rescrate = await  ImportMeshAsync("/asset/environements/Models/GLBformat/crate-bottles.glb", this._scene).then(function (rescrate) {
			var mesh: BABYLON.AbstractMesh = rescrate.meshes[0];
			mesh.setEnabled(false);
			for (let index:number = 0; index < 2; index++) {
				index + 5;
				var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
				instance.position = new BABYLON.Vector3(-19, 0, (index - 2) * 3);
				instance.setEnabled(true);
				instance.getChildMeshes().forEach(child => {
					child.checkCollisions = true;
				});
			}
		})

		/**************************for tree 1**************************/
		const restree = await  ImportMeshAsync("/asset/environements/Models/GLBformat/palm-straight.glb", this._scene).then(function (restree) {
			var mesh: BABYLON.AbstractMesh = restree.meshes[0];
			mesh.setEnabled(false);
			for (let index:number = 0; index < 2; index++) {
				var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
				instance.position = new BABYLON.Vector3(-19, 0,( index + 1) * 4);
				instance.setEnabled(true);
				instance.getChildMeshes().forEach(child => {
					child.checkCollisions = true;
				});
			}
			for (let index:number = 0; index < 3; index++) {
				var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
				instance.position = new BABYLON.Vector3((index - 1) * 2, 0, 30);
				instance.setEnabled(true);
				instance.getChildMeshes().forEach(child => {
					child.checkCollisions = true;
				});
			}
			for (let index:number = 0; index < 2; index++) {
				var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
				instance.position = new BABYLON.Vector3(30 * index, 0 , (index ) * 20);
				instance.setEnabled(true);
				instance.getChildMeshes().forEach(child => {
					child.checkCollisions = true;
				});
			}
		})

		/**************************for tree 1**************************/
		const restree2 = await  ImportMeshAsync("/asset/environements/Models/GLBformat/palm-detailed-bend.glb", this._scene).then(function (restree2) {
			var mesh: BABYLON.AbstractMesh = restree2.meshes[0];
			mesh.setEnabled(false);
			for (let index:number = 0; index < 2; index++) {
				var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
				instance.position = new BABYLON.Vector3(index * 30, 0,( index + 3) * 4);
				instance.setEnabled(true);
				instance.getChildMeshes().forEach(child => {
					child.checkCollisions = true;
				});
			}
			for (let index:number = 0; index < 3; index++) {
				var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
				instance.position = new BABYLON.Vector3((index - 1.5) * 3 , 0, 29);
				instance.setEnabled(true);
				instance.getChildMeshes().forEach(child => {
					child.checkCollisions = true;
				});
			}
		})

		/**************************for tower**************************/
		const resTower = await ImportMeshAsync("/asset/environements/Models/GLBformat/tower-complete-large.glb", this._scene).then(function(resTower) {
			var mesh: BABYLON.AbstractMesh = resTower.meshes[0];
			mesh.setEnabled(false);
			var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
			instance.position = new BABYLON.Vector3(8, 0, 30);
			instance.rotation = new BABYLON.Vector3(0, 0, 0);
			instance.scaling.scaleInPlace(2);
			instance.setEnabled(true);
			instance.getChildMeshes().forEach(child => {
				child.checkCollisions = true;
			});
		});

		/**************************for chest**************************/
		this._chest = new BABYLON.TransformNode("chest", this._scene);
		const resChest = await ImportMeshAsync("/asset/environements/Models/GLBformat/chest.glb", this._scene)
		var mesh: BABYLON.AbstractMesh = resChest.meshes[0];
		mesh.setEnabled(false);
		var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
		instance.parent = this._chest;
		instance.position = new BABYLON.Vector3(35, 0, 15);
		instance.rotation = new BABYLON.Vector3(0, 0, 0);
		instance.scaling.scaleInPlace(3);
		instance.setEnabled(true);
		instance.getChildMeshes().forEach(child => {
			child.checkCollisions = true;
		});

		/**************************for flag**************************/
		const resflag = await ImportMeshAsync("/asset/environements/Models/GLBformat/flag-pirate-pennant.glb", this._scene).then(function (resflag) {
			var mesh: BABYLON.AbstractMesh = resflag.meshes[0];
			mesh.setEnabled(false);
			var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
			instance.position = new BABYLON.Vector3(35, 0, 20);
			instance.rotation = new BABYLON.Vector3(0, 0, 0);
			instance.scaling.scaleInPlace(3);
			instance.setEnabled(true);
			instance.getChildMeshes().forEach(child => {
				child.checkCollisions = true;
			});
		})

		/**************************for barrel**************************/
		const resbarrel = await ImportMeshAsync("/asset/environements/Models/GLBformat/barrel.glb", this._scene).then(function(resbarrel) {
			var mesh: BABYLON.AbstractMesh = resbarrel.meshes[0];
			mesh.setEnabled(false);
			var instance = mesh.instantiateHierarchy() as BABYLON.TransformNode;
			instance.position = new BABYLON.Vector3(-20 ,0, 22);
			instance.rotation = new BABYLON.Vector3(0, -1, 0.1);
			instance.setEnabled(true);
			instance.scaling.scaleInPlace(2);
			instance.getChildMeshes().forEach(child => {
				child.checkCollisions = true;
			});
		});

		/**************************for sand castle**************************/
		this._sandcastle = new BABYLON.TransformNode("sandCastle", this._scene);
		const resSandCastle = await ImportMeshAsync("/assets/chateauSable.glb", this._scene)
		var mesh1: BABYLON.AbstractMesh = resSandCastle.meshes[0];
		mesh1.setEnabled(false);
		var instance = mesh1.instantiateHierarchy() as BABYLON.TransformNode;
		instance.parent = this._sandcastle;
		// instance.position = new BABYLON.Vector3(35, 0, 5);
		instance.scaling.scaleInPlace(0.2);
		instance.setEnabled(true);
		instance.getChildMeshes().forEach(child => {
			child.checkCollisions = true;
		});
		this.sandcastle.position =  new BABYLON.Vector3(35, 0, 5);
	}

	private _setUpMesh(result: BABYLON.ISceneLoaderAsyncResult, position: BABYLON.Vector3, scaling: number) {
		result.meshes.forEach(result => {
			result.position = position;// new BABYLON.Vector3(5, 0, 5);
			result.rotation = BABYLON.Vector3.Zero();
			result.rotation = BABYLON.Vector3.Zero();
			result.scaling.scaleInPlace(scaling);
		});
	}

	private	_addColision(mesh: BABYLON.Mesh) {
		console.log("mesh name : ", mesh.name);
		mesh.checkCollisions = true; // activation collision for player
		mesh.ellipsoid = new BABYLON.Vector3(0.7, 1.5, 0.7); // define collision arround player
		mesh.ellipsoidOffset = new BABYLON.Vector3(0, 1.5, 0); // center collision not necessary
	}

	get	playermesh():BABYLON.Mesh {
		if (!this._player)
			throw new Error("player asset not initialized");
		return this._player;
	}

	get LoadedMap(): Record<string, BABYLON.AbstractMesh> {
		if (!this._loadedMap)
			throw new Error("loadedMap asset not initialized");
		return this._loadedMap;
	}

	get	sandcastle(): BABYLON.TransformNode {
		if (!this._sandcastle)
			throw new Error("sandcastle asset not initialized");
		return this._sandcastle;
	}

	get chest(): BABYLON.TransformNode {
		if (!this._chest)
			throw new Error("chest asset not initialized");
		return this._chest;
	}
}