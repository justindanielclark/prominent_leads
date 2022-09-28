function skip_trace_record(
  first_name, 
  last_name, 
  property_address, 
  property_city, 
  property_state, 
  property_zip, 
  mailing_address, 
  mailing_city, 
  mailing_state, 
  mailing_zip, 
  preferred_mailing_address, 
  preferred_mailing_address2, 
  preferred_mailing_city, 
  preferred_mailing_state, 
  preferred_mailing_zip, 
  preferred_mailing_date_first_seen, 
  preferred_mailing_date_last_seen, 
  phone_number0, phone_type0, phone_score0, phone_last_seen0,
  phone_number1, phone_type1, phone_score1, phone_last_seen1,
  phone_number2, phone_type2, phone_score2, phone_last_seen2,
  phone_number3, phone_type3, phone_score3, phone_last_seen3,
  phone_number4, phone_type4, phone_score4, phone_last_seen4,
  phone_number5, phone_type5, phone_score5, phone_last_seen5,
  phone_number6, phone_type6, phone_score6, phone_last_seen6,
  phone_number7, phone_type7, phone_score7, phone_last_seen7,
  phone_number8, phone_type8, phone_score8, phone_last_seen8,
  phone_number9, phone_type9, phone_score9, phone_last_seen9,
  email, email2, email3,
  date_of_death, deceased, bankruptcy, judgement, litigator, lien, fail_reason, date_of_last_pull){
    this.name = {
      first: first_name,
      last: last_name
    };
    this.property_address = {
      address: property_address,
      city: property_city,
      state: property_state,
      zip: property_zip
    };
    this.mailing_address = {
      address: mailing_address,
      city: mailing_city,
      state: mailing_state,
      zip: mailing_zip
    };
    this.preferred_mailing_address = {
      address: preferred_mailing_address,
      address2: preferred_mailing_address2,
      city: preferred_mailing_city,
      state: preferred_mailing_state,
      zip: preferred_mailing_zip,
      first_seen: preferred_mailing_date_first_seen,
      last_seen: preferred_mailing_date_last_seen,
    };
    this.phone_records = [
      {
      number: phone_number0,
      type: phone_type0,
      score: phone_score0,
      last_seen: phone_last_seen0,
      },
      {
        number: phone_number1,
        type: phone_type1,
        score: phone_score1,
        last_seen: phone_last_seen1,
      },
      {
        number: phone_number2,
        type: phone_type2,
        score: phone_score2,
        last_seen: phone_last_seen2,
      },
      {
        number: phone_number3,
        type: phone_type3,
        score: phone_score3,
        last_seen: phone_last_seen3,
      },
      {
        number: phone_number4,
        type: phone_type4,
        score: phone_score4,
        last_seen: phone_last_seen4,
      },
      {
        number: phone_number5,
        type: phone_type5,
        score: phone_score5,
        last_seen: phone_last_seen5,
      },
      {
        number: phone_number6,
        type: phone_type6,
        score: phone_score6,
        last_seen: phone_last_seen6,
      },
      {
        number: phone_number7,
        type: phone_type7,
        score: phone_score7,
        last_seen: phone_last_seen7,
      },
      {
        number: phone_number8,
        type: phone_type8,
        score: phone_score8,
        last_seen: phone_last_seen8,
      },
      {
        number: phone_number9,
        type: phone_type9,
        score: phone_score9,
        last_seen: phone_last_seen9,
      }
    ];
    this.email_records = [email, email2, email3];
    this.date_of_death = date_of_death;
    this.deceased = deceased;
    this.bankruptcy = bankruptcy;
    this.judgement = judgement;
    this.litigator = litigator;
    this.lien = lien;
    this.skip_data = {
      fail_reason: fail_reason,
      date_of_last_pull: date_of_last_pull
    }

}

const skip_trace_records = new Map();
const skip_trace_path = '';
const fs = require(`fs`);
const {parse} = require(`csv-parse`);
const inputStream = fs.createReadStream(skip_trace_path)
  .pipe(parse({delimiter: `,`, from_line: 2}))
  .on(`data`, function(row){
    let new_skip_trace_record = new skip_trace_record(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8],row[9],row[10],row[11],row[12],row[13],row[14],row[15],row[16],row[17],row[18],row[19],row[20],row[21],row[22],row[23],row[24],row[25],row[26],row[27],row[28],row[29],row[30],row[31],row[32],row[33],row[34],row[35],row[36],row[37],row[38],row[39],row[40],row[41],row[42],row[43],row[44],row[45],row[46],row[47],row[48],row[49],row[50],row[51],row[52],row[53],row[54],row[55],row[56],row[57],row[58],row[59],row[60],row[61],row[62],row[63],row[64],row[65],row[66],row[67]);
  })
  .on("end", function () {

    // const outputStream = fs.createWriteStream(`./Output/output.csv`);
    // outputStream.write(`Count,Full Name,First Name,Last Name,Mailing Address,Mailing Address 2,Mailing City,Mailing State,Mailing Zip,Property Address,Property Address 2,Property City,Property State,Property Zip\r\n`);
    // for(let record of sortedArray){
    //   outputStream.write(record.join(",")+`\r\n`)
    // }
    // outputStream.end();

  })
  .on("error", function (error) {
    console.log(error.message);
  });