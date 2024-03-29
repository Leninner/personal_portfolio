---
title: 'Host a static website with AWS CDK and Terraform using Amazon Web Services'
type: 'Cloud Computing'
description: 'In this project, we are going to host a static website with AWS Cloud Development Kit. We are going to use AWS LAMBDA, AWS API GATEWAY, AWS S3, AWS CLOUDFRONT, AWS AMPLIFY and AWS DYNAMODB.'
releaseDate: 'Dec 06 2023'
image: "/blog-placeholder-4.jpg"
---
**Summary**

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [Implementation](#implementation)
  - [Using CDK](#using-cdk)
    - [1. Static Web Hosting](#1-static-web-hosting)
    - [2. User Management](#2-user-management)
    - [3. Serverless Backend](#3-serverless-backend)
    - [4. RESTful API](#4-restful-api)
    - [5. Clean Up](#5-clean-up)
  - [Using Terraform](#using-terraform)
    - [1. Static Web Hosting](#1-static-web-hosting-1)
    - [2. User Management](#2-user-management-1)
    - [3. Serverless Backend](#3-serverless-backend-1)
    - [4. Deploy the infrastructure](#4-deploy-the-infrastructure)
- [Recommendation](#recommendation)
- [Conclusion](#conclusion)

## Overview

> **Disclairmer**: This project may incur in costs in your AWS account. **Please be aware.**

In this tutorial, you will create a `simple serverless web application` that enables users to request unicorn rides from the **Wild Rydes fleet**. 

The application will present users with an HTML-based user interface for indicating the location where they would like to be picked up and will interact with a RESTful web service on the backend to submit the request and dispatch a nearby unicorn. 

The application will also provide facilities for users to register with the service and log in before requesting rides.

## Prerequisites

You must have the following requirements:

- An AWS account and AWS CLI configured on your computer
- Some knowledge about AWS services like Lambda, API Gateway, S3, CloudFront, Amplify, DynamoDB, etc.
- A basic knowledge of Linux commands
- **CDK CLI** and **Terraform** installed on your computer
- An `ARCGIS` account, you can create one [here](https://www.arcgis.com/home/signin.html)

## Architecture

![Architecture](/content/projects/serverless-app/architecture.png)

The application architecture uses **AWS Lambda, Amazon API Gateway, Amazon DynamoDB, Amazon Cognito, and AWS Amplify Console**. 

- Amplify Console provides continuous deployment and hosting of the static web resources including HTML, CSS, JavaScript, and image files which are loaded in the user's browser. 
- JavaScript executed in the browser sends and receives data from a public backend API built using Lambda and API Gateway. 
- Amazon Cognito provides user management and authentication functions to secure the backend API. Finally, DynamoDB provides a persistence layer where data can be stored by the API's Lambda function.

## Implementation

For this project I will be using two approaches:

- [Using AWS Cloud Development Kit](#using-cdk)
- [Using Terraform](#using-terraform)

These two approaches are very similar, CDK is proposed by AWS and Terraform is a third party tool. Both of them are great tools to create **infrastructure as code.**

### Using CDK

Create a new project using the following command:

```bash
mkdir serverless-app && cd serverless-app
cdk init app --language typescript
```

#### 1. Static Web Hosting

**AWS Amplify** `hosts static web resources` including HTML, CSS, JavaScript, and image files which are loaded in the user's browser. We are going to configure AWS Amplify to host the static resources for your web application with **continuous deployment** built in.

![Amplify](/content/projects/serverless-app/one.png)

1. Create a new stack in the `/lib` folder called `code-commit-stack.ts`

```bash
cd lib/
touch code-commit-stack.ts
```

2. We have to create a `CodeCommit` instance and also we have to set up an IAM user with Git credentials using the following code:

```typescript
private createCodeCommitRepository(): codecommit.Repository {
  return new codecommit.Repository(this, "CodeCommitRepository", {
    repositoryName: "wildrydes-site",
    description: "Wild Rydes sample application for Serverless Stack",
  });
}

private createUserForCodeCommit(repository: codecommit.Repository): iam.User {
  const user = new iam.User(this, "UserForCodeCommit", {
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSCodeCommitPowerUser"),
    ],
    userName: "user-for-codecommit",
    password: cdk.SecretValue.unsafePlainText('password'),
  });

  repository.grantPullPush(user);
  return user;
}

private createCodeCommitRepoUrlOutput(repository: codecommit.Repository): void {
  new cdk.CfnOutput(this, "CodeCommitRepoUrl", {
    value: repository.repositoryCloneUrlHttp,
  });
}
```

In the previous code, we are defining a `CodeCommit` repository and a user with permissions to push and pull from the repository. We are also creating an output with the repository URL.

3. Sync the code with the AWS Cloud using the following commands:

```bash
cdk synth
```

4. Deploy the stack using the following command:

```bash
cdk deploy CodeCommitStack
```

5. Set up the repository locally using the following commands:

```bash
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
```

6. Clone the repository using the following command:

```bash
git clone <the output of the CodeCommitRepoUrl generated in previous steps>
```

7. Copy the assets from a public S3 bucket using the following command:

```bash
cd wildrydes-site
aws s3 cp s3://wildrydes-us-east-1/WebApplication/1_StaticWebHosting/website ./ --recursive
```

8. Add the files to the repository using the following commands:

```bash
git add .
git commit -m "Add static website assets"
git push
```

9. Enable web hosting with Amplify Console placing the following functions next to the previous functions:

In this function we are creating a service role which will be used by Amplify to access the repository and also we are creating an Amplify application and a default branch which will be the branch to deploy the website. And finally, we are creating two outputs, one with the **Amplify application ID** and another one with the **Amplify application URL.**

```typescript
private createAmplifyHosting(repository: codecommit.Repository): void {
  const amplifyServiceRole = new iam.Role(this, "AmplifyServiceRole", {
    assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
    roleName: "amplify-service-role-for-codecommit",
    description: "Amplify service role",
    inlinePolicies: {
      AmplifyServiceRolePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["codecommit:GitPull"],
            resources: [repository.repositoryArn],
          }),
        ],
      }),
    },
  });

  const amplifyApp = new amplify.CfnApp(this, "AmplifyHosting", {
    name: "wildrydes-site",
    repository: repository.repositoryCloneUrlHttp,
    iamServiceRole: amplifyServiceRole.roleArn,
  });

  new amplify.CfnBranch(this, "MainBranch", {
    branchName: "main",
    appId: amplifyApp.attrAppId,
    enableAutoBuild: true,
  });

  const emailSender = new email.EmailIdentity(this, "Email sender", {
    identity: {
      value: "email-address-to-verify",
    },
  });

  new cdk.CfnOutput(this, "SesIdentityName", {
    value: emailSender.emailIdentityName,
    exportName: "SesIdentityName",
  });

  new cdk.CfnOutput(this, "AmplifyAppId", {
    value: amplifyApp.attrAppId,
  });

  new cdk.CfnOutput(this, "AmplifyAppUrl", {
    value: `https://${amplifyApp.attrAppId}.amplifyapp.com`,
  });
}
```

> Note that we are creating an `emailSender` variable. This variable will be used to verify the email address you are going to use in the next steps. Please verify the email address you are going to use in the next steps seeing the email in your inbox or seing your spam folder.

The final result of the class is:

```typescript
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import * as iam from "aws-cdk-lib/aws-iam";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as email from "aws-cdk-lib/aws-ses";

export class CodeCommitStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const codeCommitRepository = this.createCodeCommitRepository();

    const userForCodeCommit =
      this.createUserForCodeCommit(codeCommitRepository);

    if (userForCodeCommit) {
      codeCommitRepository.grantPullPush(userForCodeCommit);
    }

    this.createAmplifyHosting(codeCommitRepository);

    this.createCodeCommitRepoUrlOutput(codeCommitRepository);
  }

  private createCodeCommitRepository(): codecommit.Repository {
    // code
  }

  private createUserForCodeCommit(
    repository: codecommit.Repository
  ): iam.User | null {
    // code
  }

  private createCodeCommitRepoUrlOutput(
    repository: codecommit.Repository
  ): void {
    // code
  }

  private createAmplifyHosting(repository: codecommit.Repository): void {
    //code
  }
}
```

10.  Sync the code with the AWS Cloud using the following commands:

```bash
cdk synth
```

11. Deploy the stack using the following command:

```bash
cdk deploy CodeCommitStack
```

12.  Go to the Amplify Console and check the deployment and also see the `AmplifyAppUrl` output and check the website in `https://main.<AmplifyAppId>.amplifyapp.com`

![amplify-result](/content/projects/serverless-app/amplify-result.png)

#### 2. User Management

When users visit our website they will first register a new user account. We are going to use **Amazon Cognito** to manage user registration and authentication for our application.

When users have a confirmed account they will be able to log in and by doing so they will receive a JSON Web Token (JWT) which they can use to access the backend API.

![Cognito](/content/projects/serverless-app/two.png)

1. We have to create a new stack in the `/lib` folder called `user-pool-stack.ts`

```bash
cd lib/
touch user-pool-stack.ts
```

2. We have to create a `Cognito User Pool` and a `Cognito User Pool Client` using the following code:

Make sure to replace the `your-email-address` with your email address. In this case, we also have to create an authorizer for the API Gateway. We will use the `CognitoUserPoolsAuthorizer` class to create the authorizer. This class will create a new Cognito User Pool Authorizer and attach it to the API Gateway.

```typescript
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as congnito from "aws-cdk-lib/aws-cognito";

export class UserPoolStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.generateUserPool();
  }

  private generateUserPool() {
    const emailSender = cdk.Fn.importValue("SesIdentityName");

    const userPool = new congnito.UserPool(this, "UserPool", {
      userPoolName: "WildRydes",
      signInAliases: {
        username: true,
      },
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Verify your email for our WildRydes app!",
      },
      email: congnito.UserPoolEmail.withSES({
        fromEmail: emailSender,
        fromName: "Wild Rydes",
      }),
    });

    const userPoolClient = new congnito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: "WildRydesWebApp",
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "UserPoolArn", {
      value: userPool.userPoolArn,
      exportName: "userPoolArn",
    });
  }
}
```

3. Sync the code with the AWS Cloud using the following commands:

```bash
cdk synth
```

4. Deploy the stack using the following command:

```bash
cdk deploy UserPoolStack
```

5. Go to the AWS CloudFormation Console and check the `UserPoolId` and `UserPoolClientId` outputs. And by doing so, you have verify the **email-address** you used in the previous steps seeing the email in your inbox or seing your spam folder.

6. In our repository, we have to modify the `js/config.js` file with the following code:

```javascript
window._config = {
    cognito: {
        userPoolId: 'us-west-2_uXboG5pAb', // e.g. us-east-2_uXboG5pAb
        userPoolClientId: '25ddkmj4v6hfsfvruhpfi7n4hv', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
        region: 'us-west-2' // e.g. us-east-2
    },
    api: {
        invokeUrl: '' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
    }
};
```

Take care of the `userPoolId`, `userPoolClientId` and `region` values. The invokeUrl will be filled in the next steps.

7. Add the files to the repository using the following commands:

```bash
git add .
git commit -m "Add Cognito User Pool credentials"
git push
```

8. In a Finder window or Windows File Explorer, navigate to the wildrydes-site folder you copied to your local machine in Module 1.

9. Open /register.html, or choose the Giddy Up! button on the homepage (index.html page) of your site.
Complete the registration form and choose Let's Ryde. You can use your own email or enter a fake email. Make sure to choose a password that contains at least one upper-case letter, a number, and a special character. Don't forget the password you entered for later. You should see an alert that confirms that your user has been created.

10. Confirm your new user using one of the two following methods:
  - If you used an email address you control, you can complete the account verification process by visiting /verify.html under your website domain and entering the verification code that is emailed to you. Please note, the verification email may end up in your spam folder. For real deployments we recommend configuring your user pool to use Amazon Simple Email Service to send emails from a domain you own.

  - If you used a dummy email address, you must confirm the user manually through the Cognito console.
    - In the Amazon Cognito console, select the WildRydes user pool.
    - In the Users tab, you should see a user corresponding to the email address that you submitted through the registration page. Choose that username to view the user detail page.
    - In the Actions dropdown, select Confirm account to finalize the account creation process.
    - In the Confirm account for user pop-up, choose Confirm.

11. After confirming the new user using either the /verify.html page or the Cognito console, visit /signin.html and log in using the email address and password you entered during the registration step.

12. If successful you should be redirected to /ride.html. You should see a notification that the API is not configured.

#### 3. Serverless Backend

In this section we will create a serverless backend using **AWS Lambda, Amazon API Gateway, and Amazon DynamoDB** to handle the requests from the web application.

![Backend](/content/projects/serverless-app/three.png)

We will implement a **Lambda** function which will be invoked every time a user requests a unicorn ride. The function will store the request in a **DynamoDB** table and then publish a message to an **SNS** topic to notify the appropriate unicorn handler that a new ride request is available.

1. We have to create a new stack in the `/lib` folder called `backend-stack.ts`

```bash
cd lib/
touch backend-stack.ts
```

2. We have to create a `DynamoDB` table creating a function inside the class:

```typescript
private createDynamoDBTable(): dynamodb.Table {
  const ridesTable = new dynamodb.Table(this, "Rides", {
    tableName: "Rides",
    partitionKey: {
      name: "RideId",
      type: dynamodb.AttributeType.STRING,
    },
  });

  new cdk.CfnOutput(this, "RidesTableARN", {
    value: ridesTable.tableArn,
    description: "The ARN of the Rides table",
  });

  return ridesTable;
}
```

3. We have to create an `IAM Role` for the Lambda function. This role will grants your Lambda function permission to write logs to Amazon CloudWatch Logs and access to write items to your DynamoDB table. Put the following code inside the constructor:

```typescript
private generateLambdaRole(tableArn: string): iam.Role {
  return new iam.Role(this, "LambdaRoleForLambda", {
    roleName: "WildRydesLambdaRole",
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      ),
    ],
    inlinePolicies: {
      DynamoDBWriteAccess: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["dynamodb:PutItem"],
            resources: [tableArn],
          }),
        ],
      }),
    },
  });
}
```

4. We have to create a lambda function using the following code:

```typescript
private generateLambdaFunction(role: iam.Role) {
  new lambda.Function(this, "RequestRideFunction", {
    functionName: "RequestUnicorn",
    role: role,
    runtime: lambda.Runtime.NODEJS_16_X,
    handler: "ridesUnicorn.handler",
    code: lambda.Code.fromAsset("../lambda/ridesUnicorn.js"),
  });
}
```

You also have to create a folder called `lambda` in the root of the project and create a file called `ridesUnicorn.js` with the following code:

```javascript
const randomBytes = require('crypto').randomBytes;
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const fleet = [
    {
        Name: 'Angel',
        Color: 'White',
        Gender: 'Female',
    },
    {
        Name: 'Gil',
        Color: 'White',
        Gender: 'Male',
    },
    {
        Name: 'Rocinante',
        Color: 'Yellow',
        Gender: 'Female',
    },
];

exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
    }

    const rideId = toUrlString(randomBytes(16));
    console.log('Received event (', rideId, '): ', event);
    const username = event.requestContext.authorizer.claims['cognito:username'];
    const requestBody = JSON.parse(event.body);

    const pickupLocation = requestBody.PickupLocation;

    const unicorn = findUnicorn(pickupLocation);

    recordRide(rideId, username, unicorn).then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                RideId: rideId,
                Unicorn: unicorn,
                Eta: '30 seconds',
                Rider: username,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function findUnicorn(pickupLocation) {
    console.log('Finding unicorn for ', pickupLocation.Latitude, ', ', pickupLocation.Longitude);
    return fleet[Math.floor(Math.random() * fleet.length)];
}

function recordRide(rideId, username, unicorn) {
    return ddb.put({
        TableName: 'Rides',
        Item: {
            RideId: rideId,
            User: username,
            Unicorn: unicorn,
            RequestTime: new Date().toISOString(),
        },
    }).promise();
}

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

#### 4. RESTful API

This section will create a **RESTful API** using **Amazon API Gateway** to expose the Lambda function we created in the previous section. Also, the code of this module will be placed in the same file as the previous module.

![API](/content/projects/serverless-app/four.png)

1. We have to create an `API Gateway` using the following code:

```typescript
private generateApiGateway(): apigateway.RestApi {
  const api = new apigateway.RestApi(this, "WildRydesApi", {
    restApiName: "WildRydes",
    endpointTypes: [apigateway.EndpointType.EDGE],
    deployOptions: {
      stageName: "prod",
    },
  });

  new cdk.CfnOutput(this, "ApiEndpoint", {
    value: api.url,
  });

  return api;
}
```

> **Note:** Use `edge-optimized` endpoint types for public services being accessed from the Internet. Regional endpoints are typically used for APIs that are accessed primarily from within the same AWS Region.

2. We have to create a `resource` and a `method` for the API Gateway using the following code:

```typescript
private generateResourceAndMethod(
  api: apigateway.RestApi,
  lambdaFunction: lambda.Function
) {
  const rides = api.root.addResource("ride", {
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
    },
  });

  const requestRideIntegration = new apigateway.LambdaIntegration(
    lambdaFunction,
    {
      proxy: true,
    }
  );

  const userPoolArn = cdk.Fn.importValue("userPoolArn");
  const userPool = congnito.UserPool.fromUserPoolArn(
    this,
    "CognitoUserPool",
    userPoolArn
  );

  const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
    this,
    "CognitoUserPoolsAuthorizer",
    {
      cognitoUserPools: [userPool],
      identitySource: "method.request.header.Authorization",
      authorizerName: "CognitoUserPoolsAuthorizer",
    }
  );

  rides.addMethod("POST", requestRideIntegration, {
    authorizationType: apigateway.AuthorizationType.COGNITO,
    authorizer,
  });
}
```

3. The final code of the `backend-stack.ts` file should be like this:

```typescript
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as userPoolStack from "./user-pool-stack";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ridesTable = this.createDynamoDBTable();
    const lambdaRole = this.generateLambdaRole(ridesTable.tableArn);
    const lambda = this.generateLambdaFunction(lambdaRole);
    const api = this.generateApiGateway();
    this.generateResourceAndMethod(api, lambda);
  }

  private createDynamoDBTable(): dynamodb.Table {
    // the code
  }

  private generateLambdaRole(tableArn: string): iam.Role {
    // the code
  }

  private generateLambdaFunction(role: iam.Role): lambda.Function {
    // the code
  }

  private generateApiGateway(): apigateway.RestApi {
    // the code
  }

  private generateResourceAndMethod(
    api: apigateway.RestApi,
    lambdaFunction: lambda.Function
  ) {
    // the code
  }
}
```

4. Sync the code with the AWS Cloud using the following commands:

```bash
cdk synth
```

5. Deploy the stack using the following command:

```bash
cdk deploy BackendStack
```

6. Go to the AWS CloudFormation Console and check the `ApiEndpoint` output. Copy the URL and paste it in the `js/config.js` file in the `invokeUrl` variable.
7. Commit the changes using the following commands:

```bash
git add .
git commit -m "Add API Gateway endpoint"
git push
```

8. Go to the website and request a ride. You should see a notification that the ride request was successful.

#### 5. Clean Up

1. Delete the stacks using the following commands:

```bash
cdk destroy BackendStack
cdk destroy UserPoolStack
cdk destroy CodeCommitStack
```

2. Delete the resources that `CloudFormation` can't
   - DynamoDB Table
   - User
   - User Pool de AWS Cognito

### Using Terraform

Terraform is an open-source `infrastructure as code` software tool created by **HashiCorp**. It enables users to define and provision a datacenter infrastructure using a high-level configuration language known as Hashicorp Configuration Language (HCL), or optionally JSON.

> You can see the previous section to understand the resources we are going to create in this section.

First, create a folder called `serverless-app` and inside create a file called `main.tf` with the following code:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31.0"
    }
  }

  required_version = ">= 1.6.6"
}

provider "aws" {
  region = "us-east-1"
}

module "code_commit_module" {
  source = "./modules/code_commit"
}

module "user_pool_module" {
  source     = "./modules/user_pool"
  depends_on = [module.code_commit_module]

  email_sender = var.email_sender
}

module "backend_module" {
  source     = "./modules/backend_module"
  depends_on = [module.user_pool_module]

  user_pool_arn = module.user_pool_module.user_pool_arn
}
```

and a file called `variables.tf` with the following code:

```hcl
variable "email_sender" {
  type = string
  default = "mazabandalenin180@gmail.com"
}
```

Also, create a folder called `modules` where we are going to create the following modules:

#### 1. Static Web Hosting

**AWS Amplify** `hosts static web resources` including HTML, CSS, JavaScript, and image files which are loaded in the user's browser. We are going to configure AWS Amplify to host the static resources for your web application with **continuous deployment** built in.

![Amplify](/content/projects/serverless-app/one.png)

1. Create a folder inside called `code_commit`, inside this folder, create a new file called `main.tf` inside the with the following code:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31.0"
    }
  }

  required_version = ">= 1.6.6"
}
```

In the previous code we are defining the `aws` provider where we are going to deploy the resources.

2. Create a `resources.tf` file to define the resources we are going to use:

```hcl
resource "aws_codecommit_repository" "wildrydes_site" {
  repository_name = "wildrydes_site"
  description     = "Wild Rydes sample application for Serverless Stack"
  default_branch  = "main"
}

resource "aws_iam_user" "user_for_codecommit" {
  name          = "user_for_codecommit"
  path          = "/"
  force_destroy = true
}

resource "aws_iam_user_login_profile" "user_for_codecommit_password" {
  user            = aws_iam_user.user_for_codecommit.name
  password_length = 8
}

data "aws_iam_policy" "codecommit_user_policy" {
  arn = "arn:aws:iam::aws:policy/AWSCodeCommitPowerUser"
}

resource "aws_iam_user_policy_attachment" "user_for_codecommit_policy" {
  user       = aws_iam_user.user_for_codecommit.name
  policy_arn = data.aws_iam_policy.codecommit_user_policy.arn
}

resource "aws_iam_policy" "codecommit_user_policy" {
  name        = "codecommit_user_policy"
  path        = "/"
  description = "IAM policy to grant pull and push access to CodeCommit repositories"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "codecommit:GitPull",
          "codecommit:GitPush"
        ],
        "Resource" : [
          aws_codecommit_repository.wildrydes_site.arn
        ],
        "Effect" : "Allow"
      },
    ]
  })
}

