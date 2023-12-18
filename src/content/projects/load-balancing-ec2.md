---
title: 'A load balancing system using Amazon Web Services (AWS)'
type: 'Cloud Computing'
description: 'A load balancing system is a system that distributes incoming network traffic across multiple servers. This ensures no single server bears too much demand. By spreading the work evenly, load balancing improves application responsiveness. It also increases availability of applications and websites for users. Load balancing is performed by an algorithm known as a load balancer. In AWS, you can use Elastic Load Balancing to automatically distribute incoming traffic across multiple targets, such as Amazon EC2 instances, containers, IP addresses, and Lambda functions. It can handle the varying load of your application traffic in a single Availability Zone or across multiple Availability Zones. Elastic Load Balancing offers three types of load balancers that all feature the high availability, automatic scaling, and robust security necessary to make your applications fault tolerant.'
releaseDate: 'Nov 20 2023'
image: "/blog-placeholder-3.jpg"
---
**Summary**

- [Introduction](#introduction)
  - [Load Balancer Types](#load-balancer-types)
- [Architecture](#architecture)
  - [Requirements](#requirements)
- [Implementation](#implementation)
  - [Using Terraform](#using-terraform)
  - [Using CDK](#using-cdk)
- [Conclusion](#conclusion)

## Introduction

A **load balancing** system is a system that distributes incoming network traffic `across multiple servers`. This ensures no single server bears too much demand. By spreading the work evenly, load balancing improves application responsiveness. It also increases availability of applications and websites for users. Load balancing is performed by an algorithm `known as a load balancer`. 

The load balancer distributes incoming client requests to computing resources such as application servers and databases. It also ensures availability and performance by monitoring the health of applications and only sending requests to servers and applications that can respond in a timely manner.

In AWS, you can use **Elastic Load Balancing** to automatically distribute incoming traffic across multiple targets, such as Amazon EC2 instances, containers, IP addresses, and Lambda functions. 

It can handle the varying load of your application traffic in a **single** Availability Zone or **across multiple** Availability Zones. Elastic Load Balancing offers three types of load balancers that all feature the high availability, automatic scaling, and robust security necessary to make your applications fault tolerant.

> **Disclairmer**: This projecy may incur in costs in your AWS account. Please be aware of that.

### Load Balancer Types

Elastic Load Balancing supports these types of load balancers: Application Load Balancers, Network Load Balancers and Classic Load Balancers.

**Application Load Balancer** 

- Best suited for load balancing of **HTTP and HTTPS traffic** and provides advanced request routing targeted at the delivery of modern application architectures, including microservices and containers. 
- Operating at the individual request level **(Layer 7)**.
- Application Load Balancer routes traffic to targets within **Amazon Virtual Private Cloud (Amazon VPC)** based on the content of the request.

**Network Load Balancer** 

- Best suited for load balancing of Transmission Control Protocol **(TCP)**, User Datagram Protocol **(UDP)**, and Transport Layer Security **(TLS)** traffic where extreme performance is required. 
- Operating at the connection level **(Layer 4)**. 
- Network Load Balancer routes traffic to targets within **Amazon Virtual Private Cloud (Amazon VPC)** and is capable of handling millions of requests per second while maintaining ultra-low latencies.

**Classic Load Balancer** 

- Provides basic load balancing across multiple Amazon EC2 instances and operates at both the request level and connection level. Classic Load Balancer is intended for applications that were built within the EC2-Classic network.

> You can read more about the load balancer types [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/load-balancer-types.html).

## Architecture

![Architecture](/content/projects/load-balancing-aws/architecture.png)

In the above architecture, we have a load balancer that distributes incoming traffic across multiple EC2 instances. You can add and remove instances from your load balancer as your needs change, without disrupting the overall flow of requests to your application. 

In this project, we are going to use **nginx** as our load balancer and **apache** as our web server. We are going to create a load balancing system with EC2 instances and CDK.

### Requirements

- An AWS account and AWS CLI configured on your computer
- Some knowledge about AWS services like EC2, VPC, IAM, etc.
- A basic knowledge of Linux commands
- **CDK CLI** and **Terraform** installed on your computer
- An IDE or text editor, I will be using **Visual Studio Code**

> Remeber that if is the first time you are running the stacks in the region, you have to run the `cdk bootstrap` command to prepare the environment for the stacks.

## Implementation

For this project I will be using two approaches:

- [Using Terraform](#using-terraform)
- [Using AWS Cloud Development Kit](#using-cdk)

These two approaches are very similar, CDK is proposed by AWS and Terraform is a third party tool. Both of them are great tools to create **infrastructure as code.**

### Using Terraform

Terraform is an open-source `infrastructure as code` software tool created by **HashiCorp**. It enables users to define and provision a datacenter infrastructure using a high-level configuration language known as Hashicorp Configuration Language (HCL), or optionally JSON.

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

## Conclusion

Load balancing is an important concept in cloud computing. It helps to distribute incoming network traffic across multiple servers. In this project, we have created a load balancing system with EC2 instances and CDK.

CDK is a fantastic tool that allows you to create infrastructure as code. It is an open source software development framework to model and provision your cloud application resources using familiar programming languages. In this project, we have used CDK to create a load balancing system with EC2 instances.


> If you liked this project, please **follow me** on [LinkedIn](https://www.linkedin.com/in/leninner), [Instagram](https://www.instagram.com/leninner/) and [GitHub](https://www.github.com/leninner) to stay tuned for more projects and **be sure** to check out my other [projects](/projects).

