/**
* Sample lambda-server function 
* Calls an error based on event.message
**/

var lambdaServer;

function init(server) {
    lambdaServer = server;
}

function handleRequest(event, callbackFn) {
    callbackFn(event.message);
}

module.exports = exports = {
    init: init,
    handleRequest: handleRequest
};
