# Z Api Request Helper For Z APIs

# config
```js
var ApiRequestHelper = require("z-api-request-helper");
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

api.get("method-name",function(err, res) {
    console.log(err, res);
});

api.post("method-name", params, function(err, res) {
    console.log(err, res);
});

api.put("method-name", params, function(err, res) {
    console.log(err, res);
});

api.delete("method-name", params, function(err, res) {
    console.log(err, res);
});

```