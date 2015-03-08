'use strict'
var websocket = require('ws');

module.exports = {
    
    start: function (options, callback) {
        
        var serverOptions = {
            host: !options.host ? 'localhost' : options.host,
            port: !options.port ? 8002 : options.port
        };

        var wss = new websocket.Server(serverOptions);
        
        callback(wss);
    },
    
    listen: function (server, callback) {
        
        server.on('connection', function connection(ws) {
            ws.on('open', function open() {
                console.log('connected');
            });

            ws.on('message', function incoming(message) {
                console.log('message: %s', message);
            });

            ws.on('close', function close() {
                console.log('disconnected');
            });

            callback(ws);
        });
    }
    
};
