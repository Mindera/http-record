'use strict';
var thin = require('thin');
var websocket = require('./websocket');

module.exports = {

    record: function(options, callback) {

        options.listenPort = !options.listenPort ? 8001 : options.listenPort;
        options.listenHost = !options.listenHost ? 'localhost' : options.listenHost;
        options.strictSSL = !options.strictSSL ? false : options.strictSSL;
        options.rejectUnauthorized = !options.rejectUnauthorized ? false : options.rejectUnauthorized;
        options.websocket = !options.websocket ? false : options.websocket;


        var session = {
            proxy: undefined,
            websocket: {
                server: undefined,
                clients: []
            },
            requests: []
        };

        if (options.websocket) websocket.start(options.websocket, function startServer(wss) {
            session.websocket.server = wss;

            websocket.listen(wss, function listenConnections(ws) {
                session.websocket.clients.push(ws);
            })
        });

        function buildRequest(req, body) {
            var reqObject = {}
            reqObject.protocol = (req.connection.pair) ? 'https' : 'http';
            reqObject.host = req.headers.host;

            if (reqObject.protocol === 'https') {
                reqObject.url = 'https://' + reqObject.host + req.url;
            } else {
                reqObject.url = req.url;
            }

            reqObject.method = req.method;
            reqObject.headers = req.headers;

            if (body) reqObject.body = body;

            return reqObject;
        }

        var proxy = new thin(options);

        proxy.use(function proxyRequest(req, res, callback) {
            var reqBuild;
            var body = '';

            req.on('data', function(chunk) {
                if (chunk) body += chunk.toString();
            });

            req.on('end', function handleRequestEnd() {
                reqBuild = buildRequest(req, body);

                if (session.websocket) {
                    for (var ws in session.websocket.clients) {
                        session.websocket.clients[ws].send(JSON.stringify(reqBuild));
                    }
                }
                session.requests.push(reqBuild);

            });

            callback();
        });

        proxy.listen(options.listenPort, options.listenHost, function(err) {
            if (err) {
                console.error('Error: ' + err);
            }

            session.proxy = proxy;
            callback(session);
        });
    },

    /* TODO: support saving http.ServerResponse's to a mock store
    mock: function () {

    },*/

    stop: function (session) {

        if (session.websocket.server) session.websocket.server.close();

        session.proxy.close(function (err) {
            console.error('Error: ' + err);
        });
    }
};

