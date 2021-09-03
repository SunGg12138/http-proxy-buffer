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

    let origin_json: object = {};

    if (origin_content_length > 0) {
        const json_str: string = await getStream(req);
        try {
            origin_json = JSON.parse(json_str);
            if (typeof origin_json !== 'object') return;
        } catch (error) {}
    }

    const params: object = origin_content_length > 0? Object.assign(origin_json, target.body) : target.body;
    const search_params_buffer: Buffer = Buffer.from(JSON.stringify(params));
    const stream: Stream = streamify([ search_params_buffer ]);
    
    target.buffer = stream

    // no content-length does not set content-length
    if (has_content_length) {
        target.headers['content-length'] = search_params_buffer.byteLength;
    }
};