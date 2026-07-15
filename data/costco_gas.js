import * as fs from 'fs';
import * as cheerio from "cheerio";


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

const WEBSITE_URL = 'https://aruljohn.com/gas/ca';
const TEST_URL = undefined//'./test_costco_prices.htm'

var web_page = null;
var $ = null;

if(TEST_URL){
    const buffer = fs.readFileSync(TEST_URL);

    $ = cheerio.loadBuffer(buffer);
}
else {
    $ = await cheerio.fromURL(WEBSITE_URL);
}

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


        console.log(locationName, street, city, state, zip);

        let regular = findGas(row, 0);
        let premium = findGas(row, 1);
        let diesel = findGas(row, 2);

        console.log(regular, premium, diesel);
    }


});
//console.log(web_page);