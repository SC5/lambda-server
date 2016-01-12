var stack_name = ''
var request_cnt = null;
var pkg = require('./package.json');
var functionHandler;
var initialized = false;
var errorHandler = function(error, callback) {
    return callback(error);
};
var lambdainfo = {};

function parseLambdaFunctionInfo() {
    var functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || '';
    lambdaInfo = {
        'stackName' : null,
        'baseName' : functionName,
        'fullName' : functionName,
        'functionName' : pkg.name,
        'version': pkg.version,
    };

    var parts = functionName.split('-');

    if (parts.length > 1) {
        lambdaInfo.stackName = parts[0];
        lambdaInfo.baseName = parts[1];
    }
    return lambdaInfo;
}

// Initialize the server. Always succeeds
function initFn(options) {
    request_cnt = 0;
    functionInfo = parseLambdaFunctionInfo();

    if (! options) {
        console.log('ERROR: Cannot initialize lamdda-server. No options.')
        return false;
    }

    if (! options.lambdaFunction) {
        console.log('ERROR: Cannot initialize lamdda-server. lambdaFunction not set.')
        return false;
    }

    if (! options.lambdaFunction.handleRequest) {
        console.log('ERROR: Cannot initialize lamdda-server. lambdaFunction.handleRequest not set.')
        return false;
    }
    lambdaFunction = options.lambdaFunction;

    if (options.errorHandler) {
        errorHandler = options.errorHandler;
    }

    if (! process.env.STACK_NAME) {
        if (functionInfo.stackName) {
            process.env['STACK_NAME'] = functionInfo.stackName;
         }       
    }
    if (process.env.VERBOSE) {       
        console.log('Initialize ' + functionInfo.functionName + ' version ' + functionInfo.version + ' in stack ' + process.env.STACK_NAME || '<unknown>');
    }    
    initialized = true;
    return module;
}

// Logic to verify that we are ready to serve
function initRequest(callbackFn) {
    if ((! process.env.STACK_NAME) || (process.env.STACK_NAME === '')){
        return callbackFn(new Error("STACK_NAME not initialized"), null);
    }
    // Option to add some function specific logic here
    return callbackFn(null, null);
}

function handlerFn(event, context) {
    if (! initialized) {
        context.fail("lambda-server not initialized");
    }
    try {
        initRequest(function(err) {
            if (err) {
                return errorHandler(err, context.fail);
            }
                lambdaFunction.handleRequest(event, function(err, response) {
                    if (err) {
                        return errorHandler(err, context.fail);
                    }
                    return context.succeed(response);
                });

        });
    } catch (ex) {
        console.error('EXCEPTION');
        console.error(JSON.stringify({
            stack: new Error().stack,
            event: event
        }, null, 2)); 
        
        errorHandler('Exception from ' + lambdaInfo.fullName + ' : ' + ex, context.fail);
    }
}

module.exports = exports = {
    init: initFn,
    handler: handlerFn
}