const ContentType = require('content-type');
const formBody = require('./lib/form_body');
const jsonBody = require('./lib/json_body');
const multipartBody = require('./lib/multipart_body');

module.exports = async function (req, target) {

    // query部分的处理
    if (target.query) {
        const search_params = new URLSearchParams(target.query);
        const search_params_str = search_params.toString();
        
        if (req.url.includes('?')) {
            req.url += '&' + search_params_str;
        } else {
            req.url += '?' + search_params_str;
        }
    }

    // body部分的处理
    if (target.body && Object.keys(target.body).length > 0 && req.headers['content-type']) {

        target.headers = target.headers || {};

        const { type, parameters } = ContentType.parse(req);

        switch (type) {
            // form类型
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