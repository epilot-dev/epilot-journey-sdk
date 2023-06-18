# EPilot Journey Custom Blocks

<details>
  <summary>Terminology</summary>
  <p>
    <strong>Journey Builder:</strong> is a tool for building flexible journeys using the 360 epilot tool <a href="https://portal.epilot.cloud/app/entity/journey">Journey Builder</a>.
  </p>
  <p>
    <strong>The configuring user:</strong> is a user of epilot 360 that has access to the tool <a href="https://portal.epilot.cloud/app/entity/journey">Journey Builder</a>.
  </p>
</details>

## What are "Custom" block?
epilot through the 360 tool Journey Builder providers nomurous amount of block which are easy to be used and provides a ui method to configure them. Despit that, the business case could be too special or too complex for a generic solution and a custom solution might be needed.

epilot journy allows developers to develope a custom solution that could be integrated to the journey as a block. This block will be able to recieve configuration like any other block, in a ddition it will be able to communicate back its data to the journey

## How to use the custom block?
as a configuring user, please head to the [Journey Builder](https://portal.epilot.cloud/app/entity/journey), and open the journey.
In the desired step, add a new custom block (as in the following GIF)

<img src="./doc_assets/adding-custom-block.gif" width="300px" />

## How custom block work?
In a general prospective, the epilot journey allows the user to add a wrapper block to it, this wrapper block will load a JS bundle which contains a web component. The weapper block will ensure that the bundle will be able to recieve configuration, data, error messages and sent data back.

Since the custom block wrapper is a journey block, the configuring user will be able to apply display and other logics like any block.

### How the custom block communicate with the journey?
The custom block wrapper expects the implementation to be a standard webcomponent. the wrapper will pass multiple props to the component. they are documented as typescript type as the following:
```typescript
type ControlledCustomBlockProps<T> = {
  setValue: React.Dispatch<T>
  value: T
  errors?: string
  required?: boolean
  args?: string
}
```

## How to configure the custom block?

Since the custom block is going to be implemented as a web component. you have to set the tag name and point to the bundle URL. The url can be a local url during developement or a deployed bundle.

<img src="./doc_assets/config-custom-block.png" width="300px" />

**Tip:** make sure to use an SSL secure bundle for production.

## How to pass extra arguments to the custom block?
It is mainly used in some cases, when the implementation of the block might need variables to be used that the configuration user would like to control (such as an API token, a subsciption id, extra URLs... etc)
In the block configurator, the configuring user can pass the data as key & value pairs in the UI. this is done by clicking on the button "Add an Option"

<img src="./doc_assets/adding-args.png" width="300px" />