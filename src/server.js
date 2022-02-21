const http = require('http');
const url = require('url');
const fileHandler = require('./fileResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3500;

const urlHandles = {
  GET: {
    '/': fileHandler.getIndex,
    '/style.css': fileHandler.getCSS,
    '/success': jsonHandler.success,
    '/internal': jsonHandler.internalServerError,
    '/forbidden': jsonHandler.forbidden,
    '/notImplemented': jsonHandler.notImplemented,
    '/badRequest': jsonHandler.badRequest,
    '/unauthorized': jsonHandler.noAuth,
    notFound: jsonHandler.notFound,
  },
};

function onRequest(request, response) {
  const parsedUrl = new url.URL(request.url, 'https://http-api-1-jayhors.herokuapp.com/');
  if (urlHandles[request.method][parsedUrl.pathname]) {
    urlHandles[request.method][parsedUrl.pathname](request, response);
  } else {
    urlHandles[request.method].notFound(request, response);
  }
}

http.createServer(onRequest).listen(port, () => { console.log(`Listening on localhost port ${port}`); });
