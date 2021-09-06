import { Stream } from 'stream';
import { IncomingMessage } from 'http';
import streamify from 'stream-array';
import getStream from 'get-stream';

/**
 * add params to json body
*/
export default async function (req: IncomingMessage, target: Target): Promise<void> {

    target.body = target.body || {};
    target.headers = target.headers || {};

    const has_content_length: boolean = !!req.headers['content-length'];
    const origin_content_length: number = Number(req.headers['content-length']) || 0;

    let origin_json: AnyObject = {};

    if (origin_content_length > 0) {
        const json_str: string = await getStream(req);
        try {
            origin_json = JSON.parse(json_str);
            if (typeof origin_json !== 'object') return;
        } catch (error) {}
    }

    for (let key in target.body) {
        let value = target.body[key];

        if (typeof value === 'function') {
            value = value(req, target);
            // handle promise type
            if (value instanceof Promise) {
                value = await value;
            }
        }
        origin_json[key] = value;
    }

    const search_params_buffer: Buffer = Buffer.from(JSON.stringify(origin_json));
    const stream: Stream = streamify([ search_params_buffer ]);
    
    target.buffer = stream;

    // no content-length does not set content-length
    if (has_content_length) {
        target.headers['content-length'] = search_params_buffer.byteLength;
    }
};