export class DropDown {

	private DropDownDiv: HTMLElement;

	constructor(Option: string[], Id: string) {

		this.DropDownDiv = document.createElement('div') as HTMLElement;
		this.DropDownDiv.id = Id + "_div";

		const Label: HTMLLabelElement = document.createElement('label');
		Label.className = "bg-transparent";
		Label.htmlFor = Id + "_htmlfor";
		Label.id = Id + "_Label";

		const select: HTMLSelectElement = document.createElement('select');
		select.className = "bg-orange-300 hover:bg-orange-400  block w-full p-2  rounded text-center bg-transparent"
		select.id = Id + "_Select";

		Option.forEach(name => {
			const option = document.createElement('option');
			option.id = name + "_option"
			option.value = name;
			option.textContent = name;
			select.appendChild(option);
		})

		this.DropDownDiv.appendChild(Label);
		this.DropDownDiv.appendChild(select);

	}

	get	getDropdownDiv(): HTMLElement {
		return this.DropDownDiv;
	}
}