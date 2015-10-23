var expect = require('expect');
var lambdaServer = require('./index.js');
var sampleFunction = require('./sampleFunction.js');

describe('lambda-server', function() {
    describe('lambda-server.init', function() {
        it('gives error if initialized without options', function(done) {
            if (! lambdaServer.init()) {
                return done();
            };
            done('INIT_WITHOUT_OPTIONS');
        });

        it('gives error if initialized without lambdaFunction', function(done) {
            if (! lambdaServer.init({})) {
                return done();
            };
            done('INIT_WITHOUT_LAMBDAFUNCTION');
        });
        it('gives error if initialized without lambdaFunction', function(done) {
            if (! lambdaServer.init({ lambdaFunction: {} })) {
                return done();
            };
            done('INIT_WITHOUT_LAMBDAFUNCTION_HANDLER');
        });
    });

    describe('lambda-server.handleRequest (init)', function() {
        it('Initializes the stack name based on lambda function name', function(done) {
            process.env['AWS_LAMBDA_FUNCTION_NAME'] = 'stack-function-12345';
            process.env['STACK_NAME'] = '';
            lambdaServer.init({ lambdaFunction: sampleFunction });
            lambdaServer.handler({}, {
                succeed: function() {
                    expect('stack').toEqual(process.env.STACK_NAME);
                    done();
                },
                fail: done
            });        
        });

        it('Utilizes the existing STACK_NAME if has been set', function(done) {
            process.env['AWS_LAMBDA_FUNCTION_NAME'] = '';
            process.env['STACK_NAME'] = 'envstack'
            lambdaServer.init({ lambdaFunction: sampleFunction });
            lambdaServer.handler({}, {
                succeed: function() {
                    expect('envstack').toEqual(process.env.STACK_NAME);
                    done();
                },
                fail: done
            });
        });

        it('Returns an error if AWS_LAMBDA_FUNCTION_NAME and STACK_NAME are both unset', function(done) {
            delete process.env['AWS_LAMBDA_FUNCTION_NAME'];
            delete process.env['STACK_NAME'];
            lambdaServer.init({ lambdaFunction: sampleFunction });
            lambdaServer.handler({}, {
                succeed: function() {
                    done('EXPECTED_ERROR')
                },
                fail: function() {
                    done();
                }
            });
        });
    });

    describe('lambda-server.handleRequest (handle)', function() {
        it('Initializes the stack name based on lambda function name', function(done) {
            process.env['AWS_LAMBDA_FUNCTION_NAME'] = 'testStack-function-12345';
            process.env['STACK_NAME'] = '';
            lambdaServer.init({ lambdaFunction: sampleFunction });
            lambdaServer.handler({
                a: 5,
                b: 10
            }, {
                succeed: function(response) {
                    expect('15').toEqual(response.sum);
                    expect('testStack').toEqual(response.stack);
                    done();
                },
                fail: done
            });        
        });
    });
});