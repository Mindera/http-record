'use strict';
var record = require('../');
var fs = require('fs');

function saveRequests(requests, callback) {
    // TODO: get output file from config
    var requestsFile = '/tmp/http-record-results.json';
    fs.writeFile(requestsFile, JSON.stringify(requests), function writeToFile(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Requests captured to: " + requestsFile);
        }
        callback();
    });
}

function recordCallback(session) {
    process.on('SIGINT', function exitCleanly() {
        record.stop(session);
        
        if (session.requests.length > 0) {
            saveRequests(session.requests, function () {
                process.exit();
            });
        } else {
            console.log('No requests captured.');
        }
    });

    setInterval(function sessionRequests() {
        if (session.requests) {
            console.log(session.requests.length);
        }
    }, 5000);
}

record.record({}, recordCallback);
