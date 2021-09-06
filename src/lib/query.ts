import { IncomingMessage } from 'http';
import querystring from './querystring';

/**
 * add params to search params
*/
export default async function (req: IncomingMessage, target: Target): Promise<void> {

    if (!req.url) return;

    target.query = target.query || {};

    const search_params_str: string = await querystring(target.query, req, target);

    if (req.url.includes('?')) {
        req.url += '&' + search_params_str;
    } else {
        req.url += '?' + search_params_str;
    }
};