resource "aws_iam_role" "amplify_service_role_for_codecommit" {
  name        = "amplify_service_role_for_codecommit"
  description = "amplify service role for codecommit"
  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : [
            "sts:AssumeRole"
          ],
          "Effect" : "Allow",
          "Principal" : {
            "Service" : [
              "amplify.amazonaws.com"
            ]
          }
        },
      ]
    }
  )
  inline_policy {
    name = "amplify_service_role_for_codecommit_inline_policy"
    policy = jsonencode({
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : [
            "codecommit:GitPull",
          ],
          "Resource" : [
            aws_codecommit_repository.wildrydes_site.arn
          ],
          "Effect" : "Allow"
        },
      ]
    })
  }
}

resource "aws_amplify_app" "wildrydes_site" {
  name                 = "wildrydes_site"
  repository           = aws_codecommit_repository.wildrydes_site.clone_url_http
  iam_service_role_arn = aws_iam_role.amplify_service_role_for_codecommit.arn
}

resource "aws_amplify_branch" "main" {
  branch_name = "main"
  app_id      = aws_amplify_app.wildrydes_site.id
}
```

3. Create a `outputs.tf` file to define the outputs we are going to use:

```hcl
output "amplify_app_id" {
  value = aws_amplify_app.wildrydes_site.id
}

