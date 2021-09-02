/**
 * add params to search params
*/
module.exports = function (req, target) {
    const search_params = new URLSearchParams(target.query);
    const search_params_str = search_params.toString();
    
    if (req.url.includes('?')) {
        req.url += '&' + search_params_str;
    } else {
        req.url += '?' + search_params_str;
    }
};