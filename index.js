var stack_name = ''
var request_cnt = null;
var pkg = require('./package.json');
var functionHandler;
var initialized = false;

function parseLambdaFunctionInfo() {
    var functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || '';
    var lambdaInfo = {
        'stackName' : null,
        'baseName' : functionName,
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

    if (! process.env.STACK_NAME) {
        if (functionInfo.stackName) {
            process.env['STACK_NAME'] = functionInfo.stackName;
         }       
    }
    if (process.env.VERBOSE) {       
        console.log('Initialize ' + functionInfo.functionName + ' version ' + functionInfo.version + ' in stack ' + process.env.STACK_NAME || '<unknown>');
    }    
    console.log('STACK_NAME (init) : ' + process.env.STACK_NAME);
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

    initRequest(function(err) {
        if (err) {
            return context.fail(err);
        }

        lambdaFunction.handleRequest(event, function(err, response) {
            if (err) {
                return context.fail(err);
            }
            return context.succeed(response);
        });
    });
}

module.exports = exports = {
    init: initFn,
    handler: handlerFn
}