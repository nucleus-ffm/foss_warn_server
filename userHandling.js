var database = require('./databaseHandler');

// register new client in the database 
function registerSubscription(request) {
    console.log("handle registration");
    // console.log(request.body);
    console.log(`Distributor url: ${request.body.distributor_url}`);
    console.log(`First Geocode: ${request.body.geocode}`);

    if(request.body.distributor_url != "" && request.body.geocode != "") {
        // store distributor URL in Database
        database.insertNewClient(
            request.body.distributor_url,
            request.body.geocode);
    } else {
        console.log("distributor_url or geocode is empty")
    }

}

// update client in database
function updateSubscription (request) {
    console.log("handle update");
    console.log(`Distributor url: ${request.body.distributor_url}`);
    console.log(`new_geocode: ${request.body.new_geocode}`);
    console.log(`remove_geocode: ${request.body.remove_geocode}`);

    // update database
    database.updateClient(
        request.body.distributor_url,
        request.body.new_geocode,
        request.body.remove_geocode);
}

// remove client from database
function removeSubscription (request) {
    console.log("handle remove");
    console.log(`Distributor url: ${request.body.distributor_url}`);
    console.log(`reason: ${request.body.reason}`); //@todo do something

    // remove client from database
    database.removeClient(request.body.distributor_url);
}

module.exports = {
    registration: registerSubscription,
    update: updateSubscription,
    remove: removeSubscription
}
