const url = require('url');

function jsonBuilder(request, response, message, id) {
  let stringed;
  if (id) {
    stringed = JSON.stringify({ message, id });
  } else {
    stringed = JSON.stringify({ message });
  }
  response.write(stringed);
  response.end();
}

function xmlBuilder(request, response, message, id) {
  let stringed;
  if (id) {
    stringed = `
        <response>
            <message>
                ${message}
            </message>
            <id>
                ${id}
            </id>
        </response>
        `;
  } else {
    stringed = `
        <response>
            <message>
                ${message}
            </message>
        </response>
        `;
  }
  response.write(stringed);
  response.end();
}

function responseBuilder(request, response, message, statCode, id = '') {
  const contentType = request.headers.accept;
  const headers = { 'Content-Type': contentType };
  if (contentType === 'text/xml') {
    response.writeHead(statCode, headers);
    xmlBuilder(request, response, message, id);
  } else {
    headers['Content-Type'] = 'application/json';
    response.writeHead(statCode, headers);
    jsonBuilder(request, response, message, id);
  }
}

function getQueryParams(request) {
  return url.parse(request.url, true).query;
}

function notFound(request, response) {
  responseBuilder(request, response, 'The requested data could not be found.', 404, 'notFound');
}
function success(request, response) {
  responseBuilder(request, response, 'This is a correct and valid message!', 200);
}
function internalServerError(request, response) {
  responseBuilder(request, response, 'The server encountered an internal error.', 500, 'internalServerError');
}
function notImplemented(request, response) {
  responseBuilder(request, response, 'The requested call is not implemented.', 501, 'notImplemented');
}
function forbidden(request, response) {
  responseBuilder(request, response, 'Access is forbidden to the requested resource.', 403, 'forbidden');
}
function badRequest(request, response) {
  const reqQueries = getQueryParams(request);
  const valid = reqQueries.valid ? reqQueries.valid : 'null';
  if (valid === 'yes') {
    success(request, response);
  } else {
    responseBuilder(request, response, 'Insufficient query parameters.', 400, 'badRequest');
  }
}
function noAuth(request, response) {
  const reqQueries = getQueryParams(request);
  const valid = reqQueries.loggedin ? reqQueries.loggedin : 'null';
  if (valid === 'yes') {
    success(request, response);
  } else {
    responseBuilder(request, response, 'Currently unauthorized to access this data.', 401, 'unauthorized');
  }
}
module.exports = {
  notFound,
  success,
  internalServerError,
  forbidden,
  notImplemented,
  badRequest,
  noAuth,
};
