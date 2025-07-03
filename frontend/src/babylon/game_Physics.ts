import * as Babylon from "@babylonjs/core";
import { spawnImpactFX } from "./impactFX";
import { spawnExplosionFX } from "./impactFX";
import { crabmehamehaFX } from "./impactFX";

interface BallMesh extends Babylon.Mesh {
	direction: Babylon.Vector3;
	speed: number;
}

export class GamePhysics {
	private _bounceCooldown = 0;
	private _valueBounceCooldown = 0.05;
	private _wallLeft: Babylon.Mesh;
	private _wallRight: Babylon.Mesh;
	private _ball: BallMesh;
	private _paddle1: Babylon.Mesh;
	private _paddle2: Babylon.Mesh;
	private _scene: Babylon.Scene;
	private _engine: Babylon.Engine;
	private _crab1: Babylon.AbstractMesh | null;
	private _crab2: Babylon.AbstractMesh | null;

	private _projectiles: Babylon.Mesh[] = [];
	private _specialCooldown = 0;
	private _specialCooldownDuration = 2.5;


	constructor(
		wallLeft: Babylon.Mesh,
		wallRight: Babylon.Mesh,
		ball: BallMesh,
		paddle1: Babylon.Mesh,
		paddle2: Babylon.Mesh,
		scene: Babylon.Scene,
		engine: Babylon.Engine,
		crab1: Babylon.AbstractMesh | null,
		crab2: Babylon.AbstractMesh | null
	) {
		this._wallLeft = wallLeft;
		this._wallRight = wallRight;
		this._ball = ball;
		this._paddle1 = paddle1;
		this._paddle2 = paddle2;
		this._scene = scene;
		this._engine = engine;
		this._crab1 = crab1;
		this._crab2 = crab2;

		this.setupControls();
	}

	private setupControls()
	{
		const inputMap: Record<string, boolean> = {};
		this._scene.actionManager = new Babylon.ActionManager(this._scene);

		this._scene.actionManager.registerAction(
			new Babylon.ExecuteCodeAction(Babylon.ActionManager.OnKeyDownTrigger, evt => {
				inputMap[evt.sourceEvent.key.toLowerCase()] = true;
			})
		);

		this._scene.actionManager.registerAction(
			new Babylon.ExecuteCodeAction(Babylon.ActionManager.OnKeyUpTrigger, evt => {
				inputMap[evt.sourceEvent.key.toLowerCase()] = false;
			})
		);

		this._scene.onBeforeRenderObservable.add(() => {
			const dt = this._engine.getDeltaTime() / 1000;

			// Déplacement joueur 1
			this.movePlayer1(inputMap, dt);

			// IA débile
			this._paddle2.position.x = this._ball.position.x;
			if (this._crab2)
				this._crab2.position.x = this._paddle2.position.x;
			// Bouge balle
			this._ball.position.addInPlace(this._ball.direction.scale(this._ball.speed * dt));

			this._bounceCooldown -= dt;

			// Collisions murs
			this.collisionWall();
			// Collisions paddles
			this.collisionPaddle();
			// Reset si balle sort
			this.resetBall();

			this.crabmehaha(inputMap);
			this.updateProjectiles(dt);
			if (this._specialCooldown > 0) {
        		this._specialCooldown -= dt;
    }
		});
	}

	private movePlayer1(inputMap: Record<string, boolean>, dt: number)
	{
		if (inputMap["a"] && this._paddle1.position.x > -4.5)
		{
			this._paddle1.position.x -= 10 * dt;
			if (this._crab1)
				this._crab1.position.x = this._paddle1.position.x;
		}
		if (inputMap["d"] && this._paddle1.position.x < 4.5)
		{
			this._paddle1.position.x += 10 * dt;
			if (this._crab1)
				this._crab1.position.x = this._paddle1.position.x;
		}
	}

	private collisionWall()
	{
		if (this._bounceCooldown <= 0 && this._ball.intersectsMesh(this._wallLeft, false))
		{
			this._ball.direction.x *= -1;
			this._ball.position.x = this._wallLeft.position.x + 0.6;
			this._bounceCooldown = this._valueBounceCooldown;
			spawnImpactFX(this._scene, this._ball.position);
		}
		if (this._bounceCooldown <= 0 && this._ball.intersectsMesh(this._wallRight, false))
		{
			this._ball.direction.x *= -1;
			this._ball.position.x = this._wallRight.position.x - 0.6;
			this._bounceCooldown = this._valueBounceCooldown;
			spawnImpactFX(this._scene, this._ball.position);
		}
	}

