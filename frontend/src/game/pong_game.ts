import { BabylonSceneBuilder } from "../babylon/scene_maker";
import { DisplayAssets } from "../babylon/display_Assets";
import { GamePhysics } from "../babylon/game_Physics";

export class PongGame {
	private _sceneBuilder?: BabylonSceneBuilder;
	private _displayAssets?: DisplayAssets;
	private _gamePhysics?: GamePhysics;

	constructor() {}

	public async start(): Promise<void> {
		this.initializeSceneBuilder();

		this._displayAssets = new DisplayAssets(
			this._sceneBuilder!.scene,
			this._sceneBuilder!.paddle1.position,
			this._sceneBuilder!.paddle2.position
		);
		await this._displayAssets.load();
		
		this._gamePhysics = new GamePhysics(
			this._sceneBuilder!.wallLeft,
			this._sceneBuilder!.wallRight,
			this._sceneBuilder!.ball,
			this._sceneBuilder!.paddle1,
			this._sceneBuilder!.paddle2,
			this._sceneBuilder!.scene,
			this._sceneBuilder!.engine,
			this._displayAssets.crab1,
			this._displayAssets.crab2
		);
	}

	private initializeSceneBuilder(): void
	{
		const canvas = document.querySelector("canvas");
		if (canvas)
			this._sceneBuilder = new BabylonSceneBuilder(canvas);
		else
			console.error("Canvas not found!");
	}
}

