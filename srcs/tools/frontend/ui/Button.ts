export class Button {
	private text: string;
	private onClick: () => void;
  
	constructor(text: string, onClick: () => void) {
	  this.text = text;
	  this.onClick = onClick;
	}
  
	render(): HTMLElement {
	  const button = document.createElement("button");
	  button.innerText = this.text;
	  button.onclick = this.onClick;
	  return button;
	}
  }
  