var database = require('./databaseHandler'); 

// call the database which then calls the callack
// sendNotification with the result
function notifiyDistribiutors(geocode, headline) {
    database.getAllDistributorUrlsForGeocode(geocode, sendNotification, headline);
}

// called with the data from the database
// call the distributor and send the warning
function sendNotification(url, headline) {
    console.log(url, headline);
    // call distributor
    fetch(url, {
        method: 'POST', // PUT works too
        body: `New warning: ${headline}`
    })
}

module.exports = {
    notifiyDistribiutors
}