import { IncomingMessage } from 'http';

export = async function (input: AnyObject, req: IncomingMessage, target: Target): Promise<string> {
    
    let result: Array<string> = [];

    for (let key in input) {

        let value: any = input[key];

        if (Array.isArray(value)) {
            for (let item of value) {
                result.push(`${key}=${item == null? '' : item}`);
            }
            continue;
        }

        if (typeof value === 'function') {
            // get function return
            value = value(req, target);

            // handle promise type
            if (value instanceof Promise) {
                value = await value;
            }
            result.push(`${key}=${value}`);
            continue;
        }

        result.push(`${key}=${value}`);
    }

    return result.join('&');
};
