# Theming a block

This is a very simple block that demos how to use the theme object, it is built using React and [React to Web Component](https://github.com/bitovi/react-to-web-component)

```
npm install --force
npm start
```

## Getting Started

Configure your custom block in the Journey Builder for local development:

<img src="./custom-block-config.png" width="300px" />

Point Bundle URL to `http://localhost:3000/static/js/bundle.js` and use the Tag name `using-theme` as configured in `./src/index.tsx`

## How this example works?
notice the changes to the props in the index.tsx file, where we are checking for the theme object coming from the journey.

at the same time, in the App.tsx we are now using the theme object from the props.

epilot uses the material ui theme object to theme the journey.