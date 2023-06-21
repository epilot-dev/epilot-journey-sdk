import r2wc from "@r2wc/react-to-web-component";
import App from "./App";

const CounterBlock = r2wc(App, {
    // this is the initial props
    props: {
    }
});

customElements.define("counter-block", CounterBlock);
