/**
 * Create a json/txt file from an object, for inspection/debugging
 * @function objectToFile
 * @todo oAuth scope for Drive can be removed from appsscript.json if you remove this
 * @param {string} fileName Will be appended with '.json'
 * @param {object} object to stringify
 */  
function objectToFile(fileName, object) {
  let objectString = JSON.stringify(object);
  let file = DriveApp.createFile(`${fileName}.json`, objectString);
  let filelink = file.getUrl();
  console.log(filelink);
  return filelink;
}

/**
 * Dummy data for manually testing each component
 */
class test {
  constructor() {

    this.testPerson1 = ['Hon. N. N. Mapisa-Nqakula', '0110000001', 'speaker@example.com'];
    this.testAddress1 = ['120 Plein Street', 'Cape Town City Centre', 'Cape Town', 'Western Cape', '8000', 'ZA', 'Parliament of South Africa'];
    this.testAddress2 = ['1 Government Ave', 'Pretoria', 'Pretoria', 'Gauteng', '0002', 'ZA', 'Union Buildings'];
    this.testPerson2 = ['Pres Cyril Ramaphosa', '0210000001', 'pres@example.com'];

    this.testParcel1 = [45, 15, 15, 1, "Gordon and MacPhail Generations Mortlach 75 Years Old", 500];
    this.testParcel2 = ['Birthday card', 25]

    this.collectionConstraints = new officeHours('Watch out for Julius');
    this.collectionContact = new contactPerson('Hon. N. N. Mapisa-Nqakula', '0110000001', 'speaker@example.com');
    this.collectionAddress = new address('120 Plein Street', 'Cape Town City Centre', 'Cape Town', 'Western Cape', '8000', 'ZA', 'Parliament of South Africa');

    this.deliveryConstraints = new officeHours('THIS IS NOT A REAL COLLECTION');
    this.deliveryContact = new contactPerson('Pres Cyril Ramaphosa', '0210000001', 'pres@example.com');
    this.deliveryAddress = new address('1 Government Ave', 'Pretoria', 'Pretoria', 'Gauteng', '0002', 'ZA', 'Union Buildings');
    this.delivery = new endpoint(this.deliveryAddress, this.deliveryContact, this.deliveryConstraints);

    let parcel1 = new standardFlyer('Birthday card', 25)
    let parcel2 = new parcel(45, 15, 15, 1, "Gordon and MacPhail Generations Mortlach 75 Years Old", 500);
    let parcel3 = new standardFlyer('glitterbomb - priceless');

    this.parcels = makeParcels(parcel1, parcel2, parcel3);

    this.reference = 'test reference';

  }
}

/**
 * Instantiate the test class and test all components step by step
 */ 
function doTest () {
  var consignment = new test();
  this.addressBook = getAddressbook();
  console.log(`Created new consignment:\n ${JSON.stringify(consignment)}`);
  var testOptInRatesRuery = new optInRatesQuery(consignment.collectionAddress, consignment.deliveryAddress);
  console.log(`created test opt query:\n ${JSON.stringify(testOptInRatesRuery)}`);
  var testOptInRates = testOptInRatesRuery.getRates();
  console.log(`opt-in rates: ${JSON.stringify(testOptInRates)}`)
  var testRatesQuery = new ratesQuery(consignment.collectionAddress, consignment.deliveryAddress, consignment.parcels);
  console.log(`test rates query: ${JSON.stringify(testRatesQuery)}`);
  var testRates = testRatesQuery.getRates();
  console.log(`rates: ${JSON.stringify(testRates)}`)
  var testCollection = new endpoint(consignment.collectionAddress, consignment.collectionContact, consignment.collectionConstraints);
  var myRates = testRatesQuery.getCheapestRates();
  var testRef = "HappyBDayMrPresident"
  testCollection = new collection(testCollection, consignment.parcels, myRates, testRef);
  console.log(JSON.stringify(testCollection))
  var testShipment = new shipment(testCollection, consignment.delivery);
  console.log(JSON.stringify(testShipment));
  var id = testShipment.bookShipment();
  console.log(id);
  var waybillTest = testShipment.getWaybill();
  console.log(waybillTest);
}


function builderTest () {
  let testData = new test();
  let testConsignment = new shipmentBuilder()
    .addCollectionContact(...testData.testPerson1)
    .addCollectionAddress(...testData.testAddress1)
    .addDeliveryAddress(...testData.testAddress2)
    .addParcel(...testData.testParcel1)
    .addParcel(...testData.testParcel2)
    .build()
  ;
  testConsignment.bookShipment();
  testConsignment.fetchWaybill();
  let waybill = testConsignment.waybill;
}
