/*****************************************************************export class for input Controller*****************************************************************/

import "@babylonjs/core/Debug/debugLayer";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { renderAnimation } from "./animationCharacter";
import { renderAsset } from "../displaying/renderAsset";
import { dialogueBox } from "./dialogueBox";
import { renderScene } from "./renderScene";

export class PlayerInput {

	private _scene?: BABYLON.Scene;
	private _player?: BABYLON.Mesh;
	private _sandCastle? : BABYLON.TransformNode;
	private	_animation: renderAnimation
	private _previousAngle: number | null = null; //player angle state

	private _inGame: boolean;
	private _dialogue?: dialogueBox;
	private _inputMap: {[key: string]: boolean} = {}; //input keyboard map

	private _renderscene: renderScene;

	constructor (scene: BABYLON.Scene, assets: renderAsset, animation: renderAnimation, renderScene: renderScene) {
		this._scene = scene;
		this._player = assets.playermesh;
		this._sandCastle = assets.sandcastle;
		this._animation = animation;

		this._renderscene = renderScene;
		this._inGame = false;
		this._dialogue = new dialogueBox("press 'E' to play", scene) as dialogueBox;

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
			this._interactsandCastle();
		});
	}

	private _updateFromKeyboard() {
		if (!this._player)
		    return ;
		const speed = 0.2;
		let move = new BABYLON.Vector3(0, 0, 0);
		let direction = BABYLON.Vector3.Zero();
		if (this._inputMap['w'] || this._inputMap["arrowup"]) {
			direction.x += 1;
			move.z += speed;
		}
		if (this._inputMap['s'] || this._inputMap["arrowdown"]) {
			direction.x -= 1;
			move.z -= speed;
		}
		if (this._inputMap['a'] || this._inputMap["arrowleft"]) {
			direction.z += 1;
			move.x -= speed;
		}
		if (this._inputMap['d'] || this._inputMap["arrowright"]) {
			direction.z -= 1;
			move.x += speed;
		}
		if (direction.equals(BABYLON.Vector3.Zero())) {
			// this._walkAnimation?.stop();
			this._animation.stopWalk();
			return ;
		}
		else {
			this._animation.startWalk()
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

	private _interactsandCastle() {

		const proximityThreshold = 5;
		if (this._player && this._sandCastle)
		{
			const distance = BABYLON.Vector3.Distance(this._sandCastle.getAbsolutePosition(), this._player.position);
			// console.log("interation sand castle", distance);
			// console.log("pos sandcastle", this._sandCastle.getAbsolutePosition());
			if (distance < proximityThreshold && !this._dialogue?._isvisible() && !this._inGame) {
				this._dialogue!.showDialogue();
				console.log("showing dialogue", this._dialogue?._isvisible());
			}
			else if (distance > proximityThreshold && this._dialogue?._isvisible()) {
				this._dialogue!.hideDialogue();
			}
			if (this._dialogue?._isvisible()) {
				if (this._inputMap['e'] ||  this._inputMap['E']){
					console.log("launch Game");
					if (this._scene && this._scene.activeCamera) {
						console.log("pos active camera", this._scene.activeCamera.position);
						// do animation cameras or loading scene for transition
					}
					this._dialogue!.hideDialogue();
					this._inputMap['e'] = false;
					this._inputMap['E'] = false;
					this._inGame = true;
					this._renderscene.setState = 1;
				}
			}
		}
	}

	get	inputMap(): {[key: string]: boolean} {
		return this._inputMap;
	}
}