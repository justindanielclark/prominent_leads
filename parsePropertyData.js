const path_to_unique_records = `./Records/uniqueOwners.csv`;

function lead_record(full_name, first_name, last_name){
  this.full_name = full_name;
  this.first_name = first_name;
  this.last_name = last_name;
  this.phone_records = [];
  this.emails = [];
  this.mailing_records = [];
  this.properties = [];
}
lead_record.prototype.addMailingRecord = function(property_address, property_address2, property_city, property_state, property_zip){
  for(let i = 0; i < this.mailing_records.length; i++){
    if(this.mailing_records[i].address === property_address && this.mailing_records[i].city === property_city && this.mailing_records[i].state === property_state){
      this.mailing_records[i].appearances++;
      return;
    }
  }
  let new_property_record = new property_record(property_address, property_address2, property_city, property_state, property_zip);
  new_property_record.appearances = 1;
  this.mailing_records.push(new_property_record);
}
lead_record.prototype.addPropertyRecord = function(property_address, property_address2, property_city, property_state, property_zip){
  for(let i = 0; i < this.properties.length; i++){
    if(this.properties[i].address === property_address && this.properties[i].city === property_city && this.properties[i].state === property_state){
      return;
    }
  }
  this.properties.push(new property_record(property_address, property_address2, property_city, property_state, property_zip));
}
function property_record(address, address2, city, state, zip){
  this.address = address;
  this.address2 = address2;
  this.city = city;
  this.state = state;
  this.zip = zip;
}

let records = new Map();
const fs = require(`fs`);
const {parse} = require(`csv-parse`);
parseBulkPropertyData();

function parseBulkPropertyData(){
  fs.createReadStream(path_to_unique_records)
  .pipe(parse({delimiter: `,`, from_line: 2}))
  .on(`data`, function(row){
    if(typeof records.get(row[0]) === `undefined`){
      let new_record = new lead_record(row[0],row[1], row[2]);
      records.set(new_record.full_name, new_record)
      new_record.addPropertyRecord(row[8], row[9], row[10], row[11], row[12]);
      new_record.addMailingRecord(row[3], row[4], row[5], row[6], row[7]);
    } else {
      records.get(row[0]).addMailingRecord(row[3], row[4], row[5], row[6], row[7]);
      records.get(row[0]).addPropertyRecord(row[8], row[9], row[10], row[11], row[12]);
    }
  })
  .on("end", function () {
    let lead_array = [];
    Array.from(records.keys()).forEach(key=>{
      if(records.get(key).properties.length > 2){
        lead_array.push(records.get(key));
      }
    });
    lead_array.sort((a, b)=>b.properties.length - a.properties.length)
    console.log(lead_array[121]);

  })
  .on("error", function (error) {
    console.log(error.message);
  });
}