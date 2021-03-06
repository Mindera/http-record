#  [![NPM version][npm-image]][npm-url]

http-record is a high level module that works as a bridge over the [node-thin](https://github.com/runk/node-thin) 
module to capture http records for future usage.

> Note: this module is very raw - please open any issues.

## Install

```sh
$ npm install --save http-record
```

## Usage

### API

It can be used via it's API by creating a new `http-record` instance and calling the `record` method.

The first argument is an `options` object:

* `options.listenPort` - proxy listen port (default: `8001`)
* `options.listenHost` - proxy listen host (default: `localhost`)
* `options.strictSSL` - requires ssl certificates be valid (default: `false`)
* `options.rejectUnauthorized` - reject clients with invalid ssl certificates (default: `false`)
* `options.websocket` - enable basic websocket support (default: `false`)
* `options.websocket.host` - websocket server listen host (default: `localhost`)
* `options.websocket.port` - websocket server listen port (default: `8002`)

The second argument is a `callback` to be executed after the proxy starts listening. It receives a `session` object 
argument:

* `session.proxy` - proxy instance running
* `session.requests` - array with all the captured requests or `[]`
* `session.websocket` - object with the running websocket details
* `session.websocket.server` - instance of websocket server or `undefined`
* `session.websocket.clients` - array with all the connected clients or `[]`

Example:

```js
var httpRecord = require('http-record');

httpRecord.record(options, function(session){
    
    // Do some http requests through the proxy
    // ...

    // Stop the recording session
    httpRecord.stop(session);
    
    // Do whatever you want with the session.requests array
    // ...
    
});
```

Reference of the http-record methods:

* `record` - creates a new instance of http-record and starts the mitm proxy - returns a recursive session object
* `stop` - stops the mitm proxy - should always be called in the callback of the `record` method to stop the proxy 
and avoid un-wanted requests

### WebSockets

If you enable websocket support `http-record` will expose a basic websocket server which will push all captured requests
as stringified JSON objects to the connected clients.

### CLI

It can also be used as a standalone CLI tool by doing:

```sh
$ node bin/http-record.js

# Do some http requests through the proxy
# ...

CTRL^C
$ 
```

It will save a JSON object representing all the requests captured in `/tmp/http-record-results.json`.

## Contributors

[Miguel Fonseca](miguel.fonseca@mindera.com)

## License

Licensed under the MIT License

[npm-url]: https://npmjs.org/package/http-record
[npm-image]: https://badge.fury.io/js/http-record.svg
