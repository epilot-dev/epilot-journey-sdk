# Required Block with Errors

This is an example about a block that gets data from the journeys and send data back, it is built using React and [React to Web Component](https://github.com/bitovi/react-to-web-component)

```
npm install --force
npm start
```

## How the app works?
The app is a react component exported as a standard web component, it will get the needed props of value and set value. it will pass around the value as an object
## Getting Started

Configure your custom block in the Journey Builder for local development:

<img src="./custom-block-config.png" width="300px" />

Point Bundle URL to `http://localhost:3000/static/js/bundle.js` and use the Tag name `required-errors-block` as configured in `./src/index.tsx`
