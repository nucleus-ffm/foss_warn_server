# foss_warn_server
(experimental) Serverpart of FOSS Warn for Push Notifications written with nodeJS, fastify and sqlite

## how to start?
- install all dependencies
- run the file `server.js` with nodeJS

## how to use the server with FOSS Warn

- Start the server (I use nodemon for this).
- Start FOSS Warn (and for now edit lines 47 and 48 in main.dart to disable the alarmManager).
- Select a new location in FOSS Warn
- The data is sent to the server
- The server should now output the client table with the new entry.
- You can now comment out line 96 in server.js to run jsonWorker.loadJson() and restart the server.
- The server should now call the NINA API (only once for now) and send a push notification if needed.
