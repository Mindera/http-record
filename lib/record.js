'use strict';
var thin = require('thin');

module.exports = {

    record: function(options, callback) {

        options.listenPort = !options.listenPort ? 8001 : options.listenPort;
        options.listenHost = !options.listenHost ? 'localhost' : options.listenHost;
        options.strictSSL = !options.strictSSL ? false : options.strictSSL;
        options.rejectUnauthorized = !options.rejectUnauthorized ? false : options.rejectUnauthorized;

        var session = {
            proxy: undefined,
            requests: []
        };

        var proxy = new thin(options);

        function saveRequest(req) {
            var reqObject = {}
            reqObject.host = req.headers.host;
            reqObject.uri = req.url;
            reqObject.protocol = (req.connection.pair) ? 'https' : 'http';
            reqObject.method = req.method;
            reqObject.headers = req.headers;

            session.requests.push(reqObject);
        }
        
        proxy.use(function proxyRequest(req, res, next) {
            console.log('Proxying: ' + req.headers.host + req.url);

            saveRequest(req);
            next();
        });

        proxy.listen(options.listenPort, options.listenHost, function(err) {
            if (err) {
                console.log('Error: ' + err);
            }

            session.proxy = proxy;
            callback(session);
        });
    },

    /* TODO: support saving http.ServerResponse's to a mock store
    mock: function () {

    },*/

    stop: function (session) {
        session.proxy.close(function (err) {
            console.log(err);
        });
    }
};

