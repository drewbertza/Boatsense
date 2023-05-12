/**
 * @fileoverview
 * Functions and methods for Boatsense - API client
 */


/**
 * @function toApi
 * @memberof contactPerson
 * @inner
 * Convert this person from API format to internal format
 * @returns {contactperson}
 */
contactPerson.prototype.toApi = function () {
  let apiPerson = {
    name: this.name,
  };
  if (this.mobileNumber !== undefined) {
    apiPerson.mobile_number = this.mobileNumber;
  }
  if (this.email !== undefined) {
    apiPerson.email = this.email;
  }
  return apiPerson;
}



/**
 * Makes parcels from any number of parcelObjects.
 * @param {...parcelObject} parcelObjects As many parcelObjects as you want to combine into a parcels object
 * @returns {parcels} parcels
 */
function makeParcels(...parcelObjects) {
  let descriptions = "";
  let values = 0;
  let parcels = [];
  for (let i = 0; i < parcelObjects.length; i++) {
    parcels.push(parcelObjects[i].parcel)
    if (parcelObjects[i].hasOwnProperty('meta')) {
      if (parcelObjects[i].meta.hasOwnProperty('description')) {
        descriptions += `${parcelObjects[i].meta.description}, `;
      }
      if (parcelObjects[i].meta.hasOwnProperty('value')) {
        values = values + parcelObjects[i].meta.value;
      }
    }
  }
  let parcelObj =
  {
    parcels: parcels,
    meta:
    {
      description: descriptions,
      value: values
    }
  };
  return parcelObj;
}


 /**
 * @function
 * @memberof! optInRatesQuery
 * Gets available opt-in rates from the API
 * @returns {optionalRates}
 */
optInRatesQuery.prototype.getRates = function () {
  var request = {
    url: config[config.state].optInRates.url,
    contentType: "application/json",
    method: config[config.state].optInRates.method,
    headers: config.headers,
    followRedirects: true,
    muteHttpExceptions: true,
    payload: JSON.stringify(this.payload),
  };
  return apiCall({payload: request, type: "optInRates"});
}


/**
 * @function
 * @abstract
 * Get available reates from the API.
 * @memberof! ratesQuery
 * @returns {array.<availableRates>}
 */
ratesQuery.prototype.getRates = function () {
  var request = {
    url: config[config.state].rates.url,
    contentType: "application/json",
    method: config[config.state].rates.method,
    headers: config.headers,
    followRedirects: true,
    muteHttpExceptions: true,
    payload: JSON.stringify(this.payload),
  };
  let response = apiCall({payload: request, type: "rates"});
  let rates = response.rates;
  var availableRates = [];
  for (i = 0; i < rates.length; i++) {
    let rate = {
      rate: rates[i].rate,
      serviceLevelId: rates[i].service_level.id,
      serviceLevelCode: rates[i].service_level.code,
      serviceLevelName: rates[i].service_level.name,
      deliveryDate: rates[i].delivery_date_to,
    };
    availableRates.push(rate);
  }
  this.rates = availableRates;
  return availableRates;
}


/**
 * Get the cheapest available rates
 * @memberof! ratesQuery
 */
ratesQuery.prototype.getCheapestRates = function () {
  if (this.rates === undefined) {
    console.log("Fetching available rates...")
    let theseRates = this.getRates();
    this.rates = theseRates
  }
  var cheapest = this.rates[0];
  for (let i = 1; i < this.rates.length; i++) {
    if (this.rates[i].rate < cheapest.rate) {
      cheapest = theseRates[i];
    }
  }
  this.rates = cheapest
  return this.rates;
}


/**
 * Get waybill as PDF, save to Drive and return link to file. Link will also be added to this shipment.waybill;
 * @memberof! shipment
 * @returns {string} URL to waybill PDF on Drive
 * @throws {string} 'error fetching waybill'
 */
