import * as fs from 'fs';
import * as cheerio from "cheerio";
import { sql } from 'drizzle-orm';
import {db, costcoLocationsInCostco, gasPricesInCostco} from '#db'

const WEBSITE_URL = 'https://aruljohn.com/gas/ca';
const TEST_URL = undefined//'src/scrapers/costco/test_costco_prices.htm'
const GAS_MAPPINGS = {
    regular: 0,
    premium: 1,
    diesel: 2
};

// given row, and the column index of table
// return gas price or null if not present
function findGas($, row, index){
    let gas = $(row).find('td.dlr').eq(index).text();
    if(gas == '--'){
        gas = null;
    }
    else {
        gas = parseFloat(gas);
    }
    return gas;
}

// update the location name if it changes, insert if new
// we assume location name is likelier to change than address
async function upsertLocations(locations) {
    await db.insert(costcoLocationsInCostco)
        .values(locations)
        .onConflictDoUpdate({
            target: [
                costcoLocationsInCostco.street, 
                costcoLocationsInCostco.city, 
                costcoLocationsInCostco.state
            ],
            set: {
                name:sql`excluded.name`,
                updatedAt:sql`CURRENT_TIMESTAMP`,
            },

        });
}

// insert only into gas price table, no update existing data
async function insertGasPrices(gasPrices){
    await db.insert(gasPricesInCostco)
        .values(gasPrices)
        .onConflictDoNothing();
}

// scrape the original website for data
// returns two objects: locations and price data in same data structure as table schema
async function scrapeData(){
    var $ = null;

    var locations = [];
    var prices = [];

    if(TEST_URL){
        const buffer = fs.readFileSync(TEST_URL);

        $ = cheerio.loadBuffer(buffer);
    }
    else {
        $ = await cheerio.fromURL(WEBSITE_URL);
    }

    $('table.content-table tbody tr').each((i, row) => {
        let locationName = $(row).find('.citystate').text();
        
        // business centers typically don't have gas stations
        if(!locationName.includes("Business Center")){

            // break down the element to pull appropriate data
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

            Object.keys(GAS_MAPPINGS).forEach((gasType) => {
                let price = findGas($, row, GAS_MAPPINGS[gasType]);
                if(price){
                    prices.push({
                        street: street,
                        city: city,
                        state: state,
                        gasType: gasType,
                        price: price
                    });
                }
            });
        }
    });

    return {locations, prices};
}

// scrape the data, insert into database: ultimately updates tables with fresh data
async function updateCostcoPrices(){
    const {locations, prices} = await scrapeData();
    await upsertLocations(locations);
    await insertGasPrices(prices);
}

await updateCostcoPrices();