const path_to_unique_records = `./Records/uniqueOwners.csv`;
const path_to_skip_trace_records = `./Records/skip-traced-data.csv`;

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
function phone_record(number, type, score, last_seen){
  this.number = number;
  this.type = type;
  this.score = score;
  this.last_seen = last_seen;
}

let records = new Map();
const fs = require(`fs`);
const {parse} = require(`csv-parse`);
const ExcelJS = require(`exceljs`);
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
    parseSkipTraceData();
  })
  .on("error", function (error) {
    console.log(error.message);
  });
}

function parseSkipTraceData(){
  let unfound = 0;
  fs.createReadStream(path_to_skip_trace_records)
  .pipe(parse({delimiter: `,`, from_line: 2}))
  .on(`data`, function(row){
    let record = null;

    if(records.get(row[0])){
      record = records.get(row[0]);
    } else if(records.get(`${row[0]} ${row[1]}`)){
      record = records.get(`${row[0]} ${row[1]}`);
    } else {
      unfound++;
    }

    if(record){
      for(let i = 17; i < 57; i+=4){
        if(row[i]){
          record.phone_records.push(new phone_record(row[i], row[i+1], row[i+2], row[i+3]))
        }
      }
      for(let i = 57; i < 60; i++){
        if(row[i]){
          record.emails.push(row[i]);
        }
      }
    }
  })
  .on("end", function () {
    console.log(`Skip Trace Records Unable to Be Matched with Data: ${unfound}`);
    let lead_array = [];
    Array.from(records.keys()).forEach(key=>{
      if(records.get(key).properties.length > 2){
        lead_array.push(records.get(key));
      }
    });
    lead_array.sort((a, b)=>b.properties.length - a.properties.length)
    generateRecordWorksheet(lead_array);
  })
  .on("error", function (error) {
    console.log(error.message);
  });
}

async function generateRecordWorksheet(records_array){
  const invalid = `ffe3e0`;
  const valid = `deffcf`;
  const fileName = `./leads.xlsx`;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = `Justin Clark`;
  workbook.created = new Date();
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.views = [
    {
      x:0,
      y:0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 0,
      visibility: `visible`
    }
  ];
  const indexSheet = workbook.addWorksheet(`Index`);
  indexSheet.getColumn(1).width = 30;
  indexSheet.getColumn(2).width = 30;
  indexSheet.addRow([`Lead Name:`, `Purchases In the Last Year`]);
  for(let i = 0; i < records_array.length; i++){
    const record  = records_array[i];
    const record_name = record.full_name.length > 30 ? record.full_name.slice(0,30) : record.full_name;
    const contactInfoPresent = !(record.emails.length === 0 && record.phone_records.length === 0);
    indexSheet.addRow([``, record.properties.length]);
    indexSheet.getCell(`A${i+2}`).value = {
      text: record_name,
      hyperlink: `#${record_name}`
    };
    indexSheet.getCell(`B${i+2}`).value = record.properties.length;

    const sheet = workbook.addWorksheet(record.full_name.length > 30 ? record.full_name.slice(0,30) : record.full_name, {properties: {tabColor: {argb: contactInfoPresent ? `befaa2` : `f5b39f`}}});
    sheet.getColumn(1).width = 25;
    sheet.getColumn(2).width = 10;
    sheet.getColumn(3).width = 20;
    sheet.getColumn(4).width = 20;
    sheet.getColumn(5).width = 20;
    const returnRow = sheet.addRow([]);
      returnRow.height = 20;
    sheet.getCell(`A1`).value = {
      text: `Return to Index`,
      hyperlink: `#Index`
    }
    const nameRow = sheet.addRow([`${record.full_name}`]);
      nameRow.font = {size: 16, bold: true};
      nameRow.height = 30;
    sheet.addRow([]);
    sheet.addRow([`Emails:`])
      .font = {size: 13, bold: true, underline: true};
    record.emails.forEach(email=>{
      sheet.addRow([email])
    })

    sheet.addRow([]);
    sheet.addRow([`Phone`])
      .font = {size: 13, bold: true, underline: true};
    sheet.addRow([`Number`, `Type`, `Confidence`, `Last Used`])
      .font = {size: 12, bold: true};
    record.phone_records.forEach(entry=>{
      sheet.addRow([`(${entry.number.slice(0,3)}) ${entry.number.slice(3,6)}-${entry.number.slice(6,10)}`, entry.type, entry.score, entry.last_seen])
    })

    sheet.addRow([]);
    sheet.addRow([`Mailing Addresses:`])
      .font = {size: 13, bold: true, underline: true};
    sheet.addRow([`Address`, `Address2`, `City`, `State`, `ZIP`, `Appearances`])
      .font = {size: 12, bold: true};
    record.mailing_records.sort((a,b)=>b.appearances-a.appearances)
    record.mailing_records.forEach(entry=>{
      sheet.addRow([entry.address, entry.address2, entry.city, entry.state, entry.zip, entry.appearances]);
    })

    sheet.addRow([]);
    sheet.addRow([`Properties Purchased In The Last 365 Days With No Existing Mortgage (${record.properties.length}):`])
      .font = {size: 13, bold: true, underline: true};
    sheet.addRow([`Address`, `Address2`, `City`, `State`, `ZIP`])
      .font = {size: 12, bold: true};
    record.properties.sort((a,b)=>a.city.localeCompare(b.city, `en`, {sensitivity: `base`}));
    record.properties.forEach(property => {
      sheet.addRow([property.address, property.address2, property.city, property.state, property.zip])
    })
  }
  
  await workbook.xlsx.writeFile(fileName);
}