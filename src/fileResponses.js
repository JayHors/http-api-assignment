const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

function getIndex(request, response){
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(index);
    response.end();
};


function getCSS(request, response){
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.write(css);
    response.end();
};

function notFound(request, response){
    response.writeHead(404,{'Content-Type': 'application/json'});
    response.write(JSON.stringify({message:"The file requested is not available."}));
}


module.exports = {
    getIndex,
    getCSS,
    notFound,
};