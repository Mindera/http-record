'use strict';
var websocket = require('ws');

var ws = new websocket('ws://localhost:8002');

ws.on('open', function open() {
    // open
});

ws.on('message', function(data, flags) {
  console.log(data);
});
