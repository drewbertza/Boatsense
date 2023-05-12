
/**
 * Builder class for booking shipments
 */
class shipmentBuilder {
  
  /**
   * @constructor
   * @returns {shipmentBuilder}
   */
  constructor() {

    this.deliveryContact = null;
    this.deliveryAddress = null;
    this.deliveryConstraints = null;
    this.deliveryInstructions = null;
    this.collectionContact = null;
    this.collectionAddress = null;
    this.collectionConstraints = null;
    this.collectionInstructions = null;
    this.packages = [];
    this.reference = null;
    this.rates = null;

    /**
     * Add a contact person for delivery
     * @function addDeliveryContact
     * @memberof shipmentBuilder
     * @inner
     * @implements {contactPerson}
     * @param {string} name The contact person's name.
     * @throws {string} '"name" is required'
     * @param {string=} [email] [OPTIONAL] Provide at least one email or one mobile number, but no more than one of each.
     * @param {string=} [mobileNumber] [OPTIONAL] Provide at least one email or one mobile number, but no more than one of each.
     * @throws {string} 'at least one of "mobileNumber" or "email" is required'
     * @returns {shipmentBuilder} Updated instance of the shipment builder
     */
    this.addDeliveryContact = (name, mobileNumber, email) => {
      this.deliveryContact = new contactPerson(name, mobileNumber, email);
      return this;
    };

    /**
     * Add a contact person for collection
     * @function addCollectionContact
     * @memberof shipmentBuilder
     * @inner
     * @implements {contactPerson}
     * @param {string} name The contact person's name.
     * @throws {string} '"name" is required'
     * @param {string=} [email] [OPTIONAL] Provide at least one email or one mobile number, but no more than one of each.
     * @param {string=} [mobileNumber] [OPTIONAL] Provide at least one email or one mobile number, but no more than one of each.
     * @throws {string} 'at least one of "mobileNumber" or "email" is required'
     * @returns {shipmentBuilder} Updated instance of the shipment builder
     */
    this.addCollectionContact = function (name, mobileNumber, email) {
      this.collectionContact = new contactPerson(name, mobileNumber, email);
      return this;
    }

    /**
     * Add a delivery address to your shipment
     * @function addDeliveryAddress
     * @memberof shipmentBuilder
     * @inner
     * @implements {address}
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
     * @throws {string} '"type" must be "residential", "business", or "locker"'
     * @throws {string} '"country" must be 2-letter country code'
     * @returns {shipmentBuilder} Updated instance of the shipment builder
     */
    this.addDeliveryAddress = (streetAddress, suburb, city, province, code, country, company, addressType, lat, lng) => {
      this.deliveryAddress = new address(streetAddress, suburb, city, province, code, country, company, addressType, lat, lng);
      return this;
    };

    /**
     * Add the earliest acceptable delivery date, and available hours for delivery
     * @function addDeliveryConstraints
     * @memberof shipmentBuilder
     * @inner
     * @implements {constraints}
     * @returns {shipmentBuilder} Updated instance of the shipment builder
     */
    this.addDeliveryConstraints = function (minDate, openingTime, closingTime, specialInstructions) {
      this.deliveryConstraints = new constraints(minDate, openingTime, closingTime, specialInstructions);
      return this;
    };

    /**
     * Add instructions for the delivery driver
     * @function addDeliveryInstructions
     * @memberof shipmentBuilder
     * @inner
     * @param {string} instructions Special instructions for the delivery driver
     * @returns {shipmentBuilder} Updated instance of the shipment builder
     */
    this.addDeliveryInstructions = function (instructions) {
      if (typeof instructions !== "string") {
        throw 'Instructions must be of type string'
      } else {
        this.deliveryInstructions = instructions;
        return this;
      }
    }

    /**
     * Add a collection address to your shipment. config.defaultAddress will be used if no collection address is provided.
     * @function addCollectionAddress
     * @memberof shipmentBuilder
     * @inner
     * @implements {address}
     * @param {string=} [addressType] The type of address
     * @param {string=} [company] [OPTIONAL] company name
     * @param {string} streetAddress
     * @param {string} city City or town
     * @param {string} suburb Called "local_area" in API calls and therefore in the returned object
     * @param {string} province Called "zone" in API calls and therefore in the returned object
     * @param {string} code 4-digit postal code
     * @param {string=} [country] 2-letter contry code. Since most couriers won't accept international shipmens without prior arrangement, this should be limited to your country.
     * @param {number=} [lat] [OPTIONAL] Optional latitude. The API will attempt geocoding if lat and lng are not passed.
     * @param {number=} [lng] [OPTIONAL] Optional longitude.The API will attempt geocoding if lat and lng are not passed.
     * @throws {string} '"type" must be "residential" or "business"'
     * @throws {string} '"country" must be 2-letter country code'
     * @returns {shipmentBuilder} Updated instance of the shipment builder
     */
    this.addCollectionAddress = function (streetAddress, suburb, city, province, code, country, company, addressType, lat, lng) {
      this.collectionAddress = new address(streetAddress, suburb, city, province, code, country, company, addressType, lat, lng);
      return this;
    };

    /**
    * Add the earliest acceptable collection date, and available hours for collection
    * @function addDeliveryConstraints
    * @memberof shipmentBuilder
    * @inner
    * @implements {constraints}
    * @returns {shipmentBuilder} Updated instance of the shipment builder
    */
    this.addDeliveryConstraints = function (minDate, openingTime, closingTime, specialInstructions) {
      this.deliveryConstraints = new constraints(minDate, openingTime, closingTime, specialInstructions);
      return this;
    };

    /**
     * @function addCollectionInstructions
     * @memberof shipmentBuilder
     * @inner
     * Add instructions for the collection driver
     * @param {string} instructions Special instructions for the delivery driver
     * @returns {shipmentBuilder} Updated instance of the shipment builder
     */
    this.addCollectionInstructions = function (instructions) {
      if (typeof instructions !== "string") {
        throw 'Instructions must be of type string'
      } else {
        this.collectionInstructions = instructions;
        return this;
      }
    };

    /**
     * @function addParcel
     * @memberof shipmentBuilder
     * @inner
     * Add a parcel to the array of parcels for this shipment
     * @implements {parcel}
     * @returns {shipmentBuilder} the updated instance of the shipment builder
     */
    this.addParcel = function (length, width, height, weight, description, value) {
      let newParcel = new parcel(length, width, height, weight, description, value);
      this.packages.push(newParcel);
      return this;
    };

    /**
     * @function addReference
     * Add your refernce for this shipment
     * @param {string} reference Your reference for this shipment
     * @returns {shipmentBuilder} the updated instance of the shipment builder
     */
    this.addReference = function (reference) {
      if (typeof reference !== "string") {
        throw 'Type of reference must be string';
      } else {
        this.reference = reference;
        return this;
      }
    };

    /**
     * @function addRates
     * @memberof shipmentBuilder
     * @inner
     * @param {rates} rates
     * @returns {shipmentBuilder} the updated instance of the shipment builder
     */
    this.addRates = function (rates) {
      this.rates = rates;
      return this;
    }

    /**
     * Add the cheeapest available rates
     * @function addCheapestRates
     * @memberof shipmentBuilder
     * @inner
     * @returns {shipmentBuilder} Updated instance of the shipment builder
     */
    this.addCheapestRates = function () {
      let theseParcels = makeParcels(...this.packages);
      let ratesCheck = new ratesQuery(this.collectionAddress, this.deliveryAddress, theseParcels);
      ratesCheck.getRates();
      let cheapest = ratesCheck.getCheapestRates();
      this.rates = cheapest;
      return this;
    }

    /**
     * @function
     * @reaturns {}
     */
    this.build = () => {
      console.log('Building new shipment');

      //check for errors

      if (this.packages.length === 0) {
        throw 'No parcels provided. Please add parcels to this shipment before calling build();'
      }

      if (this.collectionAddress === null && this.deliveryAddress === null) {
        throw 'No collection or delivery address provided. At least one address must be provided';
      }

      if (this.collectionAddress === null && this.deliveryAddress === null) {
        throw 'No collection or delivery address provided. At least one address must be provided';
      }

      var missingAddress;
      if (this.collectionAddress === null || this.deliveryAddress === null) {
        if (this.collectionAddress === null) {
          var missingAddress = 'collection';
        } else {
          if (this.deliveryAddress === null) {
            missingAddress = 'delivery';
          }
        }
      }


      var missingContact;
      if (this.collectionContact === null || this.deliveryContact === null) {
        if (this.collectionContact === null) {
          var missingContact = 'collection';
        } else {
          if (this.deliveryContact === null) {
            var missingContact = 'delivery';
          }
        }
      }

      if (config.defaultAddress === undefined || config.defaultAddress === null || config.defaultAddress === "") {
        throw `No ${missingAddress} address provided, and no default address configured for fallback.` 
               +`Please provide a ${missingAddress} or set a default address in config.defaultAddress`;
      } else {
        this[`${missingAddress}Address`] = config.defaultAddress;
      }

      if (config.defaultContact === undefined || config.defaultContact === null || config.defaultContact === "") {
        throw `No ${missingContact} contact person provided, and no default contact configured for fallback.`
               +`Please provide a ${missingContact} contact or set a default address in config.defaultContact`;
      } else {
        this[`${missingContact}Contact`] = config.defaultContact;
      }

      if (missingContact !== undefined && missingAddress !== undefined) {
        if (missingContact !== missingAddress) {
          throw `No ${missingAddress} address provided, and no ${missingContact} contact provided.`
                +`Missing parameters bcan usually be replaced with default values, but in this case, that would make no sense. Aborting`
        }
      }
      //error checks done


      if (this.deliveryConstraints === null) {
        console.log('No delivery constraints provided. Delivery will be booked for office hours')
        this.deliveryConstraints = new officeHours(this.deliveryInstructions)
      }


      if (this.collectionConstraints === null) {
        console.log('No collection constraints provided. Collection will be booked for office hours')
        this.collectionConstraints = new officeHours(this.collectionInstructions)
      }


      let collectionEndpoint = new endpoint(this.collectionAddress, this.collectionContact, this.collectionConstraints);


      let deliveryEndpoint = new endpoint(this.deliveryAddress, this.deliveryContact, this.deliveryConstraints)


      let newParcels = makeParcels(...this.packages);


      if (this.rates === null) {
        console.log('No rates provided. Fetching rates...')
        let ratesCheck = new ratesQuery(this.collectionAddress, this.deliveryAddress, newParcels);
        ratesCheck.getRates();
        console.log('Shipment will be booked with the cheapest available rates');
        this.rates = ratesCheck.getCheapestRates();
      }


      let newCollection = new collection(collectionEndpoint, newParcels, this.rates, this.reference);


      return new shipment(newCollection, deliveryEndpoint);
    }
  }
}
