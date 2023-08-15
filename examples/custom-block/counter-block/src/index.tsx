import r2wc from "@r2wc/react-to-web-component";
import { CounterAPP } from "./App";

const CounterAPPWeb = r2wc(CounterAPP, {
    props: {
        value: 'string',
        errors: 'string',
        required: 'boolean',
        // the r2wc lib will parse the string value for us
        theme: 'json'
    }
})

customElements.define("counter-block", CounterAPPWeb);