(function () {
	function CreatePopUp(elem){
		try{
			var pue = document.createElement("bv-popup");
			pue.header = "";
			pue.content = "";
			pue.footer = "";
			if(elem.querySelector("[header]"))	pue.header = elem.querySelector("[header]").innerHTML;
			if(elem.querySelector("[content]"))	pue.content = elem.querySelector("[content]").innerHTML;
			if(elem.querySelector("[footer]"))	pue.footer = elem.querySelector("[footer]").innerHTML;
			return pue;
		}
		catch(error){
			console.error(error);
		}
	}
	function AddPopUp(put){
		try{
			var elements = document.querySelectorAll(put.applyTo);
			for (var i = elements.length - 1; i >= 0; i--) {
				var pue = CreatePopUp(put);
				help = "<bv-popup></bv-popup>"
				elements[i].innerHTML = help + elements[i].innerHTML;
				help = elements[i].querySelector("bv-popup");
				help.header = pue.header;
				help.content = pue.content;
				help.footer = pue.footer;
				elements[i].addEventListener("mouseenter", help.togglePopUp.bind(help));
				elements[i].addEventListener("mouseleave", help.togglePopUp.bind(help));
			}
		}
		catch(error){
			console.error(error);
		}
	}
	const template = document.createElement('template');
	template.innerHTML = `
		<style>
			.box{
				display: none;
				border-style: var(--border-style, solid);
				border-width:  var(--border-width, 2px);
				border-color: var(--border-color, black);
				font-family: var(--font-family);

				height: fit-content;
				box-sizing: border-box;
				position: absolute;
				top: 150%;
				left: 0%;
			}
			.box::before{
				content: "";
				position: absolute;
				bottom: 100%;
				left: 0%;
				width: 0; 
				height: 0; 
				border-left: calc(var(--border-width, 2px)*3.5) var(--border-style, solid) transparent;
				border-right: calc(var(--border-width, 2px)*3.5) var(--border-style, solid) transparent;
  
				border-bottom: calc(var(--border-width, 2px)*3.5) var(--border-style, solid) var(--border-color, black);
			}
			.header{
				background-color: var(--header-background-color, white);
				font-size: var(--header-font-size);
				font-style: var(--header-font-style);
				font-weight: var(--header-font-weight);
				color: var(--header-color);
				display: var(--header-display, flex);
				padding: var(--padding, 10px);

				border-bottom-style: var(--border-style, solid);
				border-bottom-width:  var(--border-width, 2px);
				border-bottom-color: var(--border-color, black);


				align-items: center;
				white-space: nowrap;
				box-sizing: border-box;
			}
			.content{
				background-color: var(--content-background-color, white);
				font-size: var(--content-font-size, 16px);
				font-style: var(--content-font-style);
				font-weight: var(--content-font-weight);
				color: var(--content-color);
				display: var(--content-display, flex);
				padding: var(--padding, 10px);

				align-items: center;
				white-space: nowrap;
				box-sizing: border-box;

			}
			.footer{
				background-color: var(--footer-background-color, white);
				font-size: var(--footer-font-size);
				font-style: var(--footer-font-style);
				font-weight: var(--footer-font-weight);
				color: var(--footer-color);
				display: var(--footer-display, flex);
				padding: var(--padding, 10px);

				border-top-style: var(--border-style, solid);
				border-top-width:  var(--border-width, 2px);
				border-top-color: var(--border-color, black);

				align-items: center;
				white-space: nowrap;
				box-sizing: border-box;
			}
			.show{
				display: block;
				animation-name: fade-in;
				animation-duration: 1s;
			}
			@keyframes fade-in{
				from{ opacity: 0; }
				to{ opacity: 1; }
			}
		</style>
		<div class="box" box>
			<div class="header" header>
			</div>
			<div class="content" content>
			</div>
			<div class="footer" footer>
			</div>
		</div>
	`;
	var style = `
		<style type="text/css">
			bv-popup{
				position: relative;
			}
			bv-popup-temp{
				display: none;
			}
		</style>
	`
	document.head.innerHTML = style + document.head.innerHTML;
	class PopUp extends HTMLElement{
		constructor(){
			super()

			this.attachShadow({ mode: 'open' });
			this.shadowRoot.appendChild(template.content.cloneNode(true));
			this.puBox = this.shadowRoot.querySelector(".box");
			this.puHeader = this.shadowRoot.querySelector(".header");
			this.puContent = this.shadowRoot.querySelector(".content");
			this.puFooter = this.shadowRoot.querySelector(".footer");
		}
		connectedCallback(){
		}
		static get observedAttributes(){
			return ['header', 'content', 'footer']
		}
		attributeChangedCallback(name, oldValue, newValue){
			switch(name){
				case 'header': this.puHeader.innerHTML = newValue;break;
				case 'content': this.puContent.innerHTML = newValue;break;
				case 'footer': this.puFooter.innerHTML = newValue;break;
				default: break;
			}
		}
		set header(newValue){
			this.setAttribute("header", newValue)
		}
		set content(newValue){
			this.setAttribute("content", newValue)
		}
		set footer(newValue){
			this.setAttribute("footer", newValue)
		}
		get header(){
			return this.getAttribute("header")
		}
		get content(){
			return this.getAttribute("content")
		}
		get footer(){
			return this.getAttribute("footer")
		}
		togglePopUp(){
			this.puBox.classList.toggle("show");
		}
		disconnectedCallback(){

		}
	}
	class PopUpTemp extends HTMLElement{
		constructor(){
			super()
		}
		connectedCallback(){
			window.addEventListener("load", this.#applyPopUps.bind(this))
		}
		static get observedAttributes(){
			return ['apply-to']
		}
		attributeChangedCallback(name, oldValue, newValue) {
			this.#removePopUps(oldValue);
			if(newValue != "" && newValue != undefined){
				this.#applyPopUps();
			}
		}
		set applyTo(newValue){
			this.setAttribute("apply-to", newValue)
		}
		get applyTo(){
			return this.getAttribute("apply-to")
		}
		disconnectedCallback(){

		}
		#applyPopUps(){
			AddPopUp(this);
		}
		#removePopUps(oldPopUp){
			try{
				var elements = document.querySelectorAll(oldPopUp);
				for(var i = 0;i < elements.length;i++){
					var pue = elements[i].querySelector("bv-popup");
					if(pue) elements[i].removeChild(pue);
				}
			}
			catch(error){

			}
		}
	}

	window.customElements.define('bv-popup', PopUp);
	window.customElements.define('bv-popup-temp', PopUpTemp);
}
)();