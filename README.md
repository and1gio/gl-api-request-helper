# GL Api Request Helper For GL APIs

# config
```js
var ApiRequestHelper = require("gl-api-request-helper");
var api = new ApiRequestHelper({
    host: 'apiHost',
    port: '80',
    path: '/api/'
});
```

# making a call 
```js
var params = {
    a: 1,
    b: 2,
    c: {d: 3}
};

api.request("method-name", params, function(err, res) {
    console.log(err, res);
});
```