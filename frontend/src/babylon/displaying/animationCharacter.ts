/*****************************************************************export class for anim character*****************************************************************/

import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export class renderAnimation {

	private _scene: BABYLON.Scene;

	/****************for animation player**************/
	private _walkAnimation: BABYLON.AnimationGroup | null = null;
	private _idleAnimation: BABYLON.AnimationGroup | null = null;

	constructor (scene: BABYLON.Scene) {
		this._scene = scene;

		this._walkAnimation = this._scene?.getAnimationGroupByName("walk");
		if (!this._walkAnimation)
			console.log("failed to load walk animation")
		this._idleAnimation = this._scene?.getAnimationGroupByName("idle");
		if (!this._idleAnimation)
			console.log("failed to load idle animation")
	}
	startWalk() {
		this._walkAnimation?.start(true, 1.0, this._walkAnimation.from, this._walkAnimation.to, false);
	}
	stopWalk() {
		this._walkAnimation?.stop();
	}
	startidle() {
		this._idleAnimation?.start(true, 0.5, this._idleAnimation.from, this._idleAnimation.to, false);
	}
	stopidle() {
		this._idleAnimation?.stop();
	}
	get walkAnimation(): BABYLON.AnimationGroup | null {
		return this._walkAnimation;
	}
	get idleAnimation(): BABYLON.AnimationGroup | null  {
		return this._idleAnimation;
	}
}