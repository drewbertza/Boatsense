function getProducts () {

  function fetchThings_() {
    let prods = SpreadsheetApp
    .openById(PropertiesService.getScriptProperties().getProperty('dbSheet'))
    .getSheetByName('Products').getDataRange().getValues().flat();
    return prods
  }

  let things = fetchThings_();
  return things;

}

function getAddressBook() {

  function fetchData_() {
    let sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('dbSheet'))
    .getSheetByName('Address book');
    let rows = sheet.getRange('A2:E3').getValues();  //fix this eventually
    let addresses = [];
    for (let i = 0; i < rows.length; i++) {
      let newAddress = [];
      newAddress.push(rows[i][0])
      for (let j = 1; j < rows[i].length; j++) {
        newAddress.push(` ${rows[i][j]}`);
      }

      address = newAddress.flat();
      addresses.push(address.toString());
    }
    return addresses;
  }
  
  let data = fetchData_();
  return data;

}


function addUser_() { //remove the underscore before saving and running
  let props = PropertiesService.getScriptProperties();
  if (!props.getProperty('users')) {
    props.setProperty("users","[]");
  }
  let user = "";       //email address here
  let users = JSON.parse(PropertiesService.getScriptProperties().getProperty("users"));
  users.push(user);
  props.setProperty("users", JSON.stringify(users));
  Logger.log({added: user});
}



function onFormSubmit(form) {


  Logger.log(form);
  return "ok";

  //do stuff with form here 
  
  // Private Functions
  // -----------------
    function makeBooking_(form) {
    form = JSON.parse(form);
      let booking = {
        collection:
        {
          address:
          {
            suburb: form.colsuburb,
            province: form.colprovince,
            code: form.colcode,
            streetAddress: form.colstreetAddress,
            city: form.colcity,
            company: form.colcompanyName
          },
          contact:
          {
            mobile: form.colmobile,
            email: form.colemail,
            name: form.collcontact
          }
        },
        delivery:
        {
          address:
          {
            streetAddress: form.streetAddress,
            company: form.companyName,
            code: form.code,
            suburb: form.suburb,
            city: form.city,
            province: form.province
          },
          contact:
          {
            name: form.recipient,
            email: form.email,
            mobile: form.mobile
          }
        },
        reference: form.ticket,
        direction: form.direction,
        account: form.accNumber,
        standardPackages: [],
        customPackages: []
      }
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}



function doGet() {
  
  try {
    let user = Session.getActiveUser().getEmail();
    let authorised = authUser_(user);

    if (authorised) {
      let container = HtmlService.createTemplateFromFile('ui');
      return container.evaluate();
    } else {
      throw "You are not authorised to use this service";
    }
  } catch (e) {
    Logger.log({error: e, user: user});
    return HtmlService.createHtmlOutput(e);
  }

  //Private
  function authUser_(user) {
    let users = JSON.parse(PropertiesService.getScriptProperties().getProperty("users"));
    if (users.indexOf(user) > -1) {
      return true;
    } else {
      return false;
    }
  }
}


