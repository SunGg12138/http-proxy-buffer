import { Stream } from 'stream';
import { IncomingMessage } from 'http';
import streamify from 'stream-array';
import StreamConcat from 'stream-concat';

/**
 * add params to form body
*/
export default async function (req: IncomingMessage, target: Target) {

    const search_params: URLSearchParams = new URLSearchParams(target.body);
    const search_params_str: string = search_params.toString();
    const has_content_length: boolean = !!req.headers['content-length'];
    const origin_content_length: number = Number(req.headers['content-length']) || 0;

    if (!has_content_length || origin_content_length > 0) {
        const search_params_buffer: Buffer = Buffer.from('&' + search_params_str);
        const stream: Stream = new StreamConcat([ req, streamify([ search_params_buffer ]) ]);

        target.buffer = stream;

        // no content-length does not set content-length
        if (has_content_length) {
            target.headers['content-length'] = search_params_buffer.byteLength + origin_content_length;
        }
    } else {
        const search_params_buffer: Buffer = Buffer.from(search_params_str);
        target.buffer = streamify([ search_params_buffer ]);

        // no content-length does not set content-length
        if (has_content_length) {
            target.headers['content-length'] = search_params_buffer.byteLength;
        }
    }
};