output "amplify_app_url" {
  value = "https://main.${aws_amplify_app.wildrydes_site.id}.amplifyapp.com"
}

output "code_commit_repository_url" {
  value = aws_codecommit_repository.wildrydes_site.clone_url_http
}

output "iam_user_password" {
  value = aws_iam_user_login_profile.user_for_codecommit_password.password
}

output "username" {
  value = aws_iam_user.user_for_codecommit.name
}
```

#### 2. User Management

When users visit our website they will first register a new user account. We are going to use **Amazon Cognito** to manage user registration and authentication for our application.

When users have a confirmed account they will be able to log in and by doing so they will receive a JSON Web Token (JWT) which they can use to access the backend API.

![Cognito](/content/projects/serverless-app/two.png)

1. Create a new folder called `user_pool` and create a file called `main.tf` with the following code:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31.0"
    }
  }

  required_version = ">= 1.6.6"
}
```

2. Create a `resources.tf` file to define the resources we are going to use:

```hcl
resource "aws_ses_email_identity" "email_sender" {
  email = var.email_sender
}

resource "aws_cognito_user_pool" "wild_rydes" {
  name                       = "WildRydes"
  alias_attributes           = ["preferred_username"]
  email_verification_message = "Your verification code is {####}."
  email_verification_subject = "Your verification code for WildRydes"

  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address    = var.email_sender
    source_arn            = aws_ses_email_identity.email_sender.arn
  }
}

resource "aws_cognito_user_pool_client" "wildRydes_web_app" {
  name         = "WildRydesWebApp"
  user_pool_id = aws_cognito_user_pool.wild_rydes.id
}
```

