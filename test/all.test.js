const fs = require('fs');
const Koa = require('koa');
const supertest = require('supertest');
const { expect } = require('chai');
const bodyParser = require('koa-body');
const proxyBuffer = require('../dist');
const k2c = require('koa2-connect')
const httpProxy = require('http-proxy-middleware');

describe('http-proxy-extend test', function () {
    
    it('extend query, add params', function (done) {
        const port = 58880;

        // start test service
        const app_server = new Koa();
        app_server.use(async function (ctx) {
            expect(ctx.path).to.equal('/extend-query/query');
            expect(ctx.request.query).to.be.an('object');
            expect(ctx.request.query.test).to.equal('extend query');
            expect(ctx.request.query.extend).to.equal('query');
            
            ctx.body = { code: 0 };
        });
        app_server.listen(port);

        // start proxy service
        const app_proxy = new Koa();
        const target = {
            target: `http://127.0.0.1:${port}/extend-query`,
            query: {
                extend: 'query'
            }
        };
        app_proxy.use(async function (ctx, next) {
            // extend target
            const _target = await proxyBuffer(ctx.req, target);
            await k2c(httpProxy(_target))(ctx, next);
        });
        supertest(app_proxy.callback())
        .get('/query')
        .query({
            test: 'extend query'
        })
        .end(function (err, res) {
            expect(res.body.code).to.equal(0);
            done();
        });
    });

    it('extend query, new params', function (done) {
        const port = 58881;

        // start test service
        const app_server = new Koa();
        app_server.use(async function (ctx) {
            expect(ctx.path).to.equal('/extend-query/query');
            expect(ctx.request.query).to.be.an('object');
            expect(ctx.request.query.test).to.equal(undefined);
            expect(ctx.request.query.extend).to.equal('query');
            
            ctx.body = { code: 0 };
        });
        app_server.listen(port);

        // start proxy service
        const app_proxy = new Koa();
        const target = {
            target: `http://127.0.0.1:${port}/extend-query`,
            query: {
                extend: 'query'
            }
        };
        app_proxy.use(async function (ctx, next) {
            // extend target
            const _target = await proxyBuffer(ctx.req, target);
            await k2c(httpProxy(_target))(ctx, next);
        });
        supertest(app_proxy.callback())
        .get('/query')
        .end(function (err, res) {
            expect(res.body.code).to.equal(0);
            done();
        });
    });

    it('extend form body, add params', function (done) {
        const port = 58882;

        // start test service
        const app_server = new Koa();
        app_server.use(bodyParser());
        app_server.use(async function (ctx) {
            expect(ctx.path).to.equal('/extend-form/form');
            expect(ctx.request.body).to.be.an('object');
            expect(ctx.request.body.test).to.equal('extend form body');
            expect(ctx.request.body.extend).to.equal('form-body');
            
            ctx.body = { code: 0 };
        });
        app_server.listen(port);

        // start proxy service
        const app_proxy = new Koa();
        const target = {
            target: `http://127.0.0.1:${port}/extend-form`,
            body: {
                extend: 'form-body'
            }
        };
        app_proxy.use(async function (ctx, next) {
            // extend target
            const _target = await proxyBuffer(ctx.req, target);
            await k2c(httpProxy(_target))(ctx, next);
        });
        supertest(app_proxy.callback())
        .post('/form')
        .send({
            test: 'extend form body'
        })
        .set('content-type', 'application/x-www-form-urlencoded')
        .end(function (err, res) {
            expect(res.body.code).to.equal(0);
            done();
        });
    });

    it('extend form body, new params', function (done) {
        const port = 58883;

        // start test service
        const app_server = new Koa();
        app_server.use(bodyParser());
        app_server.use(async function (ctx) {
            expect(ctx.path).to.equal('/extend-form/form');
            expect(ctx.request.body).to.be.an('object');
            expect(ctx.request.body.test).to.equal(undefined);
            expect(ctx.request.body.extend).to.equal('form-body');
            
            ctx.body = { code: 0 };
        });
        app_server.listen(port);

        // start proxy service
        const app_proxy = new Koa();
        const target = {
            target: `http://127.0.0.1:${port}/extend-form`,
            body: {
                extend: 'form-body'
            }
        };
        app_proxy.use(async function (ctx, next) {
            // extend target
            const _target = await proxyBuffer(ctx.req, target);
            await k2c(httpProxy(_target))(ctx, next);
        });
        supertest(app_proxy.callback())
        .post('/form')
        .set('content-type', 'application/x-www-form-urlencoded')
        .end(function (err, res) {
            expect(res.body.code).to.equal(0);
            done();
        });
    });

    it('extend json body, add params', function (done) {
        const port = 58884;

        // start test service
        const app_server = new Koa();
        app_server.use(bodyParser());
        app_server.use(async function (ctx) {
            expect(ctx.path).to.equal('/extend-json/json');
            expect(ctx.request.body).to.be.an('object');
            expect(ctx.request.body.test).to.equal('extend json body');
            expect(ctx.request.body.extend).to.equal('json-body');
            
            ctx.body = { code: 0 };
        });
        app_server.listen(port);
       
        // start proxy service
        const app_proxy = new Koa();
        const target = {
            target: `http://127.0.0.1:${port}/extend-json`,
            body: {
                extend: 'json-body'
            }
        };
        app_proxy.use(async function (ctx, next) {
            // extend target
            const _target = await proxyBuffer(ctx.req, target);
            await k2c(httpProxy(_target))(ctx, next);
        });
        supertest(app_proxy.callback())
        .post('/json')
        .send({
            test: 'extend json body'
        })
        .set('content-type', 'application/json')
        .end(function (err, res) {
            expect(res.body.code).to.equal(0);
            done();
        });
    });

    it('extend json body, new params', function (done) {
        const port = 58885;

        // start test service
        const app_server = new Koa();
        app_server.use(bodyParser());
        app_server.use(async function (ctx) {
            expect(ctx.path).to.equal('/extend-json/json');
            expect(ctx.request.body).to.be.an('object');
            expect(ctx.request.body.test).to.equal(undefined);
            expect(ctx.request.body.extend).to.equal('json-body');
            
            ctx.body = { code: 0 };
        });
        app_server.listen(port);

        // start proxy service
        const app_proxy = new Koa();
        const target = {
            target: `http://127.0.0.1:${port}/extend-json`,
            body: {
                extend: 'json-body'
            }
        };
        app_proxy.use(async function (ctx, next) {
            // extend target
            const _target = await proxyBuffer(ctx.req, target);
            await k2c(httpProxy(_target))(ctx, next);
        });
        supertest(app_proxy.callback())
        .post('/json')
        .set('content-type', 'application/json')
        .end(function (err, res) {
            expect(res.body.code).to.equal(0);
            done();
        });
    });

    it('extend multipart body, add params', function (done) {
        const port = 58886;

        // start test service
        const app_server = new Koa();
        app_server.use(bodyParser({ multipart: true }));
        app_server.use(async function (ctx) {
            expect(ctx.path).to.equal('/extend-multipart/multipart');
            expect(ctx.request.body).to.be.an('object');
            expect(ctx.request.body.test).to.equal('extend multipart body');
            expect(ctx.request.body.extend).to.equal('multipart-body');
            
            ctx.body = { code: 0 };
        });
        app_server.listen(port);

        // start proxy service
        const app_proxy = new Koa();
        const target = {
            target: `http://127.0.0.1:${port}/extend-multipart`,
            body: {
                extend: 'multipart-body',
            }
        };
        app_proxy.use(async function (ctx, next) {
            // extend target
            const _target = await proxyBuffer(ctx.req, target);
            await k2c(httpProxy(_target))(ctx, next);
        });
        supertest(app_proxy.callback())
        .post('/multipart')
        .set('content-type', 'multipart/form-data')
        .field('test', 'extend multipart body')
        .attach({
            file: fs.createReadStream(__filename)
        })
        .expect(200)
        .end(function (err, res) {
            expect(res.body.code).to.equal(0);
            done();
        });
    });
    
    it('extend multipart body, new params', function (done) {
        const port = 58887;

        // start test service
        const app_server = new Koa();
        app_server.use(bodyParser({ multipart: true }));
        app_server.use(async function (ctx) {
            expect(ctx.path).to.equal('/extend-multipart/multipart');
            expect(ctx.request.body).to.be.an('object');
            expect(ctx.request.body.test).to.equal(undefined);
            expect(ctx.request.body.extend).to.equal('multipart-body');
            
            ctx.body = { code: 0 };
        });
        app_server.listen(port);

        // start proxy service
        const app_proxy = new Koa();
        const target = {
            target: `http://127.0.0.1:${port}/extend-multipart`,
            body: {
                extend: 'multipart-body',
            },
        };
        app_proxy.use(async function (ctx, next) {
            // extend target
            const _target = await proxyBuffer(ctx.req, target);
            await k2c(httpProxy(_target))(ctx, next);
        });
        supertest(app_proxy.callback())
        .post('/multipart')
        .set('content-type', 'multipart/form-data')
        .expect(200)
        .end(function (err, res) {
            expect(res.body.code).to.equal(0);
            done();
        });
    });
});
