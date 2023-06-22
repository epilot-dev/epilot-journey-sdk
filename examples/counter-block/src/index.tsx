import r2wc from "@r2wc/react-to-web-component";
import App from "./App";
import * as ReactDom from "react-dom";

class StandaloneComponent extends HTMLElement {
    mountPoint!: HTMLSpanElement;
    name!: string;

    connectedCallback() {
        const mountPoint = document.createElement("span");
        this.attachShadow({ mode: "open" }).appendChild(mountPoint);

        const name = this.getAttribute("name");
        if (name) {
            ReactDom.render(<App {...{} as any} />, mountPoint);
        } else {
            console.error("You must declare a name!");
        }
    }
}
export default StandaloneComponent;

window.customElements.get("counter-block") ||
    window.customElements.define("counter-block", StandaloneComponent);
