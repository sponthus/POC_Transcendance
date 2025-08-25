/*****************************************************************export class for color management*****************************************************************/

import * as BABYLON from "@babylonjs/core";

export class Color {

	public _color: BABYLON.Color4;
	public _r: number;
	public _g: number;
	public _b: number;
	public _a: number;

	public constructor(r: number, g: number, b:number, a:number) {
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = a;

		this._color = new BABYLON.Color4(this._r / 255, this._g / 255, this._b / 255, this._a);
	}
	public _updateColor() {
		this._color = new BABYLON.Color4(this._r / 255, this._g / 255, this._b / 255, this._a);
	}
	public _color4ToCss(): string {
			const r = Math.round(this._r);
			const g = Math.round(this._g);
			const b = Math.round(this._b);
			const a = this._a;
			return `rgba(${r},${g},${b},${a})`;
	}
}