# Journey Embed Script

epilot provides a script that can be used to embed epilot Journeys with more advanced features unleashing the full potential of them.

## Methods of using the embed script
### Basic
The Journey configuring user can generate a snipet of the embed script simply by using the embed configurator in the JB.

<img src="https://github.com/epilot-dev/epilot-journey-sdk/blob/main/doc_assets/embed-configurator.png?raw=true" width="300px" />

Read more about the basic usage of the embed script in [epilot's doc "Embedding Journeys"](https://docs.epilot.io/docs/journeys/embedding)

### Advanced
The embed script that is imported into any html webpage which provides utilities more than just opening a journey.

#### Journey Data Injection
Using the script, developers can manupilate the initial state of the journey. Such as setting initial data for it once it opens, disabling some fields, and starting the journey from a step other than the first.

The concept of the data injection is like having the end user filling some data in the container website (which is embed ing the journey). Then pass that data to the journey.

> The data passed to the journey must match the structure of existing blocks!.

There are multiple examples provided in the directory [here](examples/embed-script/README.md). They include more details about how one can achieve this.

## Typescript
The embed bundle is exporting a global variable `__epilot` which looks like the following
```
__epilot = {
    isInitialized: isInitialized,
    on: on,
    init: init,
    enterFullScreen: enterFullScreen,
    exitFullScreen: exitFullScreen,
}
```
Check [this file](src/embed_types/index.ts) to see the TS types. They are exported as part of the `@epilot/epilot-journey-sdk` package that is available on NPM.

