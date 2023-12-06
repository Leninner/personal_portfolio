---
title: 'Host a static website with AWS Cloud Development Kit'
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
  - [Using Terraform](#using-terraform)
- [Conclusion](#conclusion)

## Overview

> **Disclairmer**: This projecy may incur in costs in your AWS account. Please be aware of that.

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

The AWS Cloud Development Kit (AWS CDK) is a framework to model and provision your cloud application resources using familiar programming languages. AWS CDK provisions your resources in a safe, repeatable manner through **AWS CloudFormation**.

1. Bootstrap an application using CDK CLI

```bash
mkdir load-balancing-aws
cd load-balancing-aws
cdk init app --language typescript
```

2. Create folder called `data` which will contain the user data scripts for the EC2 instances.
3. In the `data` folder, create a file called `user-data-server.sh` and add the following code:

We are going to use this script to install the web server using NGINX.

```bash
#!/bin/bash
yum update -y
sudo su

amazon-linux-extras install -y nginx1.12

systemctl start nginx
systemctl enable nginx

echo "Hello World from $(hostname -f)" > /usr/share/nginx/html/index.html
```

4. In the `data` folder, create a file called `user-data-load-balancer.sh` and add the following code:

```bash
#!/bin/bash
yum update -y
sudo su

amazon-linux-extras install -y nginx1.12

echo <<EOF > /etc/nginx/conf.d/load-balancer.conf
upstream backend {
    server
    server 
    server
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
EOF

systemctl start nginx
systemctl enable nginx
```

5. In the `lib` folder, in the generated file `load-balancing-aws-stack.ts`, add the following code:

This code is for the load balancer and the EC2 instances.

```typescript
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { readFileSync } from "fs";

export class LoadBalancingAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Set up the default VPC for the region
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });

    // Create a security group with all outbound traffic allowed
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc,
      description: "Allow SSH (TCP port 22) and HTTP (TCP port 80) in",
      allowAllOutbound: true,
    });

    // Allow SSH and HTTP traffic in from anywhere
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access from the world"
    );

    // Allow SSH and HTTP traffic in from anywhere
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP access from the world"
    );

    // Create an Amazon Machine image
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: ec2.AmazonLinuxCpuType.X86_64,
    });

    // Create an instance for the load balancer
    const loadBalancerInstance = new ec2.Instance(this, "LoadBalancerInstance", {
      vpc,
      instanceType: new ec2.InstanceType("t2.micro"),
      machineImage: ami,
      securityGroup,
    })

    // Create two instances for the web servers
    const webServerInstanceOne = new ec2.Instance(this, "WebServerInstanceOne", {
      vpc,
      instanceType: new ec2.InstanceType("t2.micro"),
      machineImage: ami,
      securityGroup,
    })

    const webServerInstanceTwo = new ec2.Instance(this, "WebServerInstanceTwo", {
      vpc,
      instanceType: new ec2.InstanceType("t2.micro"),
      machineImage: ami,
      securityGroup,
    })

    // Add the user data scripts to the instances
    const userDataLoadBalancer = readFileSync("./data/user-data-load-balancer.sh", "utf8");
    const userDataWordpress = readFileSync("./data/user-data-server.sh", "utf8");

    loadBalancerInstance.addUserData(userDataLoadBalancer);
    webServerInstanceOne.addUserData(userDataWordpress);
    webServerInstanceTwo.addUserData(userDataWordpress);
  }
}
```

6. In the `bin` folder, in the generated file `load-balancing-aws.ts`, add the following code:

```typescript
#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LoadBalancingAwsStack } from "../lib/load-balancing-aws-stack";

const app = new cdk.App();

new LoadBalancingAwsStack(app, "LoadBalancingAwsStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stackName: "LoadBalancingAwsStack",
  description: "AWS CDK Load Balancing stack",
});
```

7. To deploy:
  - If you want to deploy to a specific environment, you would like to have an AWS Account for each environment. You can use the `cdk-deploy-to-[env].sh` script to deploy the stack to your AWS account. You can find the script in the root folder of the project.

  We are going to deploy to the `dev` environment, so create a file called `cdk-deploy-to-dev.sh` and add the following code:

  ```bash
  #!/usr/bin/env bash
  if [[ $# -ge 2 ]]; then
      export CDK_DEPLOY_ACCOUNT=$1
      export CDK_DEPLOY_REGION=$2
      shift; shift
      npx cdk deploy "$@"
      exit $?
  else
      echo 1>&2 "Provide account and region as first two args."
      echo 1>&2 "Additional args are passed through to cdk deploy."
      exit 1
  fi
  ```

10. Run the `cdk-deploy-to-dev.sh` script to deploy the stack to your AWS account.

```bash
bash cdk-deploy-to-dev.sh your-aws-account-id your-aws-region --profile your-aws-profile
```

11. After the deployment is complete, you can see the resources created in your AWS account going to the AWS CloudFormation console.

### Using Terraform

Terraform is an open-source `infrastructure as code` software tool created by **HashiCorp**. It enables users to define and provision a datacenter infrastructure using a high-level configuration language known as Hashicorp Configuration Language (HCL), or optionally JSON.


## Conclusion

Writing **infrastructure as code** is a great way to provision and manage your cloud resources. It allows you to automate your infrastructure deployments and make them repeatable. CDK and Terraform are great tools to do that.

AWS Lambda is a great service to run your code without provisioning or managing servers. It is a serverless service that allows you to run your code for virtually any type of application or backend service and you can combine it with other AWS services to build powerful applications.

If you liked this project, please follow me on [LinkedIn](https://www.linkedin.com/in/leninner), [Instagram]() and [GitHub](https://www.github.com/leninner) to stay tuned for more projects and **be sure** to check out my other [projects](/projects).

