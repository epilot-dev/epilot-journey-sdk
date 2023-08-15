# Embed Script Examples
This directory includes 2 examples about data injection into epilot Journeys

**10-data-injection-init**
This example shows how to:
* Show the epilot Journey inline in a webpage
* Start the journey from step 2 (index 1) 
* Have the Journey loaded with disabled fields
* Have a product already added to the shopping cart

**11-data-injection-fullscreen**
This example is trying to demo how one can develop a custom landing page that will load products they are configured a journey, load their data, display it in custom cards.

Then clicking on a product card the Journey will open in full screen mode, it will start from a step that represents the start of the checkout process. In addition to that, it will have product already in the shopping cart.

Hints about this example:
* One advanced usage is having one of the products with variable pricing.
* The data passed to the journey is matching the structure of existing blocks!. The embeded journey actually have blocks in step 1 "consumption" and step 2 "products"
* Dinero library is used to calculate the price of the variable pricing because JS is bad with math. Think about: `parseInt("08"); // 0 if not support ECMAScript 5` or maybe `parseInt(1 / 1999999); // -> 5` ... [More fun here...](https://github.com/denysdovhan/wtfjs)

