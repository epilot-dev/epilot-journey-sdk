import r2wc from "@r2wc/react-to-web-component";
import {RequiredBlock} from "./App";

const BlockAPP = r2wc(RequiredBlock, {
    props: {
        // the r2wc lib will parse the string value for us
        value: 'json',
        setValue: 'function',
        errors: 'string',
        required: 'boolean'
    }
})

customElements.define("required-errors-block", BlockAPP)