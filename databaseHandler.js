const sqlite3 = require('sqlite3').verbose();

// store the database in global var
var db = initializeDatabase();

// open the database and creates the tables return the database
function initializeDatabase() {
    let db = openDatabase();
    createTable(db);
    return db;
}

// open the database and returns it
function openDatabase() {
    return new sqlite3.Database('./db/clients', (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
      });
}

// creates tables if they not exists and fills the url table with data
function createTable(db) {
    db.run('CREATE TABLE IF NOT EXISTS clients (ID INTEGER PRIMARY KEY AUTOINCREMENT, distributor_url varchar(255) NOT NULL, geocode varchar(255) NOT NULL);', [], (err, rows) => {
      if (err) {
        throw err;
      }
    });

    db.run('CREATE TABLE IF NOT EXISTS urls (ID INTEGER PRIMARY KEY AUTOINCREMENT, url varchar(255) NOT NULL, etag varchar(255));', [], (err, rows) => {
      if (err) {
        throw err;
      }
    })

    db.run(`INSERT OR REPLACE INTO urls (ID, url) VALUES 
            (0, "https://warnung.bund.de/bbk.mowas/gefahrendurchsagen.json"),
            (1, "https://warnung.bund.de/bbk.biwapp/warnmeldungen.json"), 
            (2, "https://warnung.bund.de/bbk.biwapp/warnmeldungen.json"), 
            (3, "https://warnung.bund.de/bbk.dwd/unwetter.json"), 
            (4, "https://warnung.bund.de/bbk.lhp/hochwassermeldungen.json");
        `,
        (err, row) => {
            if (err) {
                throw err;
              }
        });
    }

// print all tables in the console
function printTable() {
    sql = 'SELECT * from clients; '
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
          console.log(`${row.ID} ${row.distributor_url} ${row.geocode}`);
        });
    });

    sql = 'SELECT * FROM urls; '
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
          // console.log(`${row.url} ${row.etag}`);
        });
    });
}

// create a new row in the table with the distributor_url and geocode
function insertNewClient(distributor_url, geocode) {
    db.run(`INSERT INTO clients(distributor_url, geocode ) VALUES(?, ?)`, [distributor_url, geocode], function(err) {
        if (err) {
          return console.log(err.message);
        }
    });
    printTable();
}

// create a new row in the table with the distributor_url and geocode
function updateClient(distributor_url, new_geocode, remove_geocode) {
    // remove old geocodes
    remove_geocode.forEach( (geocode) => {
      console.log(`remove: ${geocode}`);
        removeGeocode(distributor_url, geocode);
    });

    // insert new geocode
    new_geocode.forEach ( (geocode ) => {
        insertNewClient(distributor_url, geocode);
    })

    // print result
    printTable();
}

// remove for the distributor url the geocode entry
function removeGeocode(distributor_url, geocode) {
    db.run(`DELETE FROM clients WHERE distributor_url=? AND geocode=?`, [distributor_url, geocode], function(err) {
        if (err) {
          return console.log(err.message);
        }
    });
}

// remove every eintry for distributor url
function removeClient(distributor_url) {
    db.run(`DELETE FROM clients WHERE distributor_url=?`, [distributor_url], function(err) {
        if (err) {
          return console.log(err.message);
        }
    });
}

// load all distirbutor urls for the given geocode and call the 
// sendNotification Callback function
function getAllDistributorUrlsForGeocode(geocode, sendNotification, headline) {
    db.all(`SELECT DISTINCT distributor_url FROM clients WHERE geocode=?`, [geocode], (err, rows) => {
        if (err) {
          return console.log(err.message);
        }
        rows.forEach((row) => {
            sendNotification(row.distributor_url, headline);
          })
        return;
    });
}

// select all urls and etags from the database and call with it the callback function
function getUrlsAndEtags(callback) {
    db.all(`SELECT * FROM urls`, (err, rows) => {
        if (err) {
          return console.log(err.message);
        }
        rows.forEach((row) => {
            callback(row.url, row.etag);
          }) 
        });
        // callback("https://warnung.bund.de/bbk.dwd/unwetter.json", ""); // for testing
    return;
}

// store the given etags for the given urls in the database
function saveEtagForURL(url, etag) {
    // let db = initializeDatabase();
    db.all(`UPDATE urls SET etag=? WHERE url=?`, [etag, url], (err, rows) => {
        if (err) {
          return console.log(err.message);
        }
    });
}

// close the database if we don't need it anymore
function closeDatabase(db) {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}
    
module.exports = {
    insertNewClient,
    removeGeocode,
    removeClient, 
    printTable,
    getAllDistributorUrlsForGeocode,
    getUrlsAndEtags,
    saveEtagForURL,
    initializeDatabase,
    updateClient
}