const streamify = require('stream-array');
const StreamConcat = require('stream-concat');

/**
 * add params to form body
*/
module.exports = async function (req, target) {

    const search_params = new URLSearchParams(target.body);
    const search_params_str = search_params.toString();
    const origin_content_length = Number(req.headers['content-length']) || 0;

    if (origin_content_length > 0) {
        const search_params_buffer = Buffer.from('&' + search_params_str);
        const stream = new StreamConcat([ req, streamify([ search_params_buffer ]) ]);

        target.buffer = stream;
        target.headers['content-length'] = search_params_buffer.byteLength + origin_content_length;
    } else {
        const search_params_buffer = Buffer.from(search_params_str);
        target.buffer = streamify([ search_params_buffer ]);
        target.headers['content-length'] = search_params_buffer.byteLength;
    }
};