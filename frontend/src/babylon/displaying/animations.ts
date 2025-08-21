/*****************************************************************export class for anim character*****************************************************************/

import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export class renderAnimation {

	private _scene: BABYLON.Scene;

	/****************for animation player**************/
	private _walkAnimation: BABYLON.AnimationGroup | null = null;
	private _idleAnimation: BABYLON.AnimationGroup | null = null;

	private _idleNpcAnimation: BABYLON.AnimationGroup | null = null;

	private _openChest: BABYLON.AnimationGroup | null = null;
	private _closeChest: BABYLON.AnimationGroup | null = null;

	constructor (scene: BABYLON.Scene) {
		this._scene = scene;

		this._walkAnimation = this._scene?.getAnimationGroupByName("walk");
		if (!this._walkAnimation)
			throw new Error("failed to load walk animation");
	
		this._idleAnimation = this._scene?.getAnimationGroupByName("idle");
		if (!this._idleAnimation)
			throw new Error("failed to load idle animation");
	
		this. _idleNpcAnimation = this._scene?.getAnimationGroupByName("npc_idle");
		if (!this._idleNpcAnimation)
			throw new Error("failed to load yes animation");
	
		this._openChest = this._scene?.getAnimationGroupByName("chest_open");
		if (!this._openChest)
			throw new Error("failed to load open animation");
	
		this.stopOpen();
		this._closeChest = this._scene?.getAnimationGroupByName("chest_close");
		if (!this._closeChest)
			throw new Error("failed to load close animation");
	}

	startWalk() {
		if (this._walkAnimation)
			this._walkAnimation.start(true, 1.0, this._walkAnimation.from, this._walkAnimation.to, false);
	}

	stopWalk() {
		if (this._walkAnimation)
			this._walkAnimation.stop();
	}

	startidle() {
		if (this._idleAnimation)
			this._idleAnimation.start(true, 0.5, this._idleAnimation.from, this._idleAnimation.to, false);
	}

	stopidle() {
		if (this._idleAnimation)
			this._idleAnimation.stop();
	}

	startidlenpc() {
		if (this._idleNpcAnimation)
			this._idleNpcAnimation.start(true, 0.5, this._idleNpcAnimation.from, this._idleNpcAnimation.to, false);
	}

	stopidlenpc() {
		if (this._idleNpcAnimation)
			this._idleNpcAnimation.stop();
	}

	startOpen() {
		console.log("start open");
		if (this._openChest)
			this._openChest.start(false, 1.0, this._openChest.from, this._openChest.to, false);
	}

	stopOpen() {
		if (this._openChest)
			this._openChest.stop();
	}

	startClose() {
		console.log("start close");
		if (this._closeChest)
			this._closeChest.start(false, 1.0, this._closeChest.from, this._closeChest.to, false);
	}

	stopClose() {
		if (this._closeChest)
			this._closeChest.stop();
	}

	get walkAnimation(): BABYLON.AnimationGroup | null {
		return this._walkAnimation;
	}

	get idleAnimation(): BABYLON.AnimationGroup | null  {
		return this._idleAnimation;
	}
}