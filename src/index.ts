import { IncomingMessage } from 'http';
import query from './lib/query';
import formBody from './lib/form_body';
import jsonBody from './lib/json_body';
import multipartBody from './lib/multipart_body';
import ContentType from 'content-type';

export = async function proxy (req: IncomingMessage, target: Target): Promise<Target> {

    if (target.query) await query(req, target);

    if (target.buffer || !target.body || Object.keys(target.body).length === 0) return target;

    // default content-type
    if (!req.headers['content-type']) {
        req.headers['content-length'] = '0';
        req.headers['content-type'] = 'application/json; charset=utf-8';
    }

    const { type, parameters } = ContentType.parse(req);

    switch (type) {
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

    return target;
};
 