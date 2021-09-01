const getStream = require('get-stream');
const streamify = require('stream-array');

/**
 * add params to json body
*/
module.exports = async function (req, target) {

    const has_content_length = !!req.headers['content-length'];
    const origin_content_length = Number(req.headers['content-length']) || 0;

    let origin_json = {};

    if (origin_content_length > 0) {
        const json_str = await getStream(req);
        try {
            origin_json = JSON.parse(json_str);
        } catch (error) {}
    }

    const params = origin_content_length > 0? Object.assign(origin_json, target.body) : target.body;
    const search_params_buffer = Buffer.from(JSON.stringify(params));
    target.buffer = streamify([ search_params_buffer ]);

    // no content-length does not set content-length
    if (has_content_length) {
        target.headers['content-length'] = search_params_buffer.byteLength;
    }
};