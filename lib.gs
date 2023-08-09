class ConfigSheet {
  /** @param {string} sheet */
  constructor(sheet) {
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet);
    var val = (cell) => ss.getRange(cell).getDisplayValue();
    var arr = (range) => ss.getRange(range).getDisplayValues();
    this.defaultAddressType = val('B22');
    this.defaultCountry = val('B7');
    this.specialInstructions = val('B12');
    let mute = val('B24');
    if (mute === 'TRUE' | mute === 'true') {
      mute = true;
    } else {
      mute = false;
    }
    this.muteEmails = mute;
    this.admin = val('B31');
    this.webhook = val('B28');
    this.token = val('B29');
    this.defaultAddress = arr('B2:B11').flat();
    this.defaultContact = arr('B14:B16').flat();
    this.notificationAddress = val('B26');
    this.webapp = val('B30');
    this.timezone = val('B33');
  }
}
var config = new ConfigSheet('Config')


/**
 * @typedef {'GET'|'POST'} method
 */

/**
 * @typedef {Object} api_endpoiont
 * @property {string} URL
 * @property {method} METHOD
 * @property {Array.<string>} PARAMS
 */

/**
 * @typedef {Object} api_endpoints
 * @property {api_endpoint} RATES
 * @property {api_endpoint} OPT_IN_RATES
 * @property {api_endpoint} SHIPMENTS
 * @property {api_endpoint} GET_SHIPMENTS
 * @property {api_endpoint} GET_WAYBILL
 * @property {api_endpoint} GET_STICKER
 * @property {api_endpoint} GET_ADDRESSBOOK
 * @property {api_endpoint} CANCEL
 * @property {api_endpoint} TRACK
 * @property {api_endpoint} GET_POD_LINK
 * @property {api_endpoint} GET_POD
 * @property {api_endpoint} GET_ALL_POD_EVENTS
 * @property {api_endpoint} GET_DIGITAL_POD
 * @property {api_endpoint} GET_STATEMENT
 * @property {api_endpoint} GET_CREDIT_NOTES
 * @property {api_endpoint} GET_CREDIT_NOTE_ITEMS
 * @property {api_endpoint} GET_INVOICES
 * @property {api_endpoint} GET_INVOICE_ITEMS
 * @property {api_endpoint} GET_TRANSACTIONS
 * @property {api_endpoint} WEBHOOK
 */

const SHIPMENT_STATUSES = {
  "submitted": 10,
  "collection-exception": -20,
  "collection-failed-attempt": -20,
  "collected": 20,
  "at-hub": 30,
  "returned-to-hub": -50,
  "swad-dimensions": 40,
  "swad-imaging": 40,
  "in-transit": 50,
  "at-destination-hub": 60,
  "delivery-assigned": 70,
  "out-for-delivery": 80,
  "delivery-exception": -80,
  "delivery-failed-attempt": -80,
  "in-locker": 90,
  "delivered": 100,
  "cancelled": 0,
  "floor-check": 50
}


/**
 * @type {api_endpoints}
 * @name API_ERNDPOINTS
 * @readonly
 */
