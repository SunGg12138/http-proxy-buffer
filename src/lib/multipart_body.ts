import { Stream } from 'stream';
import { IncomingMessage } from 'http';
import streamify from 'stream-array';
import StreamConcat from 'stream-concat';

interface ContentTypeParameters {
    boundary: string | undefined
}

/**
 * add params to multipart body
*/
export default async function (req: IncomingMessage, target: Target, parameters: ContentTypeParameters) {

    // content-length is required
    if (!req.headers['content-length']) return;

    const search_params_buffers = [],
          origin_content_length = Number(req.headers['content-length']) || 0,
          MULTIPART_BOUNDARY = parameters.boundary || spawnBoundary(),
          MULTIPART_START_BUFFER = Buffer.from('--' + MULTIPART_BOUNDARY + '\r\n'),
          MULTIPART_DISPOSITION_BUFFER = Buffer.from('Content-Disposition: form-data;'),
          MULTIPART_END_BUFFER = Buffer.from('--' + MULTIPART_BOUNDARY + '--');

    // collect buffers total byteLength
    let buffer_total_length: number = 0;

    for (let key in target.body) {

        const name_buffer: Buffer = Buffer.from(`name="${key}"\r\n\r\n`),
              value_buffer: Buffer = Buffer.from(target.body[key] + '\r\n');

        buffer_total_length += MULTIPART_START_BUFFER.byteLength;
        buffer_total_length += MULTIPART_DISPOSITION_BUFFER.byteLength;
        buffer_total_length += name_buffer.byteLength;
        buffer_total_length += value_buffer.byteLength;

        search_params_buffers.push(MULTIPART_START_BUFFER, MULTIPART_DISPOSITION_BUFFER, name_buffer, value_buffer);
    }

    if (origin_content_length > 0) {
        const stream: Stream = new StreamConcat([ streamify(search_params_buffers), req ]);

        target.buffer = stream;
        // set content-length
        target.headers['content-length'] = origin_content_length + buffer_total_length;
    } else {
        // set end tag
        search_params_buffers.push(MULTIPART_END_BUFFER);

        const stream: Stream = streamify(search_params_buffers);

        target.buffer = stream;
        target.headers['content-type'] = 'multipart/form-data; boundary=' + MULTIPART_BOUNDARY;
        // set content-length
        target.headers['content-length'] = buffer_total_length + MULTIPART_END_BUFFER.byteLength;
    }
};

/**
 * spawn multipart/form-data boundary
*/
function spawnBoundary (): string {
    let boundary = '--------------------------';
    for (let i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
    }
    return boundary;
}