3. Create a file called `outputs.tf` with the following:

```hcl
output "user_pool_arn" {
  value = aws_cognito_user_pool.wild_rydes.arn
}
```

4. Create a file called `variables.tf` with the following:

```hcl
variable "email_sender" {
  type = string
}
```

#### 3. Serverless Backend

In this section we will create a serverless backend using **AWS Lambda, Amazon API Gateway, and Amazon DynamoDB** to handle the requests from the web application.

![Backend](/content/projects/serverless-app/three.png)

1. Create a folder called `backend_module` and create a file called `main.tf` with the following code:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31.0"
    }
  }

  required_version = ">= 1.6.6"
}
```

2. Create a file called `resources.tf` with the following code:

```hcl
resource "aws_dynamodb_table" "rides" {
  name     = "Rides"
  hash_key = "RideId"
  billing_mode = "PAY_PER_REQUEST"
  attribute {
    name = "RideId"
    type = "S"
  }
}

data "aws_iam_policy" "AWSLambdaBasicExecutionRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role" "wild_rydes_lambda_role" {
  name                = "WildRydesLambdaRole"
  managed_policy_arns = [data.aws_iam_policy.AWSLambdaBasicExecutionRole.arn]
  inline_policy {
    name = "WildRydesLambdaRoleInlinePolicy"
    policy = jsonencode({
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : [
            "dynamodb:PutItem",
          ],
          "Resource" : [
            aws_dynamodb_table.rides.arn
          ],
          "Effect" : "Allow"
        },
      ]
    })
  }
  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : [
            "sts:AssumeRole"
          ],
          "Effect" : "Allow",
          "Principal" : {
            "Service" : [
              "lambda.amazonaws.com"
            ]
          }
        },
      ]
    }
  )
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/rides.js"
  output_path = "${path.module}/lambda/rides.zip"
}