const API_ENDPOINTS = Object.freeze(
  {
    /**
     * Endpoint for getting available reates. Returns an array of rates objects.
     * @name RATES
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL 'https://api.shiplogic.com/v2/rates'
     * @property {method} METHOD 'POST'
     * @property {Array.<string>} PARAMS 'collection_address', 'delivery_address', 'parcels'
     */
    RATES:
    {
      URL: 'https://api.shiplogic.com/v2/rates',
      METHOD: 'POST',
      PARAMS:
        [
          'collection_address',
          'delivery_address',
          'parcels'
        ]
    },
    /**
     * Endpoint for getting opt-in rates and opt-in-time-based rates
     * @name OPT_IN_RATES
     * @enum 
     * @type {api_endpoint} 
     * @memberof API_ENDPOINTS
     * @property {string} URL 'https://api.shiplogic.com/v2/rates/opt-in'
     * @property {method} METHOD 'POST'
     * @property {Array.<string>} PARAMS 'collection_address', 'delivery_address'
     */
    OPT_IN_RATES:
    {
      URL: 'https://api.shiplogic.com/v2/rates/opt-in',
      METHOD: 'POST',
      PARAMS:
        [
          'collection_address',
          'delivery_address'
        ]
    },
    /**
     * Endpoint for booking shipments
     * @name SHIPMENTS
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS 'collection_address', 'collection_contact', 'delivery_address', 'delivery_contact', 'parcels', 'service_level_code', 'service_level_id'
     */
    SHIPMENTS:
    {
      URL: 'https://api.shiplogic.com/v2/shipments',
      METHOD: 'POST',
      PARAMS:
        [
          'collection_address', 'collection_contact',
          'delivery_address', 'delivery_contact',
          'parcels',
          'service_level_code',
          'service_level_id'
        ],
      MESSAGE: 'booking shipment'
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_SHIPMENTS:
    {
      URL: 'https://api.shiplogic.com/v2/shipments',
      METHOD: 'GET',
      PARAMS:
        [
          'tracking_reference',
          'date_filter',
          'status'
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_WAYBILL:
    {
      URL: 'https://api.shiplogic.com/v2/shipments/label',
      METHOD: 'GET',
      PARAMS:
        [
          'id'
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_STICKER:
    {
      URL: 'https://api.shiplogic.com/v2/shipments/label/stickers',
      METHOD: 'GET',
      PARAMS:
        [
          'id'
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD     
     * @property {Array.<string>} PARAMS 
     */
    GET_ADDRESSBOOK:
    {
      URL: 'https://api.shiplogic.com/v2/accounts/address-books',
      METHOD: 'GET',
      PARAMS:
        [
          `account_id`
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    CANCEL:
    {
      URL: 'https://api.shiplogic.com/v2/shipments/cancel', //postdata: {"tracking_reference": "G9G"}
      METHOD: 'POST',
      PARAMS:
        [
          'tracking_reference' //shipemtnId
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    TRACK:
    {
      URL: 'https://api.shiplogic.com/v2/tracking/shipments',
      METHOD: 'GET',
      PARAMS:
        [
          'tracking_reference', //shipmentId 
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_POD_LINK:
    {
      URL: 'https://api.shiplogic.com/v2/s3-url/download',
      METHOD: 'GET',
      PARAMS:
        [
          'file_name',
          'folder' //=shipment-images'
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_POD:
    {
      URL: 'https://api.shiplogic.com/v2/shipments/pod/images',
      METHOD: 'GET',
      PARAMS:
        [
          'tracking_reference'
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_ALL_POD_EVENTS:
    {
      URL: 'https://api.shiplogic.com/v2/shipments/pod',
      METHOD: 'GET',
      PARAMS:
        [
          'tracking_reference'
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_DIGITAL_POD:
    {
      URL: 'https://api.shiplogic.com/v2/shipments/digital-pod',
      METHOD: 'GET',
      PARAMS:
        [
          'tracking_reference'
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_STATEMENT:
    {
      URL: 'https://api.shiplogic.com/v2/billing/statements',
      METHOD: 'GET',
      PARAMS:
        [
          'start_date',  //yyyy-MM-dd
          'end_date',
          'PDF' //true or false
        ],
      MESSAGE: 'fetching statement'
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_CREDIT_NOTES:
    {
      URL: 'https://api.shiplogic.com/v2/billing/credit-notes',
      METHOD: 'GET',
      PARAMS:
        [
          'start_date', //yyy-MM-dd HH:mm:ss
          'start_date'
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_CREDIT_NOTE_ITEMS:
    {
      URL: 'https://api.shiplogic.com/v2/billing/credit-notes/items',
      METHOD: 'GET',
      PARAMS:
        [
          'credit_note_id' //get this from GET_CREDIT_NOTES
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL 'https://api.shiplogic.com/v2/billing/invoices'
     * @property {method} METHOD 'GET'
     * @property {Array.<string>} PARAMS 'start_date (yyyy-MM-dd HH:mm:ss)', 'end_date'
     */
    GET_INVOICES:
    {
      URL: 'https://api.shiplogic.com/v2/billing/invoices',
      METHOD: 'GET',
      PARAMS:
        [
          'start_date', //yyy-MM-dd HH:mm:ss
          'end_date'
        ]
    },
    /**
     * @name GET_INVOICE_ITEMS
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL 'https://api.shiplogic.com/v2/billing/invoices/items'
     * @property {method} METHOD 'GET'
     * @property {Array.<string>} PARAMS 'invoice_id', 'order_by (=transaction_date)', 'order (= DESC or ASC)`
     */
    GET_INVOICE_ITEMS:
    {
      URL: 'https://api.shiplogic.com/v2/billing/invoices/items',
      METHOD: 'GET',
      PARAMS:
        [
          'invoice_id',
          'order_by', //=transaction_date',
          'order', // DESC or ASC
        ]
    },
    /**
     * @name 
     * @enum
     * @type {api_endpoint}
     * @memberof API_ENDPOINTS
     * @property {string} URL
     * @property {method} METHOD
     * @property {Array.<string>} PARAMS
     */
    GET_TRANSACTIONS:
    {
      URL: 'https://api.shiplogic.com/v2/billing/transactions',
      METHOD: 'GET',
      PARAMS:
        [
          'order_by', //=transaction_date'
          'order', // DESC or ASC'
          'limit', //number
          'offset' //number
        ]
    }
  }
);

/**
 * An address object as implemented by Boatsense
 * @typedef {Object} boatsenseAddress
 * @property {String} type - the type of address ("residential", "business", or "locker"). Called "type" in API calls.
 * @property {String=} [company] - [OPTIONAL] company name
 * @property {String} streetAddress - Street Address
 * @property {String} city - City or town
 * @property {String} suburb - Called "local_area" in API calls
 * @property {String} province - Called "zone" in API calls
 * @property {String} code - 4-digit postal code
 * @property {String} country - 2-letter contry code.
 * @property {Number=} [lat] - [OPTIONAL] Optional latitude. The API will attempt geocoding if lat and long are not passed.
 * @property {Number=} [lng] - [OPTIONAL] Optional longitude. The API will attempt geocoding if lat and long are not passed.
 */

/**
 * An address object as required by the Shiplogic API
 * @typedef {Object} apiAddress
 * @property {String} type - the type of address ("residential", "business", or "locker"). Called "type" in API calls.
 * @property {String=} [company] - [OPTIONAL] company name
 * @property {String} street_address - Called "streetAddress" in this library
 * @property {String} city - City or town
 * @property {String} local_area - Called "suburb" in this library
 * @property {String} zone - Called "province" in this library
 * @property {String} code - 4-digit postal code
 * @property {String} country - 2-letter contry code.
 * @property {Number=} [lat] - [OPTIONAL] Optional latitude. The API will attempt geocoding if lat and long are not passed.
 * @property {Number=} [lng] - [OPTIONAL] Optional longitude. The API will attempt geocoding if lat and long are not passed.
 */

/**
 * Defines an address for collection or delivery.
 * @class
 * @type {boatsenseAddress}
 */
class Address {
  /**
   * @param {string=} [addressType] The type of address
   * @param {string=} [company] [OPTIONAL] company name
   * @param {string} streetAddress
   * @param {string} city City or town
   * @param {string} suburb Called "local_area" in API calls and therefore in the returned object
   * @param {string} province Called "zone" in API calls and therefore in the returned object
   * @param {string} code 4-digit postal code
   * @param {string=} [country] 2-letter contry code. Since most couriers won't accept international shipmens without prior arrangement, this should be limited to your country.
   * @param {number=} [lat] [OPTIONAL] Optional latitude. The API will attempt geocoding if lat and lng are not passed.
   * @param {number=} [lng] [OPTIONAL] Optional longitude. Called "lng" in API calls and therefore in the returned object. The API will attempt geocoding if lat and lng are not passed.
   * @throws {string} '"type" must be "residential" or "business"'
   * @throws {string} '"country" must be 2-letter country code'
   * @returns {boatsenseAddress} address - Address for collection or delivery
   */
  constructor(
    streetAddress,
    suburb,
    city,
    province,
    code,
    country,
    company,
    addressType,
    lat,
    lng
  ) {
    if (company && !addressType) addressType = "business";
    if (!company && !addressType) addressType = config.defaultAddressType;
    if (
      addressType !== "business" &&
      addressType !== "residential" &&
      addressType !== "locker"
    ) {
      addressType = config.defaultAddressType;
    }
    this.type = addressType;
    if (company) {
      this.company = company;
    }
    if (streetAddress && typeof streetAddress === "string") {
      this.streetAddress = streetAddress;
    } else {
      throw 'streetAddress of type "string" is required'
    }
    if (suburb && typeof suburb === "string") {
      this.suburb = suburb;
    } else {
      throw 'suburb of type "string" is required'
    }
    if (city && typeof city === "string") {
      this.city = city;
    } else {
      throw 'city of type "string" is required'
    }
    if (province && typeof province === "string") {
      this.province = province;
    } else {
      throw 'province of type "string" is required'
    }
    if (!code) {
      throw "code is required"
    } else {
      if (typeof code === "Number") code = String(code);
      this.code = code
    }
    if (!country || country === "" || typeof country !== "string") {
      country = config.defaultCountry;
    }
    if (!/^[A-Za-z]{2}$/.test(country)) {
      throw "'country' must be 2-letter country code";
    } else {
      this.country = country;
    }
    if (lat && lng) {
      this.lat = Number(lat);
      this.lng = Number(lng);
    } else {
      try {
        let geocode = Maps.newGeocoder().setRegion(country.toLowerCase());
        console.log(`geocoding ${streetAddress}, ${suburb}, ${city}. ${province}`)
        let geoData = geocode.geocode(
          `${streetAddress}, ${suburb}, ${city}. ${province}`
        );
        if (geoData.status === "OK") {
          this.lat = geoData.results[0].geometry.location.lat;
          this.lng = geoData.results[0].geometry.location.lng;
        } else {
          throw `error ${geoData.status}`;
        }
      } catch (e) {
        throw `error: ${e}`;
      }
    }
  }
  *[Symbol.iterator]() {
    yield this.streetAddress;
    yield this.suburb;
    yield this.city;
    yield this.province;
    yield this.code;
    yield this.country;
    if (this.company) {
      yield this.company;
    } else {
      yield null;
    }
    yield this.type;
    yield this.lat;
    yield this.lng;
  }
}

/**
 * @function fromApi
 * @memberof address
 * @inner
 * Convert this address from API format to internal format
 * @param {apiAddress}
 * @returns {boatsenseAddress}
 */
Address.fromApi = (apiAddressObj) => {
  return new Address(
    apiAddressObj.street_address,
    apiAddressObj.local_area,
    apiAddressObj.city,
    apiAddressObj.zone,
    apiAddressObj.code,
    apiAddressObj.country,
    apiAddressObj.company,
    apiAddressObj.type,
    apiAddressObj.lat,
    apiAddressObj.lng
  )
}

/**
 * @function fromApi
 * @memberof address
 * @inner
 * Convert this address from API format to internal format
 * @returns {apiAddress}
 */
Address.prototype.toApi = function () {
  let apiAddress = {
    type: this.type,
    street_address: this.streetAddress,
    local_area: this.suburb,
    city: this.city,
    zone: this.province,
    country: this.country,
    code: this.code,
    lat: this.lat,
    lng: this.lng,
  };
  if (this.company !== undefined) {
    apiAddress.company = this.company;
  }
  return apiAddress;
};

/**
 * Defines the details of a contact person for collection or delivery
 * @type {object} contactperson
 * @property {string} name
 * @property {string=} [email] - [OPTIONAL] one, or the other, but no more than one of each.
 * @property {string=} [mobile_number] - [OPTIONAL] one, or the other, but no more than one of each.
 */
class ContactPerson {
  /**
   * @param {string} name The contact person's name.
   * @throws {string} '"name" is required'
   * @param {string=} [email] [OPTIONAL] Provide at least one email or one mobile number, but no more than one of each.
   * @param {string=} [mobileNumber] [OPTIONAL] Provide at least one email or one mobile number, but no more than one of each.
   * @throws {string} 'at least one of "mobileNumber" or "email" is required'
   * @returns {contactperson} contactPerson A contact person for collection or delivery
   */
  constructor(name, mobileNumber, email) {
    if (!name || name === "") {
      throw '"name" is a required parameter of contactPerson';
    }
    if (!mobileNumber || mobileNumber === "") {
      if (!email || email === "") {
        throw 'At least one "mobileNumber" or "email" is required for a new contactPerson';
      }
    }
    this.name = name;
    if (mobileNumber) {
      this.mobileNumber = mobileNumber;
    }
    if (email) {
      this.email = email;
    }
  }
}


/**
 * @typedef contactperson
 * A contact person for a collection or delivery. At least one contact method (email or mobile numebr) must be provided
 * @property {String} name - The contact person's name.
 * @property {String=} [email] - [OPTIONAL] The contact person's email address.
 * @property {String=} [mobileNumber] - [OPTIONAL] The contact person's phone number 
 * (doesn't actually have to be a mobile number, but mobile is preferred).
 */

/**
 * @function toApi
 * @memberof ContactPerson
 * @inner
 * Convert this person from API format to internal format
 * @returns {contactperson}
 */
ContactPerson.prototype.toApi = function () {
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
};


/** 
* @typedef {Object} endpointConstraints
* @property {String} minDate - The earliest acceptable date for collection or delivery in UTC format with offset, 
* @property {String} openingTime - The earliest acceptable time for collection or delivery, in 24 hour format with no seconds.
* @property {String} closingTime - The earliest acceptable time for collection or delivery, in 24 hour format with no seconds.
* @property {String=} [specialInstructions]
*/

/**
 * Defines a logical way to organise the required properties of the API request object.
 * Property names are converted to the required key strings for the API call in the relevant API call objects.
 * One endpointConstraints object is required for collection, and one for delivery.
 * A default "weekdays and office hours" object can be constructed and automatically assigned to collection and delivery.
 * @type {endpointConstraints}
 */
class Constraints {
  /**
   * @param {Date} minDate The earliest acceptable date for collection.
   * @param {Date} openingTime The earliest acceptable time for collection or delivery.
   * @param {Date} closingTime The latest acceptable time for collection or delivery.
   * @param {string=} [specialInstructions] [OPTIONAL] Special instructions for this address.
   * @throws {TypeError} minDate, openingTime, and closingTime must be Date objects
   * @returns {endpointConstraints} constraints
   */
  constructor(minDate, openingTime, closingTime, specialInstructions) {
    if (!minDate instanceof Date || !openingTime instanceof Date || !closingTime instanceof Date) {
      throw 'minDate, openingTime, and closingTime must be Date objects';
    }
    if (!minDate || minDate === "") {
      throw "minDate is required for new Constraints"
    }
    if (!closingTime || !openingTime || closingTime === "" || openingTime === "") {
      throw "Time is required. If *you* don't require it, use a new instance of OfficeHours or something. I made it just for you. Or don't, I don't know your life."
    }
    this.minDate = minDate;
    this.openingTime = openingTime;
    this.closingTime = closingTime;
    if (specialInstructions) {
      if (typeof specialInstructions === "string") {
        this.specialInstructions = specialInstructions;
      } else {
        throw `Constraints expected specialInstructions of type 'string', but got ${typeof specialInstructions}`;
      }
    }
  }
}

/**
 * A class enabling adding days to dates
 * @constructor
 * @extends Date
 * @returns Date
 */
class otherDate extends Date {
  constructor() {
    super();
    this.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return new Date(date);
    };
  }
}

/**
 * @constructor officeHours
 * @param {string=} [specialInstructions] [OPTIONAL] special instructions for this address
 * @throws {string}
 * @returns {endpointConstraints} officeHours
 */
class OfficeHours extends Constraints {
  constructor(specialInstructions) {
    let dayStart = "08:00";
    let dayEnd = "17:00";
    let offset = 0;
    let date = new otherDate();
    let hour = date.getMilliseconds();
    let dayOfWeek = date.getDay();



    if (dayOfWeek === 0) {
      offset += 1;
    } else if (dayOfWeek === 6) {
      offset += 2;
    } else if (hour > 6.12 * 10 ^ 7) {
      offset += 1;
    }

    date = date.addDays(offset);
    super(date, dayStart, dayEnd, specialInstructions);
  }
}


/**
 * @typedef {Object} boatsenseEndpoint
 * Defines the properties of a delivery, and the base class for a collection.  
 * One end of a shipment. Two endpoints plus parcels plus rates plus a reference is a shipment. 
 * The combination of a boatsenseAddress, a contactPerson for that address, endpointconstraints, 
 * and optional special instructions.
 * @property {boatsenseAddress} address
 * @property {contactperson} contact
 * @property {endpointConstraints} constraints
 */

/**
 * The class comprising a delivery, and the base class of a collection.
 * @type {boatsenseEndpoint}
 */
class Endpoint {
  /**
   * @param {boatsenseAddress} address
   * @throws {string} '"address" of type boatsenseAddress is a required parameter'
   * @param {contactPerson} contact
   * @throws {string} '"contact" of type contactPerson is a required parameter'
   * @param {endpointConstraints} constraints
   * @throws {string} '"constraints" of type endpointConstraints is a required parameter'
   * @returns {boatsenseEndpoint} endpoint
   */
  constructor(address, contact, constraints) {
    if (!address) {
      throw '"address" of type boatsenseAddress is a required parameter';
    }
    if (!contact) {
      throw '"contact" of type contactPerson is a required parameter';
    }
    if (!constraints) {
      throw '"constraints" of type endpointConstraints is a required parameter';
    }
    this.address = address;
    this.contact = contact;
    this.constraints = constraints;
  }
}


//These objects are returned by rates queries to the API
/**
 * @typedef {Object} optionalRate
 * @property {number} id The code for this rate
 * @property {string} name A description of the service included
 * @property {string} charge_type E.g. "flat"
 * @property {number} charge_value Monetary value
 * @property {string=} type E.g. "delivery"
 */
/**
 * @typedef {Object} availableRate
 * @property {number} rate
 * @property {number} rate_excluding_vat
 * @property {object} base_rate
 * @property {number[]} base_rate.charge_per_parcel
 * @property {number} base_rate.charge
 * @property {string} base_rate.group_name
 * @property {number} base_rate.vat
 * @property {string} base_rate.vat_type
 * @property {string} base_rate.rate_formula_type
 * @property {number} base_rate.total_calculated_weight
 * @property {object} service_level
 * @property {number} service_level.id
 * @property {string} service_level.code
 * @property {string} service_level.name
 * @property {string} service_level.description
 * @property {string} service_level.delivery_date_from
 * @property {string} service_level.delivery_date_to
 * @property {string} service_level.collection_date
 * @property {string} service_level.collection_cut_off_time
 * @property {string} service_level.vat_type
 * @property {boolean} service_level.insurance_disabled
 * @property {object} service_day_tags
 * @property {Array|null} service_day_tags.collection_service_day_tags
 * @property {Array|null} service_day_tags.delivery_service_day_tags
 * @property {Array} surcharges
 * @property {Array} rate_adjustments
 * @property {Array} time_based_rate_adjustments
 * @property {object[]} extras
 * @property {number} extras.id
 * @property {number} extras.insurance_charge
 * @property {number} extras.vat
 * @property {string} extras.vat_type
 * @property {number} charged_weight
 */
/**
 * @typedef {Object} allAvailableRates
 * @property {availableRate[]} available
 * @property {Array.<optionalRate>} optIn
 * @property {Array.<optionalRate>} optInTimeBased
 * @property {availableRate} cheapest
 */

//this object is for the shipment call
/**
 * The type of object required to book a shipment
 * @typedef {Object} SelectedRates
 * @property {String[]|Number[]=} optInRates
 * @property {String[]|Number[]=} optInTimeBasedRates
 * @property {String|NUmber} rate
 */



/**
 * @typedef {Object} parcelObject
 * @property {Object} parcel
 * @property {Number} parcel.submitted_length_cm Length in whole-number centimetres 
 * @property {Number} parcel.submitted_width_cm Width in whole-number centimetres 
 * @property {Number} parcel.submitted_height_cm Height in whole-number centimetres 
 * @property {Number} parcel.submitted_weight_kg Weight in whole-number kilograms
 * @property {String=} [parcel.parcel_description] Description of the contents of the parcel
 * @property {Number=} [value] Monetary value of the parcel
 */

/**
 * @class Parcel
 */
class Parcel {
  /**
   * @param {number} length Length in whole-number centimetres 
   * @param {number} width Width in whole-number centimetres 
   * @param {number} height Height in whole-number centimetres 
   * @param {number} weight Weight in whole-number kilograms 
   * @param {string=} [description] Description of the contents of this parcel
   * @param {number=} [value] Monetary value of this parcel
   * @returns parcelObject
   */
  constructor(length, width, height, weight, description, value) {
    this.parcel =
    {
      submitted_length_cm: Math.floor(length),
      submitted_width_cm: Math.floor(width),
      submitted_height_cm: Math.floor(height),
      submitted_weight_kg: Math.floor(weight)
    };
    if (description && typeof description === 'string') {
      this.parcel.parcel_description = description;
    } else {
      if (description) throw `parcel expected description type 'string' but got ${typeof description}`;
    }
    if (value && typeof value === 'number') {
      this.value = value;
    } else {
      if (value) throw `parcel expected value type 'number' but got ${typeof value}`;
    }
  }
}


/**
 * A special parcel with discounted rates. Check your courier's definition.
 * @constructor
 */
class SandardFlyer extends Parcel {
  /** 
   * @returns {parcel} standardFlyer
   */
  constructor(description, value) {
    super(20, 20, 10, 2, description, value)
  }
}

/**
 * @typedef {Object} shipmentQuery
 * @property {Object} collection_address
 * @property {Object} collection_contact
 * @property {Object} delivery_address
 * @property {object} delivery_contact
 * @property {Array.<object>} parcels
 * @property {String} collection_min_date
 * @property {String} collectOon_after
 * @property {String} collection_before
 * @property {String} delivery_min_date
 * @property {String} delivery_after
 * @property {String} delivery_before
 * @property {String} service_level_code
 * @property {Boolean} mute_notifications
 * @property {String} customer_reference
 * @property {Number} declared_value
 * @property {Array} opt_in_rates
 * @property {Array} opt_in_time_based_rates
 * @property {String} custom_tracking_reference
 * @property {String} special_instructions_collection
 * @property {String} special_instructions_delivery
 */



/**
 * Class for converting keys from GAS camelCase to API snake_case 
 * @class Shipment
 * @property {shipmentQuery} payload
 */
class Shipment {
  /**
   * @param {boatsenseEndpoint} collection
   * @param {boatsenseEndpoint} delivery
   * @param {parcelObject[]} parcels
   * @param {SelectedRates} rates
   * @param {String=} reference
   */
  constructor(collection, delivery, parcels, rates, reference) {
    this.payload =
    {
      collection_address: collection.address.toApi(),
      collection_contact: collection.contact.toApi(),
      delivery_address: delivery.address.toApi(),
      delivery_contact: delivery.contact.toApi(),
      parcels: [],
      collection_min_date: Utilities.formatDate(collection.constraints.minDate, config.timezone, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
      collection_after: collection.constraints.openingTime,
      collection_before: collection.constraints.closingTime,
      delivery_min_date: Utilities.formatDate(delivery.constraints.minDate, config.timezone, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
      delivery_after: delivery.constraints.openingTime,
      delivery_before: delivery.constraints.closingTime,
      service_level_code: rates.rate,
      mute_notifications: config.muteEmails,
      customer_reference: reference,
      declared_value: 0,
      opt_in_rates: rates.optInRates,
      opt_in_time_based_rates: rates.optInTimeBasedRates,
      custom_tracking_reference: "",
      special_instructions_collection: collection.constraints.specialInstructions,
      special_instructions_delivery: delivery.constraints.specialInstructions
    };
    parcels.forEach((parcel) => {
      this.payload.parcels.push(parcel.parcel);
      this.payload.declared_value += parcel.value;
    });
  }
}


class APICall {
  /**
   * @param {api_endpoint} apiEndpoint
   * @param {object} requestObject
   * @param {string} apiKey
   * @param {string=} [overrideAPIKey] Use this API key instead of the key in user properties
   */
  constructor(apiEndpoint, requestObject, overrideAPIKey) {

    /**
     * @param {string} key
     * @param {string|number} value
     * @throws 'Parameters must be provided in pairs of name and value'
     * @returns {Array.<Object>}
     */
    function buildQueryString(reqObj) {
      var keys = Object.getOwnPropertyNames(reqObj);
      var fields = "?";
      for (let i = 0; i < keys.length; i++) {
        fields += `${keys[i]}=`;
        fields += `${reqObj[keys[i]].toString()}&`;
      }
      return fields.slice(0, -1);
    }
    this.url = apiEndpoint.URL;
    this.message = apiEndpoint.MESSAGE;
    var method = apiEndpoint.METHOD;
    var headers =
    {
      'Authorization': `Bearer ${PropertiesService.getUserProperties().getProperty('apiKey')}`
    };
    if (overrideAPIKey) headers = { 'Authorization': `Bearer ${overrideAPIKey}` };

    this.request =
    {
      headers: headers,
      method: method,
      muteHttpExceptions: true,
      followRedirects: true
    };
    if (method === 'POST') {
      this.request.payload = JSON.stringify(requestObject);
      this.request.contentType = 'application/json'
    }
    if (method === 'GET') {
      this.url += buildQueryString(requestObject);
    }
    this.request.url = this.url;

    /**
     * @returns {Object}
     */
    this.makeCall = function () {
      Logger.log(`API call, ${this.message}, ${this.url}`);
      var response = UrlFetchApp.fetchAll([this.request]);
      Logger.log('Response:\n\n%s', response[0]);
      var status = response[0].getResponseCode();
      if (status !== 200) {
        throw new Error(`Error. Response code ${status}`)
      } else {
        response = JSON.parse(response[0].getContentText());
        return response;
      }
    }
  }
}

/**
 * Get account statement as an object or PDF
 * @property {string} startDate Start date in yyyy-MM-dd format
 * @property {string} endDate End date in yyyy-MM-dd format
 */
class Statement {
  /**
   * @param {Date} startDate Start of the range to include in the statement
   * @param {Date} endDate End of the range to include in the statement
   * @param {Boolean} getPDF Return a link to a PDF instead of an object
   */
  constructor(startDate, endDate, getPDF) {
    let tz = Session.getScriptTimeZone();
    let start = Utilities.formatDate(startDate, tz, 'yyyy-MM-dd');
    let end = Utilities.formatDate(endDate, tz, 'yyyy-MM-dd');
    let pdf = getPDF;
    var request =
    {
      start_date: start,
      end_date: end,
      pdf: pdf
    }
    let call = new APICall(API_ENDPOINTS.GET_STATEMENT, request);
    let response = call.makeCall();
    if (!pdf) {
      this.startDate = response.from_date;
      this.endDate = response.to_date;
      this.totalPayable = response.total_payable;
      this.pendingDebits = response.pending_debits;
      this.closingBalance = response.closing_balance;
      this.unallocatedCredit = response.unallocated_credit;
      this.provider = response.provider_details
      this.account = response.account;
      this.balanceBroughtForward = response.balance_brought_forward;
      this.transactions = response.transactions;
      this.ageAnalysis = response.age_analysis_at_to_date
    } else {
      this.url = response.url;
      this.fileName = response.filename;
    }
  };
}



/**
 * Defines data required to request rates
 * @class RatesQuery
 * @type allAvailableRates
 * @property {Array.<availableRate>} available
 * @property {Array.<optionalRate>} optIn
 * @property {Array.<optionalRate>} optInTimeBased
 * @property {availableRate} cheapest The cheapest rate available
 */
class RatesQuery {
  /**
   * @param {boatsenseAddress} collectionAddress
   * @param {boatsenseAddress} deliveryAddress
   * @param {parcelObject[]} parcels
   */
  constructor(collectionAddress, deliveryAddress, parcels) {
    /**
     * Get available rates
     * @returns {array.<availableRate>}
     */
    function getRates(request) {
      let call = new APICall(API_ENDPOINTS.RATES, request);
      let response = call.makeCall();
      let status = response.message;
      if (status !== "Success") {
        throw new Error(status)
      } else {
        return response.rates;
      }
    }
    /**
     * get opt-in rates
     * @returns {optionalRates}
     */
    function getOptInRates(request) {
      let call = new APICall(API_ENDPOINTS.OPT_IN_RATES, request);
      let response = call.makeCall();
      return response;
    }
    /**
     * Get cheapest available rates
     * @returns {availableRate}
     */
    function getCheapestRates(ratearray) {
      var cheapest = ratearray[0];

      for (let i = 1; i < ratearray.length; i++) {
        if (ratearray[i].rate < cheapest.rate) {
          cheapest = ratearray[i];
        }
      }
      return cheapest;
    }

    let request =
    {
      collection_address: collectionAddress.toApi(),
      delivery_address: deliveryAddress.toApi(),
      parcels: [],
    };
    parcels.forEach((parcel) => {
      request.parcels.push(parcel.parcel);
    });
    var oiRates = getOptInRates(request);
    var avRates = getRates(request);

    this.available = avRates;
    this.optIn = oiRates.opt_in_rates
    this.optInTimeBased = oiRates.opt_in_time_based_rates
    this.cheapest = getCheapestRates(avRates);
  }
}


/**
 * @class AddressBook
 * @property {Array.<Object>} entries
 * @property {Array.<boatsenseEndpoint>} endpoints
 */
class AddressBook {
  constructor() {
    this.request =
    {
      account_id: PropertiesService.getScriptProperties().getProperty('accId')
    };
    let call = new APICall(API_ENDPOINTS.GET_ADDRESSBOOK, this.request);
    let response = call.makeCall()
    this.entries = response.items;
    this.endpoints = [];
    this.entries.forEach((entry) => {
      let person = new ContactPerson(entry.contact_name, entry.mobile_number, entry.email);
      let address = Address.fromApi(entry.address);
      let instructions = new OfficeHours(entry.special_instructions);
      let endpoint = new Endpoint(address, person, instructions);
      this.endpoints.push(endpoint);
    });
  }
}

/**
 * Book a shipment and update this shipment with updated values returned by the API
 * @memberof! Shipment
 * @returns 
 */
Shipment.prototype.bookShipment = function () {
  let request = this.payload;
  let call = new APICall(API_ENDPOINTS.SHIPMENTS, request);
  let response = call.makeCall();
  this.shipmentId = response.id;
  this.collectionDate = response.collection_min_date;
  this.deliveryDate = response.estimated_delivery_to;
  this.waybillRef = response.short_tracking_reference;
  Logger.log('Shipment has been booked successfully.')
  Logger.log(`Consignment will be collected from ${this.payload.collection_address.street_address}, ${this.payload.collection_address.city} by ${response.estimated_collection}.`);
  Logger.log(`Delivery to ${this.payload.delivery_address.street_address}, ${this.payload.delivery_address.city} by ${response.estimated_delivery_to}`);
  Logger.log(`Shipment id: ${response.id}`);
  Logger.log(`Waybill ${response.short_tracking_reference}`);
  return this;
}
/**
 * @return {string} Link to AWS waybill PDF
 */
Shipment.prototype.getWaybill = function () {
  let request =
  {
    id: this.shipmentId
  };
  let call = new APICall(API_ENDPOINTS.GET_WAYBILL, request);
  let response = call.makeCall();
  let url = response.url;
  return url
}

/**
 * Get your current account balance
 * @returns {string} Balance
 */
function getBalance() {
  let today = new Date();
  var statement = new Statement(today, today, false);
  var balance = statement.account.balance;
  return balance;
}

/**
 * @class ParcelBuilder
 */
class ParcelBuilder {
  constructor() {
    /** @private */
    this.length = 0;
    /** @private */
    this.width = 0;
    /** @private */
    this.height = 0;
    /** @private */
    this.weight = 0;
    /** @private */
    this.value = 0;
    /** @private */
    this.description = [];

    /**
     * Add an item to a parcel with heurist packing.
     * @function
     * @memberof ParcelBuilder
     * @inner
     * @param {number} length
     * @param {number} width
     * @param {number} height
     * @param {number} weight
     * @param {string=} [description] Description of the item (description, name, SKU, etc.)
     * @param {number=} [value] Monetary value
     * @returns {ParcelBuilder} updated instance of ParcelBuilder
     */
    this.addItem = function (length, width, height, weight, description, value) {

      /**
       * @private
       * @function
       * Combine 2 arrays of the same leng
       * @param {physicalObject} array1
       * @param {physicalObject} array2
       */
      function stackItems(array1, array2) {
        const isnumber = (value) => typeof value === 'number';
        if
          (
          array1.length !== 3
          || array2.length !== 3
          || !array1.every(isnumber)
          || !array2.every(isnumber)
        ) {
          throw 'parameters must be 2 array of 3 numbers'
        }
        array1.sort();
        array2.sort();
        return [array1[0] + array2[0], Math.max(array1[1], array2[1]), Math.max(array1[2], array2[2])]
      }


      if (typeof length === 'number') {
        this.length += length;
      } else {
        `ParcelBuilder expected 'length' of type number but got ${typeof length}`;
      }
      if (typeof weight === 'number') {
        this.weight += weight;
      } else {
        throw `ParcelBuilder expected 'weight' of type number but got ${typeof weight}`;
      }
      if (description) {
        if (typeof description === 'string') {
          var found = false;;
          for (let i = 0; i < this.description.length; i++) {
            if (this.description[i].item === description) {
              Logger.log(`${this.description[i].item} is ${description}`);
              this.description[i].count = this.description[i].count + 1;
              found = true;
              break;
            }
          }
          if (!found) {
            let thing =
            {
              item: description,
              count: 1
            }
            this.description.push(thing);
          }
        } else {
          throw `ParcelBuilder expected 'description' of type string but got ${typeof description}`;
        }
      }

      if (value) {
        if (typeof value === 'number') {
          this.value += value;
        } else {
          throw `ParcelBuilder expected 'value' of type number but got ${typeof value}`;
        }
      }
      [this.length, this.width, this.height] =
        stackItems(
          [this.length, this.width, this.height],
          [length, width, height]
        );
      return this;
    }
    /**
     * @returns {parcel}
     */
    this.build = function () {
      var newdescription = `${this.description[0].count}x ${this.description[0].item}, `;
      for (let i = 1; i < this.description.length; i++) {
        newdescription = `${newdescription}${this.description[i].count}x ${this.description[i].item}, `
      }
      newdescription = newdescription.slice(0, -2);
      let newparcel = new Parcel(this.length, this.width, this.height, this.weight, newdescription, this.value);
      return newparcel;
    }
  }
}

/**
 * Send a request to the webhook script
 * @param {'booking'|'packages'} type
 * @param {string|Object} data
 */
function askwebhook(type, data) {
  let endpoint = {
    data: data,
    type: type
  };
  let token = config.token;
  endpoint = JSON.stringify(endpoint)
  let message = encryptMessage(endpoint, token);
  message = encodeURIComponent(message);
  Logger.log('Asking webhook for %s', message);
  let response = UrlFetchApp.fetch(`${config.webhook}?message=${message}`);
  response = JSON.parse(response);
  Logger.log('Got webhook response %s', response)
  return response;
}

/**
 * @param {string} waybillURL AWS url from API
 * @param {string} ticketNumber
 * @param {string} cid
 * @param {string} userName Name of the user booking this shipment
 */
function webhookBooking(waybillURL, ticketNumber, cid, userName) {
  let data =
  {
    url: waybillURL,
    ticket: ticketNumber,
    cid: cid,
    name: userName
  }
  askwebhook('booking', data)
}

/** 
 * @typedef {object} updateObject
 * webhook POST data includes an array of these objects
 * @property {number} id
 * @property {number} parcel_id
 * @property {string} date
 * @property {string} status
 * @property {string} source
 * @property {string} location
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} message
 */

/** 
 * Each webhook POST is an array with a single member of this type
 * @typedef {object} tcgUpdatePost
 * @property {number} provider_id
 * @property {number} shipment_id
 * @property {string} custom_tracking_reference
 * @property {string} short_tracking_reference
 * @property {string} status
 * @property {string} shipment_time_created
 * @property {string} shipment_time_modified
 * @property {string} shipment_collected_date
 * @property {null|string} shipment_delivered_date
 * @property {string} update_type
 * @property {string} event_time
 * @property {updateObject[]} tracking_events
 */

class StatusSheet {
  constructor() {
    this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Status');
    this.data = [
      ["waybill", "ticket", "recipient", "status", "date", "progress", "state"]
    ];
    var today = new Date();
    var thisMonth = Number.parseInt(Utilities.formatDate(today, config.timezone, "MM"));
    var thisYear = Number.parseInt(Utilities.formatDate(today, config.timezone, "yyyy"));
    var thisDay = Number.parseInt(Utilities.formatDate(today, config.timezone, "dd"));
    var lastMonth = thisMonth - 1;
    var lastYear = thisYear;
    if (thisMonth === 1) {
      lastMonth = 12;
      lastYear--;
    };
    var request = {
      date_filter: "time_created",
      start_date: `${lastYear}-${lastMonth}-01`,
      end_date: `${thisYear}-${thisMonth}-${thisDay}`
    };
    var shipments = new APICall(API_ENDPOINTS.GET_SHIPMENTS, request);
    shipments.makeCall();
    shipments = shipments.makeCall();
    shipments.shipments.forEach(shipment => {
      let progress = SHIPMENT_STATUSES[shipment.status];
      var state;
      if (progress < 0) {
        state = "error"
      } else {
        state = "ok"
      }
      progress = Math.abs(progress);
      this.data.push([shipment.short_tracking_reference, "", shipment.delivery_contact.name, shipment.status, shipment.time_modified, progress, state])
    });
    this.newSheet = function () {
      this.sheet.getDataRange().clear();
      this.sheet.getRange(1, 1, this.data.length, 7)
        .setValues(this.data);
    }
    this.updateSheet = function () {
      var pending = [];
      this.data.forEach(datum => {
        if (datum[3] !== "delivered") {
          pending.push(datum);
        }
      });
      this.sheet.getDataRange().clear();
      this.sheet.getRange(1, 1, pending.length, 7)
        .setValues(pending);
    }
  }
}
