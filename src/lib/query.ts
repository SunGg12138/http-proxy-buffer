import { IncomingMessage } from 'http';

/**
 * add params to search params
*/
export default async function (req: IncomingMessage, target: Target): Promise<void> {

    if (!req.url) return;
    
    const search_params: URLSearchParams = new URLSearchParams(target.query);
    const search_params_str: string = search_params.toString();

    if (req.url.includes('?')) {
        req.url += '&' + search_params_str;
    } else {
        req.url += '?' + search_params_str;
    }
};
