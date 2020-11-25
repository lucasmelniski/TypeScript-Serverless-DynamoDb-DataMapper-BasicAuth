import type { Serverless } from 'serverless/aws';


const DYNAMO_TABLE = `AllPizzaDb`

const serverlessConfiguration: Serverless = {
    service: {
        name: "finalProject",
    },
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true
        }
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack', 'serverless-offline'], //"serverless-basic-authentication"
    provider: {
        name: 'aws',
        region: 'sa-east-1',
        runtime: 'nodejs12.x',
        iamRoleStatements: [{
            Effect: "Allow",
            Action: [
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            Resource: `arn:aws:dynamodb:sa-east-1:436239521951:table/${DYNAMO_TABLE}`
        }],
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            DYNAMO_TABLE,
        },
        apiKeys: ["Admin"]
    },
    functions: {
        createPizza: {
            handler: './handlers/createPizza.handler',
            events: [
                {
                    http: {
                        method: 'put',
                        path: '/createPizza',
                        cors: true,
                        private: true
                    }
                }
            ]
        },
        deleteCategory: {
            handler: './handlers/deleteCategory.handler',
            events: [
                {
                    http: {
                        method: 'delete',
                        path: '/deleteCategory',
                        cors: true,
                        private: true
                    }
                }
            ]
        },
        addCategory: {
            handler: './handlers/addCategory.handler',
            events: [
                {
                    http: {
                        method: 'post',
                        path: '/addCategory',
                        cors: true,
                        private: true
                    }
                }
            ]
        },
        getAll: {
            handler: './handlers/getAll.handler',
            events: [
                {
                    http: {
                        method: 'get',
                        path: '/getAll',
                        cors: true
                    }
                }
            ]
        },
    },
    resources: {
        Resources: {
            // GatewayResponse: {
            //     Type: "AWS::ApiGateway::GatewayResponse",
            //     Properties: {
            //         ResponseParameters:
            //             { "gatewayresponse.header.WWW-Authenticate": "'Basic'" },
            //         ResponseType: "UNAUTHORIZED",
            //         RestApiId:
            //             { Ref: "ApiGatewayRestApi" },
            //         StatusCode: '401'
            //     }
            // },
            MainTable: {
                Type: 'AWS::DynamoDB::Table',
                DeletionPolicy: 'Retain',
                Properties: {
                    AttributeDefinitions: [{
                        AttributeName: 'id',
                        AttributeType: 'S'
                    }],
                    KeySchema: [{
                        AttributeName: 'id',
                        KeyType: 'HASH'
                    }],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    },
                    TableName: DYNAMO_TABLE
                }
            }
        }
    }
}

module.exports = serverlessConfiguration;
