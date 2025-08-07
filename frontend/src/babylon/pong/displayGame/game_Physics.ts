import { Scene, Engine, Mesh, AbstractMesh, Vector3, ActionManager, ExecuteCodeAction } from "@babylonjs/core";
import { spawnImpactFX} from "./impactFX";
import { spawnExplosionFX } from "./impactFX";
import { crabmehamehaFX } from "./impactFX";
import { Score } from "./score";

interface BallMesh extends Mesh {
	direction: Vector3;
	speed: number;
}

export class GamePhysics {
	private _dt = 0.01666;
	private _gameMode = 0; // 1 = bot, autre = qq1                                 a mettre dans constructeur
	private _gameOption = 1; // // 0 pong classique, 1 crabmeha, 2 4x4, 3 les 2    a mettre dans constructeur
	private _ball: BallMesh;
	private _scene: Scene;
	private _engine: Engine;
	private _crab1: AbstractMesh | null;
	private _crab2: AbstractMesh | null;

	private _score!: Score;
	private _scoreValue1 = 0;
	private _scoreValue2 = 0;

	private _timeBobSpeak = 5;
	private _timeout = 5;

	private _spell1!: Vector3;
	private _spell2!: Vector3;

	private _serverState: any = null;

	constructor(
		ball: BallMesh,
		scene: Scene,
		engine: Engine,
		crab1: AbstractMesh | null,
		crab2: AbstractMesh | null
	) {
		this._ball = ball;
		this._scene = scene;
		this._engine = engine;
		this._crab1 = crab1;
		this._crab2 = crab2;
		
		this._score = new Score(this._scene, this._scoreValue1, this._scoreValue2);

		this._ball.speed = 0;
		this.setupControls();
	}

	private setupControls()
	{
		const	playerId = "player1"; // prompt("t ki ? player1 ou player2 ?") || "player1";
		const	gameOption = 1; 
		const	inputMap: Record<string, boolean> = {};
		const	socket = new WebSocket("ws://localhost:4000");
		//const	socket = new WebSocket("ws://192.168.1.30:8080");

		this._scene.actionManager = new ActionManager(this._scene);

		this._scene.actionManager.registerAction(
			new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, evt => {
				inputMap[evt.sourceEvent.key.toLowerCase()] = true;
			})
		);

		this._scene.actionManager.registerAction(
			new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, evt => {
				inputMap[evt.sourceEvent.key.toLowerCase()] = false;
			})
		);
		socket.onopen = () => {
			console.log("🟢 WebSocket connectée");
			socket.send(JSON.stringify({
				type: "gameMode",
				playerId: playerId,
				mode: this._gameMode,
				option: this._gameOption
			}));
				// envoie les inputs au serveur
			setInterval(() => {
				socket.send(JSON.stringify({ // traduire en JSON
					type: "input",
					playerId: playerId, // fixe pour test, à améliorer plus tard
					input: inputMap
				}));
			}, 33); // 30fps
		}
		socket.onerror = (e) => console.error("❌ WS error", e);
		socket.onclose = () => console.warn("🟠 WS fermée");
		// stocke l’état serveur
		socket.onmessage = (event) => {
			const data = JSON.parse(event.data); // Traduire en variable
			if (data.type === "stateUpdate")
			{
				this._serverState = data.gameState;
				this.updateFrontend();
			}
		};
	}

	private updateFrontend()
	{
		//  Si y’a un état reçu du serveur
		if (this._serverState)
		{
			this._ball.position.x = this._serverState.ball.x;
			this._ball.position.z = this._serverState.ball.z;

			if (this._crab1)
			{
				const targetPaddle1Pos = new Vector3(
				this._serverState.paddle1.x,
				this._crab1.position.y,
				this._crab1.position.z
				);
				this._crab1.position = Vector3.Lerp(this._crab1.position, targetPaddle1Pos, 0.3);

				if (this._serverState.die1 === true)
				{
					spawnExplosionFX(this._scene, this._crab1.position);
					this._crab1.position.y = -4;
				}
				else
					this._crab1.position.y = 0;
			}
			if (this._crab2)
			{
				const targetPaddle2Pos = new Vector3(
				this._serverState.paddle2.x,
				this._crab2.position.y,
				this._crab2.position.z
				);
				this._crab2.position = Vector3.Lerp(this._crab2.position, targetPaddle2Pos, 0.3);
				if (this._serverState.die2 === true)
				{
					spawnExplosionFX(this._scene, this._crab2.position);
					this._crab2.position.y = -4;
				}
				else
					this._crab2.position.y = 0;
			}
			this._timeBobSpeak -= this._dt;
			if (this._timeBobSpeak < 0)
			{
				this._timeBobSpeak = 5;
				this._score._drawSpeak();
			}
			if (this._scoreValue1 < this._serverState.score.s1 || this._scoreValue2 < this._serverState.score.s2)
			{
				this._scoreValue1 = this._serverState.score.s1;
				this._scoreValue2 = this._serverState.score.s2;
				this._score.updateScore(this._scoreValue1, this._scoreValue2);
				this._timeBobSpeak = 10;
			}
			this._spell1 = new Vector3(this._serverState.spell1.x , 1, this._serverState.spell1.z);
			if (this._spell1.z > -9 || (this._spell1.z < -9 && this._serverState.specialCooldown1 < 0))
				crabmehamehaFX(this._scene, this._spell1);
			this._spell2 = new Vector3(this._serverState.spell2.x , 1, this._serverState.spell2.z);
			if (this._spell2.z < 9 || (this._spell2.z > 9 && this._serverState.specialCooldown2 < 0))
				crabmehamehaFX(this._scene, this._spell2);

		}
	}
}