shipment.prototype.fetchWaybill = function () {
  let request = {
    url: `${config[config.state].getWaybill.url}${this.shipmentId}`,
    method: config[config.state].getWaybill.method,
    headers: config.headers,
    followRedirects: true,
    muteHttpExceptions: true,
  };
  console.log("Requesting link to waybill PDF...")
  let response = apiCall({ payload: request, type: 'waybill' });
  waybillLink = response.url;
  try {
    console.log('Fetching waybill PDF...');
    var blob = UrlFetchApp.fetch(waybillLink).getBlob();
    var waybill = DriveApp.createFile(blob).setName(`${this.waybillRef}.pdf`).getUrl();
    this.waybill = waybill;
    console.log(`Got waybill: ${waybill}`);
    return this;
  } catch (e) {
    throw `Error fetching waybill: ${e}`;
  }
}

/**
 * Book a shipment and update this shipment with the properties shipmentId and waybillRef
 * @memberof! shipment
 * @returns {string} shipmentId
 */
shipment.prototype.bookShipment = function () {
  let request =
  {
    url: config[config.state].shipments.url,
    contentType: 'application/json',
    method: config[config.state].shipments.method,
    headers: config.headers,
    followRedirects: true,
    muteHttpExceptions: true,
    payload: JSON.stringify(this.payload)
  };
  var response = apiCall({ payload: request, type: 'shipment' });
  this.shipmentId = response.id;
  this.collectionDate = response.collection_min_date;
  this.deliveryDate = response.estimated_delivery_to;
  this.waybillRef = response.short_tracking_reference;
  console.log('Shipment has been booked successfully.')
  console.log(`Consignment will be collected from ${this.payload.collection_address.street_address}, ${this.payload.collection_address.city} by ${response.estimated_collection}.`);
  console.log(`Delivery to ${this.payload.delivery_address.street_address}, ${this.payload.delivery_address.city} by ${response.estimated_delivery_to}`);
  console.log(`Shipment id: ${response.id}`);
  console.log(`Waybill ${response.short_tracking_reference}`);
  return this;
}


/**
 * Makes an API call of the specified type and returns the parsed content text
 * @param {apiRequest} request
 * @param {string} requestType "rates" | "optInRates" | "shipment" | "waybill"
 * @todo make requestType strings an anctual type
 * @returns {object} Content text of the API response, parsed to an object
 */
function apiCall(request) {
  var errorMessage;
  var response;
  var status;
  var payload = request.payload;
  var requestType = request.type
  if (requestType === "rates") {
    errorMessage = "Error fetching rates";
  } else {
    if (requestType === "optInRates") {
      errorMessage = "Error fetching opt-in rates";
    } else {
      if (requestType === "shipment") {
        errorMessage = "Error booking shipment";
      } else {
        if (requestType === "addressBook") {
          errorMessage = "Error fetching Address book";
        }
      }
    }
  }
  if (config.useFetch === "UrlFetchApp") {
    console.log(`Making API call. Request type: ${requestType}`);
    try {
      response = UrlFetchApp.fetchAll([payload]);
      status = response[0].getResponseCode();
      if (status !== 200) {
        throw `${errorMessage}: ${response[0].getContentText()}`;
      } else {
        return JSON.parse(response[0].getContentText());
      }
    } catch (e) {
      throw `${errorMessage}: ${e}`;
    }
  } else {
    if (config.useFetch === "fetch") {
      try {
        response = fetch(request);
        if (response.status !== 200) {
          throw `${errorMessage}: ${e}`;
        } else {
          return response.json();
        }
      } catch (e) {
        throw `${errorMessage}: ${e}`;
      }
    }
  }
}


/**
 * Get your address book
 * @returns {array.<object>}
 */
function getAddressbook() {
  let query = {
    url: config[config.state].getAddressbook.url,
    method: config[config.state].getAddressbook.method
  };
  if (config.state === "live") {
    query.url = query.url + config.accountId;
    query.headers = config.getHeaders();
  } else {
    if (config.state === "sandbox") {
      // these are sandbox credentials provided in the API docs
      // specifically for testing address book functionality
      query.headers = {"Authorization": "Bearer 37f112768d23494292f029e8855a6eac"};
      query.url = query.url + "188";
    }
  }
  let response = apiCall({payload: query, type: "addressBook"});
  return response.items;
}


