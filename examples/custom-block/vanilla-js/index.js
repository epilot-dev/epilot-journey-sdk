

class VanillaJSComponent extends HTMLElement {
    static observedAttributes = ["errors", "args", "required", "setValue", "value", "theme"];

    constructor() {
        super();
    }

    render() {
        const args = this.args ? JSON.parse(this.args) : {};
        const theme = this.theme ? JSON.parse(this.theme) : {};
        const value = this.value ? JSON.parse(this.value) : {};
        const errors = this.errors
        const required = this.required

        const { count } = value

        this.innerHTML = `<p>Hi ${args.person}</p>
        <p>This component is ${required ? '' : 'not '}required</p>
        <p style="color: ${theme?.palette?.primary?.main}">Text in primary color</p>
        <p style="color: ${theme?.palette?.secondary?.main}">Text in secondary color</p>
        ${errors && `<p style="color: red;">This component has error</p>`}
        <div>
                <button id="minus">-</button>
                <span>${count || 0}</span>
                <button id="plus">+</button>
            </div>`;

        document.getElementById('minus').addEventListener('click', this.handle_click_minus.bind(this))
        document.getElementById('plus').addEventListener('click', this.handle_click_plus.bind(this))
    }

    handleChange(additionValue) {
        const value = this.value ? JSON.parse(this.value) : {};
        const { count = 0 } = value
        this.setValue(JSON.stringify({ count: count + additionValue }))
    }

    handle_click_minus(_e) {
        console.log('minus');
        this.handleChange(-1)
    }


    handle_click_plus(_e) {
        console.log('plus');
        this.handleChange(+1)
    }

    /**
     * Runs each time the element is appended to or moved in the DOM
     */
    connectedCallback() {
        console.log('connected!');

        this.render()
    }

    /**
     * Runs when the element is removed from the DOM
     */
    disconnectedCallback() {
        console.log('disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(
            `Attribute ${name} has changed from ${JSON.stringify(oldValue)} to ${JSON.stringify(newValue)}.`
        );
        this[name] = newValue
        this.render()


    }
}

// Define the new web component
if ('customElements' in window) {
    customElements.define('vanilla-js', VanillaJSComponent);
}