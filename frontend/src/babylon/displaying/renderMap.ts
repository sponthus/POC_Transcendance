/*****************************************************************export class for render map*****************************************************************/
import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export class renderMap {

	private _loadedMap?: Record<string, BABYLON.AbstractMesh>;
	private _scene?: BABYLON.Scene;


	private     _map: BABYLON.TransformNode;

	private _mapLayout: number[] = [
			0, 0, 0, 0, 0, 0, 0, 0, 6, 6,
			0, 1, 2, 2, 0, 0, 0, 0, 6, 6,
			1, 3, 4, 1, 2, 1, 2, 7, 7, 7,
			3, 1, 1, 2, 1, 2, 2, 3, 6, 6,
			4, 1, 2, 2, 1, 2, 2, 3, 7, 7,
			0, 0, 2, 3, 2, 2, 3, 6, 6, 6,
			1, 3, 1, 3, 7, 8, 2, 7, 7, 7,
			1, 1, 1, 6, 9, 8, 8, 7, 7, 7,
			1, 1, 8, 6, 7, 9, 8, 0, 0, 0,
			0, 0, 0, 0, 7, 8, 8, 0, 0, 0 ];

	constructor(scene: BABYLON.Scene, loadedMap: Record<string, BABYLON.AbstractMesh> ) {
		this._loadedMap = loadedMap;
		this._scene = scene;

		this._map =  new BABYLON.TransformNode("map", this._scene);
		this._rederingMap();
	}
	private async _rederingMap(): Promise<void> {
		const titleSize: number = 2;
		
		const scalingFactor = 2.5;

		const gridWidth: number = Math.sqrt(this._mapLayout.length); // map has to be square
		const gridHeigt: number = gridWidth;
		for (let z:number = 0; z < gridWidth; z++) {
			for (let x: number = 0; x < gridHeigt; x++) {
				const index: number = z * gridWidth + x;
				if (this._mapLayout[index] != 0) {
					let titleid: number = this._mapLayout[index];
					const template = this._loadedMap![titleid.toString()] as BABYLON.AbstractMesh;
					if (!template) {
						console.log("template cannot charge");
						continue ; }
					const instance = template.instantiateHierarchy() as   BABYLON.TransformNode;
					instance.parent = this._map;
					instance.position.set(x * titleSize , 0, z * titleSize );
					instance.setEnabled(true);
					instance.scaling.scaleInPlace(scalingFactor);
					instance.scaling.scaleInPlace(0.03);
					instance.getChildMeshes().forEach(child => {
						child.computeWorldMatrix(true);
						child.refreshBoundingInfo({});
						child.checkCollisions = true;
					});
				}
			}
		}
		this._map.scaling.scaleInPlace(scalingFactor);
		this._map.position = new BABYLON.Vector3(-15, -1, -15);
	}

	get map():  BABYLON.TransformNode {
		if (!this._map)
			throw new Error("map not initialized");
		return this._map;
	}
}

