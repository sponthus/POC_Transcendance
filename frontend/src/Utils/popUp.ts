import { className } from "@babylonjs/core";

export class popUp{
	private _Overlay: HTMLElement;
	private _Body: HTMLElement;
	private _Title: HTMLElement;

	public constructor(Title: string) {
		this._Overlay = document.createElement('div');
		this._Overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

		this._Body = document.createElement('div');
		this._Body.className = 'bg-white rounded-xl shadow-xl p-6 w-80';

		this._Title = document.createElement('h2');
		this._Title.className = 'text-lg font-bold mb-4';
		this._Title.textContent =  Title;
		this._Body.appendChild(this._Title);

		this._Overlay.appendChild(this._Body);
	}

	public cleanBody() {
		Array.from(this._Body.children).forEach((child, index)=>{
			if (index == 0)
				return ;
			child.remove();
		})
	}

	public changeBodyClass(ClassName: string) {
		this._Body.className = ClassName;
	}

	public appendToBody(content: any) {
		this._Body.appendChild(content);
	}

	public addOverlayToWindow() {
		document.body.appendChild(this._Overlay);
	}

	public removeOverlayToWindow() {
		document.body.removeChild(this._Overlay);
	}

	public changeTitleText(Title: string) {
		this._Title.textContent = Title;
	}

	public changeTitleClass(ClassName: string) {
		this._Title.className = ClassName;
	}

	
}