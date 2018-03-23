const request = require('request');

let ZApiRequestHelper = function (config, logger) {
    if (!config) {
        throw { keyword: 'API_REQUEST_HELPER_CONFIG_MISSING' };
    }
    this.config = config;
    this.logger = logger;
};

let zApiRequestHelper = ZApiRequestHelper.prototype;

zApiRequestHelper.makeRequest = function (type, method, params, cb) {
    let me = this;

    const protocol = me.config.protocol || "http://";
    const host = me.config.host;
    const port = me.config.port;
    const path = me.config.path;

    const apiUrl = protocol.concat(host, ":", port, path, method);

    if (me.config.debug) {
        if (me.logger) {
            me.logger.info(type, apiUrl, params);
        } else {
            console.log(type, apiUrl, params);
        }
    }

    params = { url: apiUrl, json: params };

    if (me.config.timeout) {
        params.timeout = me.config.timeout
    }

    if (type !== 'get') {
        request[type](params, (error, response, body) => {
            handleSendResponse(error, response, body, cb);
        });
    } else {
        request(apiUrl, (error, response, body) => {
            handleSendResponse(error, response, body, cb);
        });
    }
};

zApiRequestHelper.get = function (method, cb) {
    let me = this;
    me.makeRequest('get', method, null, (err, res) => {
        return cb(err, res);
    });
};

zApiRequestHelper.post = function (method, params, cb) {
    let me = this;
    me.makeRequest('post', method, params, (err, res) => {
        return cb(err, res);
    });
};

zApiRequestHelper.put = function (method, params, cb) {
    let me = this;
    me.makeRequest('put', method, params, (err, res) => {
        return cb(err, res);
    });
};

zApiRequestHelper.delete = function (method, params, cb) {
    let me = this;
    me.makeRequest('delete', method, params, (err, res) => {
        return cb(err, res);
    });
};

// TODO for msda - deprecated
zApiRequestHelper.request = function (method, params, cb) {
    let me = this;
    me.makeRequest('post', method, params, (err, res) => {
        return cb(err, res);
    });
};

function handleSendResponse(fnError, response, body, callback) {
    if (fnError) {
        return callback([{ keyword: 'CONNECTION_ERROR', error: fnError }], null);
    }

    if (!body) {
        return callback([{ keyword: 'RESPONSE_BODY_IS_EMPTY' }], null);
    }

    if (body.error) {
        return callback(body.error, null);
    }

    callback(null, body.result || body);
};

module.exports = ZApiRequestHelper;