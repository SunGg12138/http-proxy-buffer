import { Stream } from 'stream';
import { IncomingMessage } from 'http';

interface Target {
    query: {
        [propname: string]: any
    },
    body: {
        [propname: string]: any
    },
    headers: {
        [propname: string]: string | number
    },
    buffer: Stream,
    
    [propname: string]: any
}

declare module 'http-proxy-buffer' {
    export default function (req: IncomingMessage, target: Target): Target
}