resource "aws_lambda_function" "request_unicorn" {
  role          = aws_iam_role.wild_rydes_lambda_role.arn
  function_name = "RequestUnicorn"
  runtime       = "nodejs16.x"
  filename      = data.archive_file.lambda.output_path
  handler       = "rides.handler"
  timeout       = 30
}

resource "aws_api_gateway_rest_api" "wild_rydes_api" {
  name = "WildRydes"
  endpoint_configuration {
    types = ["EDGE"]
  }
}

resource "aws_api_gateway_authorizer" "cognito_pool_authorizer" {
  name            = "CognitoUserPoolsAuthorizer"
  rest_api_id     = aws_api_gateway_rest_api.wild_rydes_api.id
  type            = "COGNITO_USER_POOLS"
  identity_source = "method.request.header.Authorization"
  provider_arns   = [var.user_pool_arn]
}

resource "aws_api_gateway_resource" "resource" {
  path_part   = "resource"
  parent_id   = aws_api_gateway_rest_api.wild_rydes_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.wild_rydes_api.id
}

resource "aws_api_gateway_method" "wild_rydes_post_method" {
  rest_api_id   = aws_api_gateway_rest_api.wild_rydes_api.id
  resource_id   = aws_api_gateway_resource.resource.id
  http_method   = "POST"
  authorizer_id = aws_api_gateway_authorizer.cognito_pool_authorizer.id
  authorization = "COGNITO_USER_POOLS"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "wild_rydes_api_lambda" {
  rest_api_id             = aws_api_gateway_rest_api.wild_rydes_api.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = aws_api_gateway_method.wild_rydes_post_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.request_unicorn.invoke_arn
}

resource "aws_api_gateway_deployment" "wild_rydes_api" {
  depends_on = [aws_api_gateway_integration.wild_rydes_api_lambda]

  rest_api_id = aws_api_gateway_rest_api.wild_rydes_api.id
  stage_name  = "production"
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.request_unicorn.function_name
  principal     = "apigateway.amazonaws.com"
}
```

3. Create a file called `variables.tf` with the following code:

```hcl
variable "user_pool_arn" {
  description = "The ARN of the user pool"
}
```

4. Create a folder called `lambda` and inside it, create a file called `rides.js` with the following code:

```js
const randomBytes = require('crypto').randomBytes;
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const fleet = [
    {
        Name: 'Angel',
        Color: 'White',
        Gender: 'Female',
    },
    {
        Name: 'Gil',
        Color: 'White',
        Gender: 'Male',
    },
    {
        Name: 'Rocinante',
        Color: 'Yellow',
        Gender: 'Female',
    },
];

exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
    }

    const rideId = toUrlString(randomBytes(16));
    console.log('Received event (', rideId, '): ', event);

    // Because we're using a Cognito User Pools authorizer, all of the claims
    // included in the authentication token are provided in the request context.
    // This includes the username as well as other attributes.
    const username = event.requestContext.authorizer.claims['cognito:username'];

    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.
    const requestBody = JSON.parse(event.body);

    const pickupLocation = requestBody.PickupLocation;

    const unicorn = findUnicorn(pickupLocation);

    recordRide(rideId, username, unicorn).then(() => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.

        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                RideId: rideId,
                Unicorn: unicorn,
                Eta: '30 seconds',
                Rider: username,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

// This is where you would implement logic to find the optimal unicorn for
// this ride (possibly invoking another Lambda function as a microservice.)
// For simplicity, we'll just pick a unicorn at random.
function findUnicorn(pickupLocation) {
    console.log('Finding unicorn for ', pickupLocation.Latitude, ', ', pickupLocation.Longitude);
    return fleet[Math.floor(Math.random() * fleet.length)];
}

function recordRide(rideId, username, unicorn) {
    return ddb.put({
        TableName: 'Rides',
        Item: {
            RideId: rideId,
            User: username,
            Unicorn: unicorn,
            RequestTime: new Date().toISOString(),
        },
    }).promise();
}

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

#### 4. Deploy the infrastructure

1. Initialize the project using the following command in the root of the project:

```bash
terraform init
```

2. See the plan of the infrastructure using the following command:

```bash
terraform plan
```

3. Deploy the infrastructure using the following command:

```bash
terraform apply
```

In this part, you may see an error related to the `email sender`. To fix this, simply go to your spam folder and confirm the email and deploy again.

4. See the outputs of the infrastructure using the following command:

```bash
terraform output
```

5. Set up the repository locally using the following commands:

```bash
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
```

7. Clone the repository using the following command:

You can see the output of the `code_commit_repository_url` in the previous step or in the **AWS Console**.

```bash
git clone <the output of the CodeCommitRepoUrl generated in previous steps>
```

8. Copy the assets from a public S3 bucket using the following command:

```bash
cd wildrydes-site
aws s3 cp s3://wildrydes-us-east-1/WebApplication/1_StaticWebHosting/website ./ --recursive
```

9. Add the files to the repository using the following commands:

```bash
git add .
git commit -m "Add static website assets"
git push
```

10. See the `amplify_app_url` output and check the website in `https://main.<amplify_app_id>.amplifyapp.com`

![amplify-result](/content/projects/serverless-app/amplify-result.png)

> You can follow the steps in the previous section to see the result of the project.

11. Delete the infrastructure using the following command:

```bash
terraform destroy
```

> You can see the entire code of this project in my [GitHub](https://github.com/Leninner/cloud/tree/main/aws/terraform/serverless-app)

## Recommendation

Remember that the final result of the project is directly related to the **AWS Serverless Web Applications Workshop**. I recommend that you follow the workshop to understand the project and also to learn more about AWS services. Also, I recommend that if any errors occur in the actual `production code`(not the code related to the infrastructure), you forget about it and **make sure the infrastructure is working correctly**.

![Workshop error output](/content/projects/serverless-app/error.png)

You can test your lambda directly in the AWS Console to check if the code is working correctly. This is an image of the result of my infrastructure:

![result](/content/projects/serverless-app/api.png)

## Conclusion

Writing **infrastructure as code** is a great way to provision and manage your cloud resources. It allows you to automate your infrastructure deployments and make them repeatable. CDK and Terraform are great tools to do that.

AWS Lambda is a great service to run your code without provisioning or managing servers. It is a serverless service that allows you to run your code for virtually any type of application or backend service and you can combine it with other AWS services to build powerful applications.

You can see the entire code of this project in my [GitHub](https://github.com/Leninner/cloud/tree/main/aws/cdk/serverless-app). Remember that this project is based on the [AWS Serverless Web Application Workshop](https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/)

> If you liked this project, please **follow me** on [LinkedIn](https://www.linkedin.com/in/leninner), [Instagram](https://www.instagram.com/leninner/) and [GitHub](https://www.github.com/leninner) to stay tuned for more projects and **be sure** to check out my other [projects](/projects).

