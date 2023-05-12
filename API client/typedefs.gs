/**
 * @fileoverview typedfs
 * It's called "a file for typedefs" so that clasp will keep it at the top when pushing, otherwise the JSDoc breaks.
 * @todo add all the api call type strings
 * @todo remove obsolete types
 */

/**
 * @typedef apiRequest
 * @property {object} payload
 * @property {string} type
 */

/**
 * @typedef shipmentQuery
 * @property {object} collection_address
 * @property {object} collection_contact
 * @property {object} delivery_address
 * @property {object} delivery_contact
 * @property {array.<object>} parcels
 * @property {string} collection_min_date
 * @property {string} collection_after
 * @property {string} collection_before
 * @property {string} delivery_min_date
 * @property {string} delivery_after
 * @property {string} delivery_before
 * @property {string} service_level_code
 * @property {boolean} mute_notifications
 * @property {string} customer_reference
 * @property {number} declared_value
 * @property {array} opt_in_rates
 * @property {array} opt_in_time_based_rates
 * @property {string} custom_tracking_reference
 * @property {string} special_instructions_collection
 * @property {string} special_instructions_delivery
 */

/**
 * An address object as implemented by Boatsense
 * @typedef {object} boatsenseAddress
 * @property {string} type - the type of address ("residential", "business", or "locker"). Called "type" in API calls.
 * @property {string=} [company] - [OPTIONAL] company name
 * @property {string} streetAddress - Street Address
 * @property {string} city - City or town
 * @property {string} suburb - Called "local_area" in API calls
 * @property {string} province - Called "zone" in API calls
 * @property {string} code - 4-digit postal code
 * @property {string} country - 2-letter contry code.
 * @property {number=} [lat] - [OPTIONAL] Optional latitude. The API will attempt geocoding if lat and long are not passed.
 * @property {number=} [lng] - [OPTIONAL] Optional longitude. The API will attempt geocoding if lat and long are not passed.
 */

/**
 * An address object as required by the Shiplogic API
 * @typedef {object} apiAddress
 * @property {string} type - the type of address ("residential", "business", or "locker"). Called "type" in API calls.
 * @property {string=} [company] - [OPTIONAL] company name
 * @property {string} street_address - Called "streetAddress" in this library
 * @property {string} city - City or town
 * @property {string} local_area - Called "suburb" in this library
 * @property {string} zone - Called "province" in this library
 * @property {string} code - 4-digit postal code
 * @property {string} country - 2-letter contry code.
 * @property {number=} [lat] - [OPTIONAL] Optional latitude. The API will attempt geocoding if lat and long are not passed.
 * @property {number=} [lng] - [OPTIONAL] Optional longitude. The API will attempt geocoding if lat and long are not passed.
 */


/** 
* @typedef {object} endpointConstraints
* @property {string} minDate - The earliest acceptable date for collection or delivery in UTC format with zero offset, "Zulu time". Courier times may vary and certain dates will not be available depending on selected rates.
* @property {string} openingTime - The earliest acceptable time for collection or delivery, in 24 hour format with no seconds, "00:00" to "23:59" although courier times and rates may vary.
* @property {string} closingTime - The earliest acceptable time for collection or delivery, in 24 hour format with no seconds, "00:00" to "23:59" although courier times and rates may vary.
* @property {string=} [specialInstructions]
*/

/**
 * Defines the properties of a delivery, and the base class for a collection.  One end of a shipment. Two endpoints plus parcels plus rates plus a reference is a shipment. The combination of a boatsenseAddress, a contactPerson for that address, endpointconstraints, and optional special instructions.
 * @typedef boatsenseEndpoint
 * @property {boatsenseAddress} address
 * @property {contactperson} contact
 * @property {endpointConstraints} constraints
 */

/**
 * @typedef {object} optionalRates
 * @property {array.<object>=} [opt_in_rates]
 * @property {array.<object>=} [opt_in_time_based_rates]
 */

//this object is for the shipment call
/**
 * The type of object required to book a shipment
 * @typedef {object} rates
 * @property {array.<number>} optInRates
 * @property {array.<number} optInTimeBasedRates
 * @property {(string|array.<string>)} serviceLevelCode
 */

/**
 * @typedef availableRates
 * @property {number} rate Monetary charge
 * @property {number} serviceLevelId Numberic code for API
 * @property {string} serviceLevelCode 3-letter string code for API
 * @property {string} serviceLevelName Service name
 * @property {string} deliveryDate Estimated delivery date in format "2023-04-21T13:49:19.765429661+02:00"
 */

/**
 * @typedef {object} parcel
 * @property {number} length - submitted_length_cm length in whole-number centimetres 
 * @property {number} width - submitted_width_cm length in whole-number centimetres 
 * @property {number} height - submitted_height_cm length in whole-number centimetres 
 * @property {number} weight - submitted_weight_kg weight in whole-number kilograms 
 */

/**
 * @typedef {object} parcelMeta
 * @property {number} value
 * @property {string} description
 */

/**
 * @typedef {object} parcelObject
 * @property {parcel} parcel
 * @property {parcelMeta=} [meta]
 */

/**
 * Defines the parcels array for submitting to API. Can have length >= 1
 * @typedef {object} parcels
 * @property {Array.<parcel>} parcels - the array of parcels to be passed to the API
 * @property {parcelMeta} meta
 */

/**
 * A contact person for a collection or delivery. At least one contact method (email or mobile numebr) must be provided
 * @typedef contactperson
 * @property {string} name - The contact person's name.
 * @property {string=} [email] - [OPTIONAL] The contact person's email address.
 * @property {string=} [mobileNumber] - [OPTIONAL] The contact person's phone number (doesn't actually have to be a mobile number, but mobile is preferred).
 */ 


/**
 * @typedef {object} collection
 * @extends boatsenseEndpoint
 * @property {parcels} parcels
 * @property {object} rates
 * @property {string=} [reference]
 */
