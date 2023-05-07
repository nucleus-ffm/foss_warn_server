var database = require('./databaseHandler'); 
var notifyer = require('./notifyDistributors');

/* const url_and_etags = {
    "mowas": ["https://warnung.bund.de/bbk.mowas/gefahrendurchsagen.json", ""],
    "biwapp": ["https://warnung.bund.de/bbk.biwapp/warnmeldungen.json", ""],
    "katwarn": ["https://warnung.bund.de/bbk.biwapp/warnmeldungen.json", ""],
    "dwd": ["https://warnung.bund.de/bbk.dwd/unwetter.json", ""],
    "lhp": ["https://warnung.bund.de/bbk.lhp/hochwassermeldungen.json", ""],
    // "alertSwiss" : ["https://www.alert.swiss/content/alertswiss-internet/en/home/_jcr_content/polyalert.alertswiss_alerts.actual.json", ""],
    } */

function loadJson() {
    database.getUrlsAndEtags(callAPI);
}


function callAPI(url, etag) {
    console.log(`load json from: url: ${url} etag: ${etag}`);
    fetch(url, {
        method: 'GET',
    }).then(
       (response) => response.json()
    ).then( (data) => filterWarnings(data));
}

function filterWarnings(jsonData) {    
    jsonData.forEach((alert) => {
        let headline = alert['info'][0]['headline'];
        let areas = alert['info'][0]['area'];
        areas.forEach( (area) => {
            let places = area['geocode'];
            // console.log(places);
            places.forEach( (place) => {
                console.log(`warning for ${place['valueName']} ${place['value']} ${headline}`);
                notifyer.notifiyDistribiutors(place['value'], headline);
                }
            )
        })
       }
        );
}


// loadJson();
// database.printTable();
//database.initializeDatabase();

module.exports = {
    loadJson
}
