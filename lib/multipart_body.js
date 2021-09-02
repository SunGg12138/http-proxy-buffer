const streamify = require('stream-array');
const StreamConcat = require('stream-concat');

/**
 * add params to multipart body
*/
module.exports = async function (req, target, parameters) {

    // content-length is required
    if (!req.headers['content-length']) return;

    const search_params_buffers = [],
          boundary = parameters.boundary || spawnBoundary(),
          origin_content_length = Number(req.headers['content-length']) || 0;

    // collect buffers total byteLength
    let buffer_total_length = 0;

    for (let key in target.body) {

        const start_buffer = Buffer.from('--' + boundary + '\r\n'),
              disposition_buffer = Buffer.from('Content-Disposition: form-data; '),
              name_buffer = Buffer.from(`name="${key}"\r\n\r\n`),
              value_buffer = Buffer.from(target.body[key] + '\r\n');

        buffer_total_length += start_buffer.byteLength;
        buffer_total_length += disposition_buffer.byteLength;
        buffer_total_length += name_buffer.byteLength;
        buffer_total_length += value_buffer.byteLength;

        search_params_buffers.push(start_buffer, disposition_buffer, name_buffer, value_buffer);
    }

    if (origin_content_length > 0) {
        const stream = new StreamConcat([ streamify(search_params_buffers), req ]);

        target.buffer = stream;

        // set content-length
        target.headers['content-length'] = origin_content_length + buffer_total_length;
    } else {
        // set end tag
        const end_buffer = Buffer.from('--' + boundary + '--');
        search_params_buffers.push(end_buffer);

        target.buffer = streamify(search_params_buffers);
        target.headers['content-type'] = 'multipart/form-data; boundary=' + boundary;

        // set content-length
        target.headers['content-length'] = buffer_total_length + end_buffer.byteLength;
    }
};

/**
 * spawn multipart/form-data boundary
*/
function spawnBoundary () {
    let boundary = '--------------------------';
    for (let i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
    }
    return boundary;
}