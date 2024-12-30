# Calendly epilot journey block

This block is developed using Vite + React + TypeScript.

The goal of the block is to enable the epilot journey visitor to schedule a meeting in a provided calendly link.

## How to use

<img src="https://github.com/epilot-dev/epilot-journey-sdk/blob/main/examples/custom-block/calendly-block/docs/assets/configurator.png?raw=true" width="300px" />

In any epilot journey, add a new **Custom API & SDK Block** to any step.

For the **Tag Name** use `calendly-block`. It could be changed in the `main.tsx` file.

In the block configuration, set the **Bundle URL** to the URL of the deployed block. (When running the bundle locally `http://127.0.0.1:8080/assets/index.js` can be used).

This block requires 2 arguments to be passed to it to work:
1. `url`: The URL of the calendly link. This url is found on each event calender. The events could be [found here](https://calendly.com/event_types/user/me). If you have existing Events, then for each one a button called `Copy link` is available.

<img src="https://github.com/epilot-dev/epilot-journey-sdk/blob/main/examples/custom-block/calendly-block/docs/assets/calendly_events.png?raw=true" width="300px" />

2. `token`: The Calendly API personal access token. More info about how to make such API key is available [here](https://developer.calendly.com/how-to-authenticate-with-personal-access-tokens).



## Development
To run the block locally, run the following commands:
```bash
npm install
npm run dev
```

This would keep biulding the block for any changes made to the source code. Additonally it would serve the bundle using a simple http server.

> Note: running the project with the command Vite will start a development server but it will show an empty page as the block is missing configuration and the journey is not capable of loading a single bundle.

## Deployment for Production
Coming soon...