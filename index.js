const query = require('./lib/query');
const ContentType = require('content-type');
const formBody = require('./lib/form_body');
const jsonBody = require('./lib/json_body');
const multipartBody = require('./lib/multipart_body');

module.exports = async function (req, target) {

    // query部分的处理
    if (target.query) query(req, target);

    // body部分的处理
    if (target.body && Object.keys(target.body).length > 0) {

        target.headers = target.headers || {};

        // default content-type
        if (!req.headers['content-type']) {
            req.headers['content-length'] = 0;
            req.headers['content-type'] = 'application/json; charset=utf-8';
        }

        const { type, parameters } = ContentType.parse(req);

        switch (type) {
            case 'application/x-www-form-urlencoded':
                await formBody(req, target);
                break;
            case 'application/json':
                await jsonBody(req, target);
                break;
            case 'multipart/form-data':
                await multipartBody(req, target, parameters);
                break;
            default:
                target.buffer = null;
                break;
        }
    }

    return target;
};