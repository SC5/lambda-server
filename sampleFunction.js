/**
* Sample lambda-server function 
* Gets a and b as input and returns sum = a+b
**/

var lambdaServer;

function init(server) {
    lambdaServer = server;
}

function handleRequest(event, callbackFn) {
    var a = event.a;
    var b = event.b;
    
    callbackFn(null, {
        sum: a+b,
        stack: process.env.STACK_NAME
    });
}

module.exports = exports = {
    init: init,
    handleRequest: handleRequest
};
