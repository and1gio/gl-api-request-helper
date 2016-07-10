var request = require('request');
var error = require('gl-clients-error-codes');

var Manager = function(config) {
    this.config = config;
};

var manager = Manager.prototype;

manager.get_old = function(method, data, cb) {
    var me = this;
    var conf = me.config;
    var postData = JSON.stringify(data);
    var options = {
        hostname: conf.host,
        port: conf.port,
        path: conf.path + method,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var req = http.request(options, function(res) {
        var data = "";

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            try {
                var responseResult = JSON.parse(data);
            } catch (e) {
                cb(error('JSON_ERROR', e), null);
                return;
            }
            var err = responseResult.error || null;
            var result = responseResult.result || null;
            cb(err, result);
        });
    });

    req.on('error', function(e) {
        cb(error('CONNECTION_ERROR', e), null);
    });

    req.write(postData);
    req.end();
};

manager.get = function(method, data, cb) {
    var me = this;
    var conf = me.config;
    var apiUrl = "http://" + conf.host + ":" + conf.port + conf.path + method;

    console.log(apiUrl);

    var reqObj = {url: apiUrl, json: data};
    request.post(reqObj, function(error, response, body) {
        me.handleSendResponse(error, response, body, cb);
    });
};


manager.handleSendResponse = function(fnError, response, body, callback) {
    var me = this;
    if (fnError) {
        return callback(error('CONNECTION_ERROR', fnError), null);
    }

    if (!body) {
        return callback(error('RESPONSE_BODY_IS_EMPTY'), null);
    }

    if (body.error) {
        return callback(body.error, null);
    }

    callback(null, body.result);
};

manager.request = function(method, params, cb) {
    var me = this;
    me.get(method, params, function(err, res) {
        return cb(err, res);
    });
};

module.exports = Manager;