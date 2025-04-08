export class Button {
    text;
    onClick;
    constructor(text, onClick) {
        this.text = text;
        this.onClick = onClick;
    }
    render() {
        const button = document.createElement("button");
        button.innerText = this.text;
        button.onclick = this.onClick;
        return button;
    }
}
