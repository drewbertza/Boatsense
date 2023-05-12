/**
 * @fileoverview
 * Classes for Boatsense - API client
 */


/**
 * Defines an address for collection or delivery.
 * @class
 * @type {boatsenseAddress}
 */
class courierAddress  {
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
    if (addressType === undefined || addressType === "unknown") {
      if (company === undefined) {
        addressType = config.defaultAddressType;
      } else {
        addressType = "business";
      }
    }
    if (
      addressType !== "business" &&
      addressType !== "residential" &&
      addressType !== "locker"
    ) {
      throw '"AddressType" must be "residential", "business", or "locker"';
    }
    this.type = addressType;
    if (company != undefined) {
      this.company = company;
    }
    this.streetAddress = streetAddress;
    this.suburb = suburb;
    this.city = city;
    this.province = province;
    this.code = code;
    if (country === undefined) {
      country = config.defaultCountry;
    }
    this.country = country;
    if (!country.match(/[A-Za-z]{2}/)) {
      throw "'country' must be 2-letter country code";
    } else {
      this.country = country;
    }
    if (lat !== undefined && lng !== undefined) {
      this.lat = lat;
      this.lng = lng;
    } else {
      try {
        let geocode = Maps.newGeocoder().setRegion(country.toLowerCase());
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
}




/**
 * Defines the details of a contact person for collection or delivery
 * @type {object} contactperson
 * @property {string} name
 * @property {string=} [email] - [OPTIONAL] one, or the other, but no more than one of each.
 * @property {string=} [mobile_number] - [OPTIONAL] one, or the other, but no more than one of each.
 */
class contactPerson {
  /**
   * @param {string} name The contact person's name.
   * @throws {string} '"name" is required'
   * @param {string=} [email] [OPTIONAL] Provide at least one email or one mobile number, but no more than one of each.
   * @param {string=} [mobileNumber] [OPTIONAL] Provide at least one email or one mobile number, but no more than one of each.
   * @throws {string} 'at least one of "mobileNumber" or "email" is required'
   * @returns {contactperson} contactPerson A contact person for collection or delivery
   */
  constructor(name, mobileNumber, email) {
    if (name === undefined) {
      throw '"name" is a required parameter of contactPerson';
    }
    if (mobileNumber === undefined && email === undefined) {
      throw 'at least one of "mobile_number" or "email" is required for a new contactPerson';
    }
    this.name = name;
    if (mobileNumber !== undefined) {
      this.mobileNumber = mobileNumber;
    }
    if (email !== undefined) {
      this.email = email;
    }
  }
}



/**
 * Defines a logical way to organise the required properties of the API request object.
 * Property names are converted to the required key strings for the API call in the relevant API call objects.
 * One endpointConstraints object is required for collection, and one for delivery.
 * A default "weekdays and office hours" object can be constructed and automatically assigned to collection and delivery.
 * @type {endpointConstraints}
 */
class constraints {
  /**
   * @param {string} minDate The earliest acceptable date for collection or delivery in UTC format with zero offset, "Zulu time".
   * @param {string} openingTime The earliest acceptable time for collection or delivery, in 24 hour format with no seconds.
   * @param {string} closingTime The earliest acceptable time for collection or delivery, in 24 hour format with no seconds.
   * @param {string=} [specialInstructions] [OPTIONAL] Special instructions for this address.
   * @throws {string} 'date must be a string in UTC format with zero offset (yyyy-mm-ddT00:00:00.000Z)'
   * @throws {string} 'openingTime must be a string in 24 hour format'
   * @throws {string} 'closingTime must be a string in 24 hour format'
   * @returns {endpointConstraints} constraints
   */
  constructor(minDate, openingTime, closingTime, specialInstructions) {
    if (!minDate.match(/\d\d\d\d-\d\d-\d\dT00:00:00.\d\d\dZ/)) {
      throw "date must be a string in UTC format (yyyy-mm-ddT00:00:00.000Z)";
    }
    if (!openingTime.match(/[0-2][0-9]:[0-5][0-9]/)) {
      throw "openingTime must be a string in 24 hour format";
    }
    if (!closingTime.match(/[0-2][0-9]:[0-5][0-9]/)) {
      throw "closingTime must be a string in 24 hour format";
    }
    this.minDate = minDate;
    this.openingTime = openingTime;
    this.closingTime = closingTime;
    if (specialInstructions === null) {
      specialInstructions = "";
    }
    if (specialInstructions === undefined) {
      var specialInstructions = "";
    }
    if (typeof specialInstructions === "string") {
      this.specialInstructions = specialInstructions;
    } else {
      throw `constraints expected specialInstructions of type 'string', but got ${typeof specialInstructions}`;
    }
  }
}



class otherDate extends Date {
  constructor() {
    super();
    this.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  }
}


/**
 * @constructor officeHours
 * @param {string=} [specialInstructions] [OPTIONAL] special instructions for this address
 * @throws {string}
 * @returns {endpointConstraints} officeHours
 */
class officeHours extends constraints {
  constructor(specialInstructions) {
    let dayStart = "08:00";
    let dayEnd = "17:00";
    let date = new otherDate();
    let dayOfWeek = date.getDay();
    let offset = 0;
    if (dayOfWeek === 0) {
      offset = 1;
    }
    if (dayOfWeek === 6) {
      offset = 2;
    }
    date = date.addDays(offset);
    date = Utilities.formatDate(date, "GMT+2", 'yyyy-MM-dd\'T\'00:00:00.SSS\'Z\'');
    super(date, dayStart, dayEnd, specialInstructions);
  }
}


/**
 * The class comprising a delivery, and the base class of a collection.
 * @type {boatsenseEndpoint}
 */
class endpoint {
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
    if (address === undefined) {
      throw '"address" of type boatsenseAddress is a required parameter';
    }
    if (contact === undefined) {
      throw '"contact" of type contactPerson is a required parameter';
    }
    if (constraints === undefined) {
      throw '"constraints" of type endpointConstraints is a required parameter';
    }
    this.address = address;
    this.contact = contact;
    this.constraints = constraints;
  }
}


/**
 * Defines a courier collection. A combination of an endpoint, parcels, and a reference.
 * @type {Collection}
 * @property {parcelObject} parcels
 * @property {object} rates
 * @property {string=} [referecnce] - [OPTIONAL] your reference code for this shipment.
 */
class collection {
  /**
   * @constructor
   * @param {boatsenseEndpoint} endpoint The endpoint object for this collection. collectionAddress + contactPerson.
   * @param {parcels} parcels An array of parcel objects.
   * @param {boatsenseAddress}
   * @param {string=} [reference] [OPTIONAL] Your reference number or code for this shipment.
   * @returns {collection}
   */
  constructor(endpoint, parcels, rates, reference) {
    this.parcels = parcels;
    this.address = endpoint.address;
    this.contact = endpoint.contact;
    this.constraints = endpoint.constraints;
    this.rates = rates;
    if (reference !== undefined) {
      this.reference = reference;
    }
  }
}



/**
 * @class parcel {parcelObject}
 */
class parcel {
  /**
   * @param {number} length Length in whole-number centimetres 
   * @param {number} width Width in whole-number centimetres 
   * @param {number} height Height in whole-number centimetres 
   * @param {number} weight Weight in whole-number kilograms 
   * @param {string=} [description] [OPTIONAL] Description of the contents of this parcel
   * @param {number=} [value] [OPTIONAL] Monetary value of this parcel
   * @returns parcelObject
   * @thorws {string} parcel expected description type 'string' but got ${typeof description}
   * @throws {string} parcel expected value type 'number' but got ${typeof value}
   * @throws {string} description expected type string but got ${typeof description}
   */
  constructor(length, width, height, weight, description, value) {

    this.parcel =
    {
      submitted_length_cm: length,
      submitted_width_cm: width,
      submitted_height_cm: height,
      submitted_weight_kg: weight
    };
    this.meta = {};
    if (description !== undefined) {
      if (typeof description === 'string') {
        this.meta.description = description;
      } else { throw `parcel expected description type 'string' but got ${typeof description}` }
    }
    if (value !== undefined) {
      if (typeof value === 'number') {
        this.meta.value = value;
      } else { throw `parcel expected value type 'number' but got ${typeof value}` }
    }
    this.description = (description) => {
      if (typeof description === 'string') {
        this.meta.description = description;
      } else {
        throw `description expected type string but got ${typeof description}`;
      }
    }
    this.value = (value) => {
      if (typeof value === 'number') {
        this.meta.value = value;
      } else {
        throw `value expected type number but got ${typeof value}`;
      }
    }
  }
}



/**
 * A special parcel with discounted rates. Check your courier's definition.
 * @constructor
 */
class standardFlyer extends parcel {
  /** 
   * @returns {parcel} standardFlyer
   */
  constructor (description, value) {
    super(20, 20, 10, 2, description, value)
  }
}



/**
 * Defines data required to request opt-in-rates
 * @class optInRatesQuery
 * @todo submit malformed payload and handle error better
 */
class optInRatesQuery {
  /**
   * @param {boatsenseAddress} collectionAddress
   * @param {boatsenseAddress} deliveryAddress
   * @param {parcels} parcels
   */
  constructor(collectionAddress, deliveryAddress) {
    this.payload = {
      collection_address: collectionAddress.toApi(),
      delivery_address: deliveryAddress.toApi(),
    };
  }
}



/**
 * Defines data required to request rates
 * @class ratesQuery
 * @todo submit malformed payload and handle error better
 */
class ratesQuery {
  /**
   * @param {boatsenseAddress} collectionAddress
   * @param {boatsenseAddress} deliveryAddress
   * @param {parcels} parcels
   * @param {optionalRates=} [optionalRates] [OPTIONAL] The object returned by optInRatesQuery.getrates
   */
  constructor(collectionAddress, deliveryAddress, parcels, optionalRates) {

    if (optionalRates !== undefined) {
      if (optionalRates.hasOwnProperty("opt_in_rates")) {
        payload.opt_in_rates = optionalRates.opt_in_rates;
      }
      if (optionalRates.hasOwnProperty("opt_in_time_based_rates")) {
        payload.opt_in_time_based_rates = optionalRates.opt_in_time_based_rates;
      }
    }

    this.payload = {
      collection_address: collectionAddress.toApi(),
      delivery_address: deliveryAddress.toApi(),
      parcels: parcels.parcels,
      declared_value: parcels.meta.value,
    };
  }
}




/**
 * @class shipment
 * @property {shipmentQuery} payload
 */
class shipment {
  /**
   * @param {collection} collection
   * @param {boatsenseEndpoint} delivery
   */
  constructor(collection, delivery) {
    this.payload =
    {
      collection_address: collection.address.toApi(),
      collection_contact: collection.contact.toApi(),
      delivery_address: delivery.address.toApi(),
      delivery_contact: delivery.contact.toApi(),
      parcels: collection.parcels.parcels,
      collection_min_date: collection.constraints.minDate,
      collection_after: collection.constraints.openingTime,
      collection_before: collection.constraints.closingTime,
      delivery_min_date: delivery.constraints.minDate,
      delivery_after: delivery.constraints.openingTime,
      delivery_before: delivery.constraints.closingTime,
      service_level_code: collection.rates.serviceLevelCode,
      mute_notifications: false,
      customer_reference: collection.reference,
      declared_value: collection.parcels.meta.value,
      opt_in_rates: collection.rates.optInRates,
      opt_in_time_based_rates: collection.rates.optInTimeBasedRates,
      custom_tracking_reference: "",
      special_instructions_collection: collection.constraints.specialInstructions,
      special_instructions_delivery: delivery.constraints.specialInstructions
    };
  }
}
