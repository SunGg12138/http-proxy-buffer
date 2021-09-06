import { Stream } from 'stream';
import { IncomingMessage } from 'http';
import streamify from 'stream-array';
import StreamConcat from 'stream-concat';
import querystring from './querystring';

/**
 * add params to form body
*/
export default async function (req: IncomingMessage, target: Target): Promise<void> {

    target.body = target.body || {};
    target.headers = target.headers || {};

    const search_params_str: string = await querystring(target.body, req, target);
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