	private collisionPaddle()
	{
		if (this._bounceCooldown <= 0 &&
			(this._ball.intersectsMesh(this._paddle1, false) || this._ball.intersectsMesh(this._paddle2, false)))
		{
			const paddle = this._ball.intersectsMesh(this._paddle1, false) ? this._paddle1 : this._paddle2;
			// Position relative de l'impact (entre -1 et 1)
			const relativeImpact = (this._ball.position.x - paddle.position.x) / (paddle.scaling.x * 1.5);

			// Clamp entre -1 et 1
			const clampedImpact = Math.max(-1, Math.min(1, relativeImpact));

			// Nouvelle direction X basée sur le point d’impact (plus tu tapes vers les bords, plus l’angle est fort)
			const angleX = clampedImpact * 0.2; // 0.5 = angle max (ajuste à ta sauce)

			this._ball.direction.x = angleX;
			this._ball.direction.z *= -1;
			this._bounceCooldown = this._valueBounceCooldown;
			if (this._ball.speed < 200)
				this._ball.speed += 5;
			if (paddle === this._paddle1)
				this._ball.position.z = this._paddle1.position.z + 0.6;
			else
				this._ball.position.z = this._paddle2.position.z - 0.6;
			spawnImpactFX(this._scene, this._ball.position);
		}
	}

	private resetBall()
	{
		if (Math.abs(this._ball.position.z) > 6)
		{
			this._ball.speed = 90;
			this._ball.position = new Babylon.Vector3(0, 0.4, 0);
			this._ball.direction = new Babylon.Vector3(
				Math.random() * 0.2 - 0.1,
				0,
				Math.random() > 0.5 ? 0.15 : -0.15
			);
			if (this._crab2)
				this._crab2.position.y = 0.25;
			this._paddle2.position.y = 0.25;
			for (let i = this._projectiles.length - 1; i >= 0; i--)
			{
				this._projectiles[i].dispose();
				this._projectiles.splice(i, 1);
			}
		}
	}

	private crabmehaha(inputMap: Record<string, boolean>)
	{
		if (inputMap["k"] && this._specialCooldown <= 0)
		{
			this._specialCooldown = this._specialCooldownDuration - (this._ball.speed * 0.01);
			this.spawnProjectile();
			inputMap["k"] = false; //eviter le spam
		}
	}

	private spawnProjectile()
	{
		const projectile = Babylon.MeshBuilder.CreateSphere("projectile", { diameter: 0.3 }, this._scene);
		projectile.position = this._paddle1.position.clone();
		projectile.position.y = 0.4; // hauteur si besoin
		projectile.material = new Babylon.StandardMaterial("projMat", this._scene);
		(projectile.material as Babylon.StandardMaterial).diffuseColor = new Babylon.Color3(0.3, 0.8, 1);

		this._projectiles.push(projectile);
	}

	private updateProjectiles(dt: number)
	{
		const speed = 30;

		for (let i = this._projectiles.length - 1; i >= 0; i--)
		{
			const proj = this._projectiles[i];

			proj.position.z += speed * dt; // avance vers l'adversaire (vers le -Z)

			// Check si touche le paddle2
			if (proj.intersectsMesh(this._paddle2, false))
			{
				spawnExplosionFX(this._scene, this._paddle2.position);
				console.log("🔥 HIT !");
				if (this._crab2) {
					this._crab2.position.y = -4;
				}
				this._paddle2.position.y = -4;
				

				proj.dispose();
				this._projectiles.splice(i, 1);
				continue;
			}
			// Check si touche ball
			if (proj.intersectsMesh(this._ball, false))
			{
				proj.dispose();
				this._projectiles.splice(i, 1);
			}

			// Check si sort du terrain
			if (proj.position.z > 9)
			{
				proj.dispose();
				this._projectiles.splice(i, 1);
			}
			crabmehamehaFX(this._scene, proj.position);
		}
	}


}

