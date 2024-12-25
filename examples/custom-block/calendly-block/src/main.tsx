
import App from './App.tsx'
import r2wc from "@r2wc/react-to-web-component";

const WebApp = r2wc(App, {
  props: {
    value: 'string',
    errors: 'string',
    required: 'boolean',
    // the r2wc lib will parse the string value for us
    theme: 'json',
    args: 'json',
    setValue: 'function'
  }
})

customElements.define("calendly-block", WebApp);