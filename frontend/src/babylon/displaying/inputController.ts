/*****************************************************************export class for input Controller*****************************************************************/

import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { renderAnimation } from "./animationCharacter";

export class PlayerInput {

	private _scene?: BABYLON.Scene;
	private _player?: BABYLON.Mesh;
	private	_animation: renderAnimation
	private _previousAngle: number | null = null; //player angle state

	private _inputMap: {[key: string]: boolean} = {}; //input keyboard map

	constructor (scene: BABYLON.Scene, player: BABYLON.Mesh, animation: renderAnimation) {
		this._scene = scene;
		this._player = player;
		this._animation = animation;

		this._setInput();
	}

	private _setInput() {
		/**********************check event***********************/
		this._scene!.actionManager = new BABYLON.ActionManager(this._scene);
		this._scene!.actionManager.registerAction(
			new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, evt => {
				this._inputMap[evt.sourceEvent.key.toLowerCase()] = true; }));
		this._scene!.actionManager.registerAction(
			new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, evt => {
				this._inputMap[evt.sourceEvent.key.toLowerCase()] = false;
			}));
		this._scene?.onBeforeRenderObservable.add(() => {
			this._updateFromKeyboard();
		});
	}

	private _updateFromKeyboard() {
		if (!this._player)
		    return ;
		const speed = 0.1;
		let move = new BABYLON.Vector3(0, 0, 0);
		let direction = BABYLON.Vector3.Zero();
		if (this._inputMap['w'] || this._inputMap["arrowup"]) {
			direction.x += 1;
			direction.z += 1;
			console.log("touch z :");
			move.z += speed;
			move.x -= speed;
		}
		if (this._inputMap['s'] || this._inputMap["arrowdown"]) {
			direction.x -= 1;
			direction.z -= 1;
			console.log("touch s:");
			move.z -= speed;
			move.x += speed;
		}
		if (this._inputMap['a'] || this._inputMap["arrowleft"]) {
			direction.z += 1;
			direction.x -= 1;
			console.log("touch q:");
			move.x -= speed;
			move.z -= speed;
		}
		if (this._inputMap['d'] || this._inputMap["arrowright"]) {
			direction.x += 1;
			direction.z -= 1;
			console.log("touch d :");
			move.z += speed;
			move.x += speed;
		}
		if (direction.equals(BABYLON.Vector3.Zero())) {
			// this._walkAnimation?.stop();
			this._animation.stopWalk();
			return ;
		}
		else {
			this._animation.startWalk()
			// this._walkAnimation?.start(true, 1.0, this._walkAnimation.from, this._walkAnimation.to, false);
			direction = direction.normalize();
			const gravity = this._scene!.gravity;
			move = move.add(gravity);
			this._player.moveWithCollisions(move);
			const angle = Math.atan2(direction.x, direction.z);
			const correctionAngle = Math.PI / 2;
			const finalAngle = angle + correctionAngle;
			if (this._previousAngle == null || Math.abs(finalAngle - this._previousAngle) > 0.1) {
				this._player.rotation.y = finalAngle;
				this._previousAngle = finalAngle;
			}
		}
	}
	get	inputMap(): {[key: string]: boolean} {
		return this._inputMap;
	}
}