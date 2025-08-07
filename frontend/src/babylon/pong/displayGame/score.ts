import * as Babylon from "@babylonjs/core";
import { dialogueBox } from "../../displaying/dialogueBox";

export class Score {
	private _scene: Babylon.Scene;
	private _scorePlayer1: number;
	private _scorePlayer2: number;

	private _scorePlane: Babylon.Mesh;
	private _bobSpeak: Babylon.Mesh;
	private _dynamicTextureScore: Babylon.DynamicTexture;
	private _dynamicTextureSpeak: Babylon.DynamicTexture;
	private _materialScore: Babylon.StandardMaterial;
	private _materialSpeak: Babylon.StandardMaterial;


	constructor(scene: Babylon.Scene, scorePlayer1: number, scorePlayer2: number)
	{
		this._scene = scene;
		this._scorePlayer1 = scorePlayer1;
		this._scorePlayer2 = scorePlayer2;

		// === SCORE PLANE ===
		this._scorePlane = Babylon.MeshBuilder.CreatePlane("scorePlane", { width: 2, height: 1 }, this._scene);
		this._scorePlane.position = new Babylon.Vector3(8, 2, 2);
		this._scorePlane.billboardMode = Babylon.Mesh.BILLBOARDMODE_ALL;

		this._dynamicTextureScore = new Babylon.DynamicTexture("scoreTexture", { width: 512, height: 256 }, this._scene, false);
		this._dynamicTextureScore.hasAlpha = true;
		this._materialScore = new Babylon.StandardMaterial("scoreMat", this._scene);
		this._materialScore.diffuseTexture = this._dynamicTextureScore;
		this._materialScore.emissiveColor = new Babylon.Color3(1, 1, 1);
		this._materialScore.backFaceCulling = false;
		this._materialScore.transparencyMode = Babylon.Material.MATERIAL_ALPHABLEND;
		this._scorePlane.material = this._materialScore;

		// === BOB SPEAK PLANE ===
		this._bobSpeak = Babylon.MeshBuilder.CreatePlane("_bobSpeak", { width: 4, height: 1 }, this._scene);
		this._bobSpeak.position = new Babylon.Vector3(8, 2, -2);
		this._bobSpeak.billboardMode = Babylon.Mesh.BILLBOARDMODE_ALL;

		this._dynamicTextureSpeak = new Babylon.DynamicTexture("speakTexture", { width: 1024, height: 256 }, this._scene, false);
		this._dynamicTextureSpeak.hasAlpha = true;
		this._materialSpeak = new Babylon.StandardMaterial("speakMat", this._scene);
		this._materialSpeak.diffuseTexture = this._dynamicTextureSpeak;
		this._materialSpeak.emissiveColor = new Babylon.Color3(1, 1, 1);
		this._materialSpeak.backFaceCulling = false;
		this._materialSpeak.transparencyMode = Babylon.Material.MATERIAL_ALPHABLEND;
		this._bobSpeak.material = this._materialSpeak;

		// Dessine les textes
		// this._drawScore();
		// this._drawSpeak();

	}

	private _drawScore()
	{
		this._dynamicTextureScore.getContext().clearRect(0, 0, 512, 256);
		const text = `${this._scorePlayer1} - ${this._scorePlayer2}`;
		this._dynamicTextureScore.drawText(text, null, 140, "bold 80px Arial", "white", "transparent", true);
		this._dynamicTextureScore.update();
	}

	public _drawSpeak()
	{
		this._dynamicTextureSpeak.getContext().clearRect(0, 0, 1024, 256);
		const text = this._phrases[Math.floor(Math.random() * this._phrases.length)];
		this._dynamicTextureSpeak.drawText(text, null, 140, "bold 60px Arial", "white", "transparent", true);
		this._dynamicTextureSpeak.update();
	}



	private _bobGoal()
	{
		this._dynamicTextureSpeak.getContext().clearRect(0, 0, 1024, 256);
		const text = this._goalBob[Math.floor(Math.random() * this._goalBob.length)];
		console.log(text);
		this._dynamicTextureSpeak.drawText(text, null, 140, "bold 60px Arial", "white", "transparent", true);
		this._dynamicTextureSpeak.update();
	}

	public updateScore(score1: number, score2: number)
	{
		this._scorePlayer1 = score1;
		this._scorePlayer2 = score2;
		this._drawScore();
		this._bobGoal();
	}

	public dispose()
	{
		this._scorePlane.dispose();
		this._bobSpeak.dispose();
		this._materialScore.dispose();
		this._materialSpeak.dispose();
		this._dynamicTextureScore.dispose();
		this._dynamicTextureSpeak.dispose();
	}

	private _phrases: string[] = [
    "Il y a combien au score Patrick ?",
    "C’est moi ou il triche lui ?",
    "Passe la balle, cousin !",
    "On est là pour gagner hein !",
	"PATRIIICK !!!!",
	"Je suis un glouton Barjot !",
	"T'aurais pas vu Garry ?",
	"Le perdant finis en paté de crab !",
	"On se fait chier nan ?",
	"Crabméhaméha !!"
	];

	private _goalBob: string[] = [
    "Mamamilla, quel but !",
    "Oh my Godness!",
    "CHE PASSSSOOOOO !",
    "C'est du jamais vu !",
    "Starfullah !",
	"ROCRABDO !",
	"Et 1, ET 2, Et 3 ZERO !",
	"L'humiliation",
	"Aha, qu'il est mauvais !",
	"J'ai jamais vu ça",
	"T’as vu la balle ou pas ?"
	];
	
}

