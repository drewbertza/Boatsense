# Boatsense
## A Shiplogic API client in (somewhat-JS-compatible) Google Apps Script for Google Workspace  
##### Based on [the docs](https://api-docs.Boatsense.com/)  
*[Shiplogic](https://www.shiplogic.com/) is Copyright © Bob Group. This project is in no way affiliated with Bob Group or their subsidiaries or partners. It's just one fan/user's attempt at making their awesome API more accessible to clients and users. To learn more about other ways of accessing a Shiplogic-associated portal, see the link above, or ask your couriers. If they don't use Shiplogic... well... shame.*


## Features

* User-friendly abstraction of API data properties:
   * Automatic conversion between internal `camelCase` keys and undercored `api_data_body_key_names`.
   * Abstraction of the `parcels` array to allow for more granular inventory management through logical handling of the optional `declared_value` and `description` properties for parcels.
* Documentation and Type-safety with JSDoc.
* A `shipmentBuilder` class.
* A `test` class full of dummy data for use in your tests.
* A simple config switch for when you're ready to transition from the sandbox to live.

### Please note

* This project is a work in progress. Features I'm actively working on include:
  * Capturing webhook updates
  * A simple web app UI

* Google recommends *not* using libraries in your projects, and since libraries add significant latency to HTMLService elements, you probably should copy this code into your own project.  You can keep the file structure for the `.gs` files as it appears here, or just paste everything into one big file (although the JSDoc might make this painful to read). The HTML files must remain separate as they are in this project, unless you want to rewrite the UI components (I wouldn't blame you. They are terrible. Sorry).

* If you want to use this project outside of Google Workspace, it should work without too much adjustment. In particular, you'll need to use regular fetch instaead of UrlFetchApp for the API calls. You'll need to roll your own UI as well, but the form fields are pretty straight-forward.


## General structure (or, what's a shipment anyway?)

As you'll see in the API docs, the structure of a shipment is pretty simple and can be broken down into:

* 2 address objects
* one parcels array
* ...all the other parameters. 

This makes it easy to submit queries, but keeping track of property names can be a bit tricky. Boatsense abstracts the task a bit by creating `endpoint` objects, which consist of:

* contactPerson (name, mobile number, and/or email address)
* address (the same as the API address object, but with camelCase keys)
* constraints (minDate and earliest and latest available times)

Each half of a shipment (collection and delivery) is an "endpoint". The collection endpoint then gets an array of parcels tacked on before the whole lot is submitted to the API as a shipment.


### What are `parcels`?

The API accepts an array of parcels, but only one `declared_value` and one `description`. Boatsense allows you keep track of your inventory and shipments by combining the values and descriptions for all the parcels in a shipment. This is done rigth before submitting an API call, allowing you to assemble individula products into packages while maintaining their properties separately. 

For example, if you have a shipment with 2 parcels, you can  combine them with `makeParcels` like so:

```js
let parcel1 = {
	height: 10,
	width: 10,
	length: 10,
	weight: 1,
	description: "Gadget",
	value: 500
};

// or use the parcel class:

let parcel2 = new parcel(10, 10, 10, 1, "Gizmo", 250);

let parcels = makeParcels(parcel1, parcel2);
console.log(parcels);

/* Logs:
{
	meta: 
	{
		description: "Gadget, Gizmo",
		value: 750
	},
	parcels: 
	[
		{
			height: 10,
			width: 10,
			length: 10,
			weight: 1
		},
		{
			height: 5,
			width: 5,
			length: 5,
			weight: 1
		}
	]
}
*/
```

When this object is passed to the API call function, the values are parsed appropriately. 


### `shipmentBuilder`

You can construct and book a shipment easily like so:

```js
let testData = new test();  
let testConsignment = new shipmentBuilder()
  .addDeliveryContact(...testData.testPerson)
  .addDeliveryAddress(...testData.testAddress)
  .addParcel(...testData.testParcel)
  .build();
testConsignment.bookShipment();
testConsignment.fetchWaybill();
```

Logs:
```
Info Building new shipment
Info No delivery constraints provided. Delivery will be booked for office hours
Info No collection constraints provided. Collection will be booked for office hours
Info No rates provided. Fetching rates...
Info Making API call. Request type: rates
Info Shipment will be booked with the cheapest available rates
Info Making API call. Request type: shipment
Info Shipment has been booked successfully.
Info Consignment will be collected from 1 Government Ave, Pretoria by 2023-05-05T08:00:00Z.
Info Delivery to 120 Plein Street, Cape Town by 2023-05-10T08:00:00Z
Info Shipment id: 12345678
Info Waybill XXXXXX
Info Requesting link to waybill PDF...
Info Making API call. Request type: waybill
Info Fetching waybill PDF...
Info Got waybill: https://drive.google.com/file/d/abc12345678xyz.../view?usp=drivesdk
```

## Implementing

You are free to fork, clone, or copy-paste this repo as you'd like 🙂 Some easy ways to do this are with [clasp](https://github.com/google/clasp), or good old fashioned copy-pasta.

Sign up for a Shiplogic sandbox account, and set your API key s a property of your script with the key name `sandboxApiKey`.

Next, set up yur config.


### Config

```js
class configTemplate {
  constructor() {
    this.accountId = "";
    this.state = 'sandbox';
    this.headers = { 'Authorization': `Bearer ${PropertiesService.getScriptProperties().getProperty(`${this.state}ApiKey`)}` };
    this.defaultAddressType = 'residential';
    this.defaultCountry = 'ZA';
    this.defaultAddress = { /*default address*/ };
    this.defaultContact = { /*default contactPerson*/ };
    this.useUrls = this.state; //use sandbox API endpoints.
    this.useFetch = 'UrlFetchApp';  //'fetch' or 'UrlFetchApp'. Change to fetch if you're debugging in a local IDE
    this.sandbox = { /* sandbox API endpoint details */ };
    this.live = { /* live API endpoint details */ };
  }
}

// ...

var config = new configTemplate();
config.defaultAddress = new address(/* your address here */);
config.defaultContactPerson = new contactPerson( /* details */ );
```


### Sandboxing and transitioning to live

Boatsense is pre-configured to use the sandbox API endpoints. When you're ready to test in the live environment, ask your courier for their live API endpoints, then set the following global variable in your script:


```js
config.live =
  {
    rates: 
    {
      url: '/* your rates endpoint goes here */',
      method: 'POST'
    },
    optInRates: 
    {
      url: '/* opt-in-rates endpoint here */',
      method: 'POST' 
    },
    shipments: 
    {
      url: '/* shipments endpoint here */',
      method: 'POST' 
    },
    getShipments:
    {
      url: '/* and get-shipments here */',
      method: 'POST' 
    }
  };
  
  config.state = 'live';

```


### JSDoc usage

**Internal names** for parameters and properties use `camelCase` consistent with GAS convention, and are converted to `required_api_strings` inside object constructors at the latest possible point.  

JSDoc tags here use a non-canonical combination of JSDoc, Google Closure Compiler, and GAS syntaxes, which works in GAS/Workspace.

*If you're using Boatsense outside of Google Workspace, and this breaks in your compiler, check things like optional parameters and properties, and strings as types.*  

JSDoc supports explicit strings as types like {('business'|'residetial'|'locker')}

* Optional parameter syntax for Closure Compiler is `@param {type=} name - description`
* Optional parameter syntax for JSDoc is `@param {type} [name] - description`

Default value syntax for JSDoc is like `@param {string} [country='ZA']` which means that the parameter name is `country`, it has type `string` with the default value of `'ZA'`.

`@param {(number|'ECO')}` describes a parameter which can be any number, or the string `'ECO'`. 

*For more info, see* [JSDoc](https://jsdoc.app/tags-param.html#optional-parameters-and-default-values).
