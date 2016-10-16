var request = require('request');

var ZApiRequestHelper = function (config, logger) {
    if(!config) {
        throw { keyword: 'API_REQUEST_HELPER_CONFIG_MISSING' };
    }
    this.config = config;
    this.logger = logger;
};

var zApiRequestHelper = ZApiRequestHelper.prototype;

zApiRequestHelper.makeRequest = function(type, method, params, cb) {

    var me = this;
    var config = me.config;
    var apiUrl = "http://" + config.host + ":" + config.port + config.path + method;

    if (config && config.debug) {
        if (me.logger) {
            me.logger.info(type, apiUrl, params);
        } else {
            console.log(type, apiUrl, params);
        }
    }

    var params = {url: apiUrl, json: params};

    if (type !== 'get') {
        request[type](params, function (error, response, body) {
            me.handleSendResponse(error, response, body, cb);
        });
    } else {
        request(apiUrl, function (error, response, body) {
            me.handleSendResponse(error, response, body, cb);
        })
    }
};

zApiRequestHelper.handleSendResponse = function (fnError, response, body, callback) {
    if (fnError) {
        return callback([{keyword: 'CONNECTION_ERROR', error: fnError}], null);
    }

    if (!body) {
        return callback([{keyword: 'RESPONSE_BODY_IS_EMPTY'}], null);
    }

    if (body.error) {
        return callback(body.error, null);
    }

    callback(null, body.result);
};

zApiRequestHelper.get = function (method, cb) {
    var me = this;
    me.makeRequest('get', method, null, function (err, res) {
        return cb(err, res);
    });
};

zApiRequestHelper.post = function (method, params, cb) {
    var me = this;
    me.makeRequest('post', method, params, function (err, res) {
        return cb(err, res);
    });
};

zApiRequestHelper.put = function (method, params, cb) {
    var me = this;
    me.makeRequest('put', method, params, function (err, res) {
        return cb(err, res);
    });
};

zApiRequestHelper.delete = function (method, params, cb) {
    var me = this;
    me.makeRequest('delete', method, params, function (err, res) {
        return cb(err, res);
    });
};

module.exports = ZApiRequestHelper;