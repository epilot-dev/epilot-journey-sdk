import r2wc from "@r2wc/react-to-web-component";
import App from "./App";

const ThemingWC = r2wc(App, {
    props: {
        theme: 'json'
    }
});

customElements.define("using-theme", ThemingWC);
