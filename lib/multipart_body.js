const streamify = require('stream-array');
const StreamConcat = require('stream-concat');

/**
 * add params to multipart body
*/
module.exports = async function (req, target, parameters) {

    // content-length is required
    if (!req.headers['content-length']) return;

    const search_params_buffers = [],
          origin_content_length = Number(req.headers['content-length']) || 0,
          MULTIPART_BOUNDARY = parameters.boundary || spawnBoundary(),
          MULTIPART_START_BUFFER = Buffer.from('--' + MULTIPART_BOUNDARY + '\r\n'),
          MULTIPART_DISPOSITION_BUFFER = Buffer.from('Content-Disposition: form-data;'),
          MULTIPART_END_BUFFER = Buffer.from('--' + MULTIPART_BOUNDARY + '--');

    // collect buffers total byteLength
    let buffer_total_length = 0;

    for (let key in target.body) {

        const name_buffer = Buffer.from(`name="${key}"\r\n\r\n`),
              value_buffer = Buffer.from(target.body[key] + '\r\n');

        buffer_total_length += MULTIPART_START_BUFFER.byteLength;
        buffer_total_length += MULTIPART_DISPOSITION_BUFFER.byteLength;
        buffer_total_length += name_buffer.byteLength;
        buffer_total_length += value_buffer.byteLength;

        search_params_buffers.push(MULTIPART_START_BUFFER, MULTIPART_DISPOSITION_BUFFER, name_buffer, value_buffer);
    }

    if (origin_content_length > 0) {
        const stream = new StreamConcat([ streamify(search_params_buffers), req ]);

        target.buffer = stream;
        // set content-length
        target.headers['content-length'] = origin_content_length + buffer_total_length;
    } else {
        // set end tag
        search_params_buffers.push(MULTIPART_END_BUFFER);

        target.buffer = streamify(search_params_buffers);
        target.headers['content-type'] = 'multipart/form-data; boundary=' + MULTIPART_BOUNDARY;
        // set content-length
        target.headers['content-length'] = buffer_total_length + MULTIPART_END_BUFFER.byteLength;
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