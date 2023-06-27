import r2wc from "@r2wc/react-to-web-component";
import App from "./App";

const CounterAPP = r2wc(App, {
    props: {
        // the r2wc lib will parse the string value for us
        value: 'json',
        setValue: 'function',
        errors: 'boolean',
        required: 'boolean',
        // the r2wc lib will parse the string value for us
        theme: 'json'
    }
})

customElements.define("counter-block", CounterAPP)