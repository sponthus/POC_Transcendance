import { BabylonSceneBuilder } from "../babylon/scene_maker";
import { GamePhysics } from "../babylon/game_Physics";

export class PongGame
{
	private _sceneBuilder?: BabylonSceneBuilder;
	private _gamePhysics?: GamePhysics;

	constructor()
	{
		this.initializeSceneBuilder();
		this.initializeGamePhysics();
	}
    
	private initializeSceneBuilder(): void
	{
		const canvas = document.querySelector("canvas");

		if (canvas)
			this._sceneBuilder = new BabylonSceneBuilder(canvas);
		else
			console.error("Canvas not found!");
	}

	private initializeGamePhysics()
	{
		if (!this._sceneBuilder)
			return;
		this._gamePhysics = new GamePhysics(
			this._sceneBuilder.wallLeft,
			this._sceneBuilder.wallRight,
			this._sceneBuilder.ball,
			this._sceneBuilder.paddle1,
			this._sceneBuilder.paddle2,
			this._sceneBuilder.scene,
			this._sceneBuilder.engine
		);
	}
}
