# http-proxy-buffer

Use the buffer attribute to extend http-proxy module, add query and body attributes

## Install

```
npm i http-proxy-buffer -S
```

## Usage

- http-proxy-middleware@0.18.0

```javascript
const Koa = require('koa');
const http = require('http');
const k2c = require('koa2-connect')
const bodyParser = require('koa-body');
const proxyBuffer = require('../');
const httpProxy = require('http-proxy-middleware');

// start proxy service
const app_proxy = new Koa();
const target = {
    target: `http://127.0.0.1:3000/extend-query`,

    // extend query attribute
    query: {
        extend: 'query extend',

        // the value is "query extend 2"
        extend_2: async function (req, target) {
            return new Promise(re => {
                re(target.query.extend + ' 2');
            });
        }
    },

    // extend body attribute
    body: {
        type: 'body type',

        // the value is "query extend 2"
        extend_2: async function (req, target) {
            return new Promise(re => {
                re(target.query.extend + ' 2');
            });
        }
    }
};
// the "/proxy" path use proxy
app_proxy.use(async function (ctx, next) {
    if (ctx.path === '/proxy') {
        // extend target
        const _target = await proxyBuffer(ctx.req, target);
        await k2c(httpProxy(_target))(ctx, next);
    } else {
        await next();
    }
});

app_proxy.use(bodyParser());

app_proxy.use(async function (ctx) {
    ctx.body = {
        // path: /extend-query/proxy
        path: ctx.path,
        // query: { proxy: 'yes', extend: 'query extend', extend_2: 'query extend 2' }
        query: ctx.request.query,
        // body: { request: 'yes', write: 'yes', type: 'body extend', extend_2: 'query extend 2' }
        body: ctx.request.body
    };

    // print the value
    console.log(ctx.body);
});

// listen and request proxy service
app_proxy.listen(3000, function () {
    const postData = 'request=yes&write=yes';
    const req = http.request('http://127.0.0.1:3000/proxy?proxy=yes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    });
    req.write(postData);
    req.end();
});
```
## Features

The content-type supported by the body attribute is: 

- application/x-www-form-urlencoded
- application/json, (only for object type data)
- multipart/form-data

## Related npm packages

[koa2-proxy-plus](https://github.com/SunGg12138/koa2-proxy-plus): koa2 proxy middleware

## Test

Learn more by viewing test cases

```
npm run test
```

## License

MIT License

Copyright (c) 2021 sungg12138
