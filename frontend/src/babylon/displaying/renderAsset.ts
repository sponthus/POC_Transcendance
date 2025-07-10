/*****************************************************************export class for rendering assets*****************************************************************/

import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";

export class renderAsset {

	private _scene: BABYLON.Scene;
	private _player?: BABYLON.Mesh;
	// private	_map?: BABYLON.TransformNode;

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
		/******************************load player******************************/
		const result = await ImportMeshAsync("/asset/Characters/Models/GLBformat/character-q.glb", this._scene);
		if (result)
			console.log("Meshes Player import succesfully", result.meshes);
		this._setUpMesh(result, new BABYLON.Vector3(5, 0, 5), 1);
		this._player = result.meshes[0] as BABYLON.Mesh;
		if (!this._player)
			console.log("player not initialized:");
		this._addColision(this._player);

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
}