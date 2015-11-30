# lambda-server NPM module

A module for providing some basic services to serverles services implemented by AWS Lambda.
For the time being, the server only intitializes a the STACK_NAME environment variable to contain the Cloudformation stack name (based on the function name, e.g. ABC-functionName-123456 => STACK_NAME=ABC). More logic can and will be added later.

## Usage

Package your lambda function into a module lambdaFunction.js with syntax
```javascript
  var lambdaServer;

  function init(server) {
      lambdaServer = server;
  }

  function handleRequest(event, cb) {
      if (ERROR) {
          cb(ERROR MESSAGE HERE)
      } 
      console.log('I am in CloudFormation stack ' + process.env.STACK_NAME);

      cb(null, {
          ... YOUR RESPONSE OBJECT HERE
      });
  }

  module.exports = exports = {
      init: init,
      handleRequest: handleRequest
  };
```

The index.js for your lambda-server based service would be e.g.

```javascript
  var server = require('lambda-server');
  var lambdaFunction = require('./lambdaFunction.js');

  server.init({
      lambdaFunction: lambdaFunction 
  });

  module.exports = exports = {
      handler : server.handler
  };
```

An alternative error handler can be registered (e.g. for logging / notifications) by passing the error handler function in 'errorHandler' during lambda-server-init. e.g.

```javascript
  var server = require('lambda-server');
  var lambdaFunction = require('./lambdaFunction.js');
  var myErrorHandler = function(error, callback) {
    call_your_logging_function_here(error, callback);
  }

  server.init({
      lambdaFunction: lambdaFunction,
      errorHandler: myErrorHandler
  });

  module.exports = exports = {
      handler : server.handler
  };
```

## TODO

Ideas for future versions:

1. hook for keeping the function awake triggered via scheduled event 
2. generic method to manage configuration data for Lambda-based services 
3. functions to ease deployment to Lambda

## Release History

* 2015/11/30 - v0.9.1 - Added capability to register alternative error Handler
* 2015/10/23 - v0.9.0 - Initial version of module

## License

Copyright (c) 2015 [SC5](http://sc5.io/), licensed for users and contributors under MIT license.
https://github.com/SC5/lambda-server/blob/master/LICENSE


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/SC5/lambda-server/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
