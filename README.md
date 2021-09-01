# http-proxy-buffer

Use the buffer attribute to expand http-proxy module, add query and body attributes

## Install

```
npm i http-proxy-buffer -S
```

## Usage

- http-proxy-middleware@0.18.0

```javascript
const k2c = require('koa2-connect')
const proxyBuffer = require('http-proxy-buffer');
const httpProxy = require('http-proxy-middleware');

// start proxy service
const app_proxy = new Koa();
const target = {
    target: `http://127.0.0.1:${port}/extend-query`,

    // extend query attribute
    query: {
        extend: 'query extend'
    },

    // extend body attribute
    body: {
        type: 'body extend'
    }
};
app_proxy.use(async function (ctx, next) {
    // extend target
    const _target = await proxyBuffer(ctx.req, target);
    await k2c(httpProxy(_target))(ctx, next);
});

app_proxy.listen(3000);

```
## Features

The content-type supported by the body attribute is: 

- application/x-www-form-urlencoded
- application/json
- multipart/form-data

## Test

Learn more by viewing test cases

```
npm run test
```

## License

MIT License

Copyright (c) 2021 sungg12138