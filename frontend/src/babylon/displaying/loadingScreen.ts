/*****************************************************************export class for render scene*****************************************************************/

export class LoadingScreen {

	loadingUIBackgroundColor:string;
	loadingUIText;		
	private _canvas: HTMLCanvasElement;
	private _loadingDiv?: HTMLElement;

	constructor(canvas: HTMLCanvasElement) {
		this.loadingUIBackgroundColor = "black";
		this.loadingUIText = "loading ..."
		this._canvas = canvas;
	}

	displayLoadingUI() {
		
	}

	hideLoadingUI() {
		const element = document.getElementById("customLoadingScreenDiv")!.style.display = "none";
	}
}