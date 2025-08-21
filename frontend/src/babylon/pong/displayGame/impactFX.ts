import * as Babylon from "@babylonjs/core";

export function spawnImpactFX(scene: Babylon.Scene, position: Babylon.Vector3)
{
    const texture = new Babylon.Texture(
    	"https://www.babylonjs-playground.com/textures/flare.png",
    	scene);

	const particleSystem = new Babylon.ParticleSystem("particles", 20, scene);

	particleSystem.particleTexture = texture;
	particleSystem.emitter = position.clone();

	particleSystem.minEmitBox = new Babylon.Vector3(0, 0, 0);
	particleSystem.maxEmitBox = new Babylon.Vector3(0, 0, 0);

	particleSystem.color1 = new Babylon.Color4(1, 1, 1, 1);
	particleSystem.color2 = new Babylon.Color4(1, 0.8, 0.2, 1);
	particleSystem.colorDead = new Babylon.Color4(1, 0, 0, 0);

	particleSystem.minSize = 0.05;
	particleSystem.maxSize = 0.1;

	particleSystem.minLifeTime = 0.2;
	particleSystem.maxLifeTime = 0.4;

	particleSystem.emitRate = 100;
	particleSystem.direction1 = new Babylon.Vector3(-1, -1, -1);
	particleSystem.direction2 = new Babylon.Vector3(1, 1, 1);

	particleSystem.minEmitPower = 2;
	particleSystem.maxEmitPower = 5;
	particleSystem.updateSpeed = 0.02;

	particleSystem.start();

	setTimeout(() => {
		particleSystem.stop();
		particleSystem.dispose();
	}, 500);
}

export function spawnExplosionFX(scene: Babylon.Scene, position: Babylon.Vector3)
{
    const particleSystem = new Babylon.ParticleSystem("explosion", 200, scene);

    // Texture de particule
    particleSystem.particleTexture = new Babylon.Texture("https://playground.babylonjs.com/textures/flare.png", scene);

    // Position
    particleSystem.emitter = position.clone();

    // Taille des particules
    particleSystem.minSize = 0.3;
    particleSystem.maxSize = 0.6;

    // Durée de vie
    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 0.6;

    // Vitesse
    particleSystem.emitRate = 500;

    // Direction et random
    particleSystem.direction1 = new Babylon.Vector3(1, 1, 1);
    particleSystem.direction2 = new Babylon.Vector3(-1, -1, -1);

    // Gravité (optionnel)
   // particleSystem.gravity = new Babylon.Vector3(0, -9.81, 0);

    // Puissance
    particleSystem.minEmitPower = 5;
    particleSystem.maxEmitPower = 10;
    particleSystem.updateSpeed = 0.01;

    // Lance
    particleSystem.start();

    // Le tue après 1 sec
    setTimeout(() => {
        particleSystem.stop();
        particleSystem.dispose();
    }, 1000);
}

export function crabmehamehaFX(scene: Babylon.Scene, position: Babylon.Vector3)
{
    const texture = new Babylon.Texture(
    	"https://www.babylonjs-playground.com/textures/flare.png",
    	scene);

	const particleSystem = new Babylon.ParticleSystem("crabmeha", 10, scene);

	particleSystem.particleTexture = texture;
	particleSystem.emitter = position.clone();

	particleSystem.minEmitBox = new Babylon.Vector3(0, 0, 0);
	particleSystem.maxEmitBox = new Babylon.Vector3(0, 0, 0);

	particleSystem.color1 = new Babylon.Color4(0, 0.2, 0.9, 0);
	particleSystem.color2 = new Babylon.Color4(0, 0.2, 0.9, 0);
	particleSystem.colorDead = new Babylon.Color4(0, 0.2, 0.9, 0);

	// Taille des particules
    particleSystem.minSize = 0.3;
    particleSystem.maxSize = 0.6;

	particleSystem.minLifeTime = 0.2;
	particleSystem.maxLifeTime = 0.4;

	particleSystem.emitRate = 100;
	particleSystem.direction1 = new Babylon.Vector3(-1, -1, -1);
	particleSystem.direction2 = new Babylon.Vector3(1, 1, 1);

	particleSystem.minEmitPower = 2;
	particleSystem.maxEmitPower = 5;
	particleSystem.updateSpeed = 0.02;

	particleSystem.start();

	setTimeout(() => {
		particleSystem.stop();
		particleSystem.dispose();
	}, 100);
}

export function spellAvailableFX(scene: Babylon.Scene, position: Babylon.Vector3)
{
    const texture = new Babylon.Texture(
    	"https://www.babylonjs-playground.com/textures/flare.png",
    	scene);

	const particleSystem = new Babylon.ParticleSystem("spellAvailable", 10, scene);

	particleSystem.particleTexture = texture;
	particleSystem.emitter = position.clone();

	particleSystem.minEmitBox = new Babylon.Vector3(0, 0, 0);
	particleSystem.maxEmitBox = new Babylon.Vector3(0, 0, 0);

	particleSystem.color1 = new Babylon.Color4(0, 0.2, 0.9, 0);
	particleSystem.color2 = new Babylon.Color4(0, 0.2, 0.9, 0);
	particleSystem.colorDead = new Babylon.Color4(0, 0.2, 0.9, 0);

	// Taille des particules
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;

	particleSystem.minLifeTime = 0.2;
	particleSystem.maxLifeTime = 0.4;

	particleSystem.emitRate = 100;
	particleSystem.direction1 = new Babylon.Vector3(0, 1, 0);
	//particleSystem.direction2 = new Babylon.Vector3(1, 1, 1);

	particleSystem.minEmitPower = 2;
	particleSystem.maxEmitPower = 5;
	particleSystem.updateSpeed = 0.06;

	particleSystem.start();

	setTimeout(() => {
		particleSystem.stop();
		particleSystem.dispose();
	}, 100);
}
