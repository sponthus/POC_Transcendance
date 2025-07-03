import * as Babylon from "@babylonjs/core";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF";

export class DisplayAssets {
	private _scene: Babylon.Scene;
	private _posPaddle1: Babylon.Vector3;
	private _posPaddle2: Babylon.Vector3;
	private _crab1: Babylon.AbstractMesh | null = null;
	private _crab2: Babylon.AbstractMesh | null = null;
	private _caste: Babylon.AbstractMesh | null = null;

	constructor(scene: Babylon.Scene, posPaddle1: Babylon.Vector3, posPaddle2: Babylon.Vector3) {
		this._scene = scene;
		this._posPaddle1 = posPaddle1;
		this._posPaddle2 = posPaddle2;
	}

	public async load(): Promise<void>
	{
		const result = await ImportMeshAsync("/assets/crabSamourail.glb", this._scene);
		this._crab1 = result.meshes[0];
		this._crab1.position = this._posPaddle1.clone(); // on clone pour éviter les effets de bord
		this._crab1.scaling = new Babylon.Vector3(0.22, 0.22, 0.22);
		this._crab1.rotation = new Babylon.Vector3(0, 0, 0);

		const result2 = await ImportMeshAsync("/assets/crabKing.glb", this._scene);
		this._crab2 = result2.meshes[0];
		this._crab2.position = this._posPaddle2.clone(); // on clone pour éviter les effets de bord
		this._crab2.scaling = new Babylon.Vector3(0.22, 0.22, 0.22);
		this._crab2.rotation = new Babylon.Vector3(0, 3.14, 0);

		const result3 = await ImportMeshAsync("/assets/chateauSable.glb", this._scene);
		this._caste = result3.meshes[0];
		this._caste.position = new Babylon.Vector3(0, -2, 0);

		this._caste.freezeWorldMatrix(); // plus de recalculs de position/rotation/scale
		this._caste.doNotSyncBoundingInfo = true; // plus de bounding box à recalculer
		this._caste.isPickable = false; // si t'as pas besoin de clic dessus
		this._caste.receiveShadows = false; // si pas de shadow nécessaire
	}


	public get crab1(): Babylon.AbstractMesh | null
	{
		return this._crab1;
	}

	public get crab2(): Babylon.AbstractMesh | null
	{
		return this._crab2;
	}
	
}

