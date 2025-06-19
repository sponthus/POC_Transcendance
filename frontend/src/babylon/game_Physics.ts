import * as Babylon from "@babylonjs/core"

interface BallMesh extends Babylon.Mesh
{
	direction: Babylon.Vector3;
}

export class GamePhysics
{
	private _bounceCooldown = 0;
	private _wallLeft: Babylon.Mesh;
	private _wallRight: Babylon.Mesh;
	private _ball: BallMesh;
	private _paddle1: Babylon.Mesh;
	private _paddle2: Babylon.Mesh;
	private _scene: Babylon.Scene;
	private _engine: Babylon.Engine;

	constructor(wallLeft: Babylon.Mesh, wallRight: Babylon.Mesh,ball: BallMesh, paddle1: Babylon.Mesh, paddle2: Babylon.Mesh, scene: Babylon.Scene, engine: Babylon.Engine)
	{
		this._wallLeft = wallLeft;
		this._wallRight = wallRight;
		this._ball = ball;
		this._paddle1 = paddle1;
		this._paddle2 = paddle2;
		this._scene = scene;
		this._engine = engine;

		//Mouvement clavier joueur 1
		//deplacement paddle 1
		//deplacmeent paddle 2
		//move ball
		//collisions murs
		//collisions paddles
		//reset si la ball sort

// Mouvement clavier (joueur 1)
  const inputMap: Record<string, boolean> = {};
  scene.actionManager = new Babylon.ActionManager(scene);
  scene.actionManager.registerAction(new Babylon.ExecuteCodeAction(
  Babylon.ActionManager.OnKeyDownTrigger,
  evt => {
    inputMap[evt.sourceEvent.key.toLowerCase()] = true;
  }
));

scene.actionManager.registerAction(new Babylon.ExecuteCodeAction(
  Babylon.ActionManager.OnKeyUpTrigger,
  evt => {
    inputMap[evt.sourceEvent.key.toLowerCase()] = false;
  }
));

  scene.onBeforeRenderObservable.add(() => {
    const dt = this._engine.getDeltaTime() / 1000;

    // Déplacement paddle 1 (clavier A et D)
    if (inputMap["a"] && this._paddle1.position.x > -4.5) {
      this._paddle1.position.x -= 6 * dt;
    }
    if (inputMap["d"] && this._paddle1.position.x < 4.5) {
      this._paddle1.position.x += 6 * dt;
    }

    // Déplacement paddle 2 auto (IA débile)
    this._paddle2.position.x = ball.position.x;

    // Move ball
    this._ball.position.addInPlace(ball.direction);

	this._bounceCooldown -= dt;
    // Collisions murs
    if (this._bounceCooldown <= 0 && (this._ball.intersectsMesh(this._wallLeft, false) || this._ball.intersectsMesh(this._wallRight, false))) {
      this._ball.direction.x *= -1;
	  this._bounceCooldown = 0.1; // petit délai pour éviter rebond infini
    }

    // Collisions paddles
    if (this._bounceCooldown <= 0 && (this._ball.intersectsMesh(paddle1, false) || this._ball.intersectsMesh(this._paddle2, false))) {
      this._ball.direction.z *= -1;
	  this._bounceCooldown = 0.1;
    }

    // Reset si la balle sort
    if (Math.abs(this._ball.position.z) > 6) {
      this._ball.position = new Babylon.Vector3(0, 0.4, 0);
      this._ball.direction = new Babylon.Vector3(Math.random() * 0.2 - 0.1, 0, Math.random() > 0.5 ? 0.15 : -0.15);
    }
  });































		// this.initPhysics();
    	// this.initControls();
	}



	private initPhysics()
	{
    this._ball.direction = new Babylon.Vector3(0.1, 0.05, 0);

    this._scene.onBeforeRenderObservable.add(() => {
      this._ball.position.addInPlace(this._ball.direction);

      // Collisions haut/bas
	if (Math.abs(this._ball.position.y) > 4.5) {
        this._ball.direction.y *= -1;
		}

      // Collisions raquettes
      if (
        this._ball.intersectsMesh(this._paddle1, false) ||
        this._ball.intersectsMesh(this._paddle2, false)
      ) {
        this._ball.direction.x *= -1;
      }

      // Reset balle
      if (Math.abs(this._ball.position.x) > 7) {
        this._ball.position.set(0, 0, 0);
        this._ball.direction = new Babylon.Vector3(
          0.1 * (Math.random() > 0.5 ? 1 : -1),
          0.05,
          0
        );
      }
    });
  }

  private initControls() {
    const step = 0.3;
    window.addEventListener("keydown", (event) => {
      if (event.key === "w") this._paddle1.position.x += step;
      if (event.key === "s") this._paddle1.position.x -= step;
      if (event.key === "ArrowUp") this._paddle2.position.x += step;
      if (event.key === "ArrowDown") this._paddle2.position.x -= step;
    });
  }
}