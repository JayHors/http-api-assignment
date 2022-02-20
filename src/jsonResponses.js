const url = require('url');
function jsonBuilder(request, response, message, statCode) {
    const stringed = JSON.stringify({ message });
    response.write(stringed);
    response.end();
}

function responseBuilder(request, response, message, statCode) {
    const contentType = request.headers.accept;
    const headers = { 'Content-Type': contentType };
    response.writeHead(statCode, headers);
    if (contentType === 'text/xml') {
        xmlBuilder(request, response, message);
    } else if (contentType === 'application/json') {
        jsonBuilder(request, response, message, statCode);
    }
}

function getQueryParams(request){
    return url.parse(request.url, true).query;
}

function notFound(request, response) {
    responseBuilder(request, response, 'The requested data could not be found.', 404);
}
function success(request, response) {
    responseBuilder(request, response, 'This is a correct and valid message!', 200);
}
function internalServerError(request, response) {
    responseBuilder(request, response, 'The server encountered an internal error.', 500);
}
function notImplemented(request, response) {
    responseBuilder(request, response, 'The requested call is not implemented.', 501);
}
function forbidden(request, response) {
    responseBuilder(request, response, 'Access is forbidden to the requested resource.', 403);
}
function badRequest(request, response) {
    const reqQueries = getQueryParams(request);
    const valid = reqQueries.valid ? reqQueries.valid : 'null';
    if(valid == 'yes'){
        success(request, response);
    }
    else{
        responseBuilder(request, response, 'Insufficient query parameters.', 400);
    }
    
}
module.exports = {
    notFound,
    success,
    internalServerError,
    forbidden,
    notImplemented,
    badRequest,
};
