// Pop-up for errors, end of game, welcome ...

export class Modal {
	private message: string;
	private onClose: () => void;
  
	constructor(message: string, onClose: () => void) {
	  this.message = message;
	  this.onClose = onClose;
	}
  
	render(): HTMLElement {
	  const modal = document.createElement("div");
	  modal.className = "modal";
	  modal.innerHTML = `<p>${this.message}</p>`;
  
	  const closeButton = document.createElement("button");
	  closeButton.innerText = "OK";
	  closeButton.onclick = this.onClose;
  
	  modal.appendChild(closeButton);
	  return modal;
	}
  }
  