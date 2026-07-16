import * as fs from 'fs';
import * as cheerio from "cheerio";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const WEBSITE_URL = 'https://aruljohn.com/gas/ca';
const TEST_URL = undefined//'./src/scrapers/test_costco_prices.htm'
const GAS_MAPPINGS = {
    regular: 0,
    premium: 1,
    diesel: 2
};

// given row, and the column index of table
// return gas price or null if not present
function findGas(row, index){
    let gas = $(row).find('td.dlr').eq(index).text();
    if(gas == '--'){
        gas = null;
    }
    else {
        gas = parseFloat(gas);
    }
    return gas;
}




var $ = null;

if(TEST_URL){
    const buffer = fs.readFileSync(TEST_URL);

    $ = cheerio.loadBuffer(buffer);
}
else {
    $ = await cheerio.fromURL(WEBSITE_URL);
}

var locations = [];

var prices = [];

//console.log($('content-table'))
$('table.content-table tbody tr').each((i, row) => {
    let locationName = $(row).find('.citystate').text();
    
    // business centers typically don't have gas stations
    if(!locationName.includes("Business Center")){
        let address = $(row).find('.address').html().split("<br>");
        let street = address[0];

        let cityState = address[1].trim().split(",");
        let city = cityState[0];

        let [state, zip] = cityState[1].trim().split(" ");

        locations.push({
            street: street,
            city: city,
            state: state,
            name: locationName,
            zip: zip
        });

        console.log(locationName, street, city, state, zip);

        Object.keys(GAS_MAPPINGS).forEach((gasType) => {
            let price = findGas(row, GAS_MAPPINGS[gasType]);
            if(price){
                prices.push({
                    street: street,
                    city: city,
                    state: state,
                    gas_type: gasType,
                    price: price
                });
                console.log(gasType, price);
            }
        });
        console.log(prices);
    }


});
//console.log(web_page);