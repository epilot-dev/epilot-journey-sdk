# Embed Script Examples

This directory contains examples for embedding and injecting data into epilot Journeys using HTML and JavaScript.

## data-injection-inline.html
Shows how to embed an epilot Journey inline on a webpage, with pre-filled data and some fields set to read-only.

Features:
- Loads a Journey in "inline" mode
- Starts at a specific step (configurable)
- Injects initial data (e.g., personal info, address)
- Demonstrates disabling blocks/fields

## data-injection-products-fullscreen.html
Demonstrates a custom page that fetches products from a Journey, displays them as cards, and injects the selected product data into the Journey in fullscreen mode.

Features:
- User enters consumption value
- Products are fetched and displayed as cards and as part of the website
- Clicking a product opens the Journey in fullscreen, pre-filling consumption and product selection

## Notes
- The examples use the official epilot embed script and [API tokens](https://docs.epilot.io/docs/auth/access-tokens). Replace with your own for production.
- See the HTML comments and code for further customization options

For more details on data injection and embedding, see the [epilot documentation](https://docs.epilot.io/docs/journeys/embedding#journey-data-injection).

