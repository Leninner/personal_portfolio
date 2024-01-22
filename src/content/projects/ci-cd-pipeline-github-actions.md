---
title: 'CI/CD Pipeline with GitHub Actions for a Golang Api Deployed in AWS'
type: 'DevOps'
description: 'Github Actions allows you to automate your software development workflows in the same place you store code and collaborate on pull requests and issues. You can write individual tasks, called actions, and combine them to create a custom workflow. Workflows are custom automated processes that you can set up in your repository to build, test, package, release, or deploy any code project on GitHub. In this project, we are going to create a CI/CD pipeline with GitHub Actions for a Golang API deployed in AWS.'
releaseDate: '06 Jan 2024'
image: "/blog-placeholder-2.jpg"
---
**Summary**

- [Introduction](#introduction)
  - [What is CI/CD?](#what-is-cicd)
  - [What is a CI/CD Pipeline?](#what-is-a-cicd-pipeline)
  - [What is AWS EC2?](#what-is-aws-ec2)
- [Architecture](#architecture)
  - [Requirements](#requirements)
- [Implementation](#implementation)
  - [Part 1: Create a Continuous Integration (CI) Pipeline](#part-1-create-a-continuous-integration-ci-pipeline)
  - [Part 2: Create a Continuous Delivery (CD) Pipeline](#part-2-create-a-continuous-delivery-cd-pipeline)
- [Conclusion](#conclusion)

## Introduction

**Github Actions** is a great tool to automate your software development workflows in the same place you store code and collaborate on pull requests and issues. You can write individual tasks, `called actions`, and combine them to create a custom workflow.

Workflows are custom automated processes that you can set up in your repository to build, test, package, release, or deploy any code project on GitHub. In this project, we are going to create a CI/CD pipeline with GitHub Actions for a Golang API deployed in AWS.

### What is CI/CD?

**Continuous Integration and Continuous Delivery (CI/CD)** is a set of practices that automates the processes of building, testing, and deploying code changes. CI/CD is a method to `frequently deliver apps to customers` by introducing automation into the stages of app development. The main concepts attributed to CI/CD are continuous integration, continuous delivery, and continuous deployment.

- **Continuous Integration** is the practice of `automating the integration` of code changes from multiple contributors into a single software project. The CI process is comprised of automatic tools that assert the new code’s correctness before integration. A successful CI process results in multiple integrations per day, allowing a team to detect and `locate errors quickly`. CI is also known as **"continuous build"** or **"daily build".**
- **Continuous Delivery** is the practice of **keeping** your codebase `deployable` at any point. Beyond making sure your application passes automated tests, continuous delivery involves ensuring that your application `can be deployed to any` environment on demand. Is an approach to software engineering based on producing software in short cycles.
- **Continuous Deployment** is the practice of automatically `deploying new code into production`. With continuous deployment, every change that passes all stages of your production pipeline is released to your customers. There's no human intervention, and only a failed test will prevent a new change to be deployed to production.

### What is a CI/CD Pipeline?

A CI/CD pipeline automates your software delivery process. The pipeline builds code, runs tests (CI), and safely deploys a new version of the application (CD). Automated pipelines **remove manual errors**, provide standardized feedback loops to developers, and enable fast product iterations.

### What is AWS EC2?

**AWS** stands for Amazon Web Services. It is a cloud computing platform that provides a wide range of services like compute power, database storage, content delivery, and other functionality to help businesses scale and grow.

**Amazon Elastic Compute Cloud (Amazon EC2)** is a web service that provides secure, resizable **compute capacity in the cloud**. It is designed to make web-scale cloud computing easier for developers. Amazon EC2’s simple web service interface allows you to obtain and configure capacity with minimal friction. It provides you with complete control of your computing resources and lets you run on Amazon’s proven computing environment.

## Architecture

![Architecture](/content/projects/load-balancing-aws/architecture.png)

In the above architecture, we have a Golang API that is in a Giyhub repository. We are going to create a CI/CD pipeline with Github Actions to build and deploy the API in AWS EC2 instances. We are going to use **terraform** to create the infrastructure in AWS.

### Requirements

- A **Github Account**
- An AWS account and AWS CLI configured on your computer
- Some knowledge about AWS services like EC2, VPC, IAM, etc.
- A basic knowledge of Linux commands
- An IDE or text editor, I will be using **Visual Studio Code**

## Implementation

First, we need to create a repository to store our code. You can create a new repository or use an existing one. I will be using an existing repository called **go-api-gh-actions**.

You can get the code of the **golang api** in the following repository: [go-api-gh-actions](https://github.com/Leninner/go-api-rest-gh-actions). It is a simple API to manage a list of tasks. You can create, update, delete, and get tasks. It is a simple API to demostrate how to create a CI/CD pipeline with Github Actions.

Download as a zip file and extract it in your computer and upload it to your repository.

### Part 1: Create a Continuous Integration (CI) Pipeline

We will create the first part of our architecture, the CI pipeline. The CI pipeline will build the code and run the tests. 

This pipeline will be triggered when we create a pull request to the develop branch. If the code builds successfully and the tests pass, the pull request will be merged to the develop branch.

1. Go to your local repository and create a new branch called **develop** and push it to your remote repository.

```bash
git checkout -b develop
git push origin develop
```

2. Create another branch called **feature/ci-pipeline** and we will work in this branch.

```bash
git checkout -b feature/ci-pipeline
```

3. Create a new file called **ci-pipeline.yml** in the **.github/workflows** folder. This file will contain the configuration of our CI pipeline.

```bash
mkdir -p .github/workflows
touch .github/workflows/ci-pipeline.yml
```

4. Open the **ci-pipeline.yml** file and add the following code.

In this file we are defining three jobs:

- **Lint**: This job will run **golangci-lint** to lint our code and check for errors.
- **Test**: This job will run the tests.
- **Build**: This job will build our code. This job is optional. You can add some logic to deploy the code to an development environment.

Keep in mind that every job depends on the previous job. If the previous job fails, the next job will not run.

```yaml
name: Continuous Integration for Go simple api

on:
  pull_request:
    branches: [develop]

jobs:
  format_and_check_possible_static_errors:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: 1.16

      - name: Format and check possible static errors
        run: gofmt -l . && go vet ./...
  
  test:
    runs-on: ubuntu-latest
    needs: format_and_check_possible_static_errors
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: 1.16

      - name: Test Go api
        run: go test -v ./...
```

5. Commit and push the changes to your remote repository.

```bash
git add .
git commit -m "Add ci pipeline file"
git push origin feature/ci-pipeline
```

6. Now, we can open a pull request to merge the **feature/ci-pipeline** branch to the **develop** branch.

![Open PR](/content/projects/ci-cd-pipeline-gh-actions/open-pr.png)

7. Select the **develop** branch as the base branch and the **feature/ci-pipeline** branch as the compare branch. Click on **Create pull request**.

![Opening pr](/content/projects/ci-cd-pipeline-gh-actions/opening-pr.png)

8. Now, we can go to the **Actions** tab and see the status of our pipeline.

![CI status](/content/projects/ci-cd-pipeline-gh-actions/ci-status.png)

As you can see, there are some errors in the code, so we need to fix them.

Go to the code and update the `struct Task` replacing the current struct with the following code.

```go
type task struct {
	ID      int    `json:"ID"`
	Name    string `json:"Name"`
	Content string `json:"Content"`
}
```

9. Commit and push the changes to your remote repository.

```bash
git add .
git commit -m "Fix struct task"
git push origin feature/ci-pipeline
```

10. Go to the **Actions** tab and see the status of our pipeline.

![CI Status success](/content/projects/ci-cd-pipeline-gh-actions/ci-status-success.png)

And as you can see, the pipeline is green and the pull request can be merged.

### Part 2: Create a Continuous Delivery (CD) Pipeline

Now, we are going to create the second part of our architecture, the CD pipeline. The CD pipeline will deploy the code to an AWS EC2 instance.

This pipeline will be triggered when we merge a pull request to the main branch. If the code builds successfully and the tests pass, the code will be deployed to an AWS EC2 instance.

1. Go to the local repository, pull all the changes from the remote repository from **develop** and we will work in this branch.

```bash
git checkout develop
git pull origin develop
```

2. Create a file called `cd-pipeline.yml` in the `.github/workflows` folder. This file will contain the configuration of our CD pipeline.

```bash
touch .github/workflows/cd-pipeline.yml
```

3. Open the `cd-pipeline.yml` file and add the following code.

In this file we are defining two jobs:

- **Build**: This job will build our code.
- **Deploy**: This job will deploy our code to an AWS EC2 instance.

Keep in mind that every job depends on the previous job. If the previous job fails, the next job will not run.

```yaml
name: Continuous Delivery for Go simple api

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: 1.16

      - name: Build Go api
        run: go build -o go-api-rest-gh-actions

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: 1.16

      - name: Deploy Go api
        run: |
          ssh -o StrictHostKeyChecking=no -i ${{ secrets.PRIVATE_KEY }} ${{ secrets.USERNAME }}@${{ secrets.HOST }} "sudo systemctl stop go-api-rest-gh-actions"
          scp -o StrictHostKeyChecking=no -i ${{ secrets.PRIVATE_KEY }} go-api-rest-gh-actions ${{ secrets.USERNAME }}@${{ secrets.HOST }}:/home/${{ secrets.USERNAME }}/go-api-rest-gh-actions
          ssh -o StrictHostKeyChecking=no -i ${{ secrets.PRIVATE_KEY }} ${{ secrets.USERNAME }}@${{ secrets.HOST }} "sudo systemctl start go-api-rest-gh-actions"
```

4. Now, we need to have an EC2 instance running in AWS where we can deploy our code. We are going to use **terraform** to create the infrastructure in AWS.
   1. Create a new folder called **terraform** in the root of the repository.
   2. Create and open a **main.tf** file and add the following code.

    ```hcl
    terraform {
      required_providers {
        aws = {
          source  = "hashicorp/aws"
          version = "~> 5.33.0"
        }
      }

      required_version = ">= 1.6.6"
    }

    provider "aws" {
      region = var.aws_region
    }

    data "aws_vpc" "default" {
      default = true
    }

    resource "aws_instance" "go_api_server" {
      ami = var.ami
      instance_type = var.instance_type
      vpc_security_group_ids = [ aws_security_group.security_group.id ]

      user_data = <<-EOF
                  #!/bin/bash
                  sudo yum update -y
                  sudo yum install -y golang
                  EOF

      tags = {
        Name = "go-api-server"
      }
    }

    resource "aws_security_group" "security_group" {
      vpc_id      = data.aws_vpc.default.id
      description = "Allow SSH (TCP port 22) and HTTP (TCP port 80) in"
      name = "go-api-server-sg"

      egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
      }

      ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = var.allowed_ssh_cidr_blocks
        description = "Allow SSH access from the world"
      }

      ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = var.allowed_http_cidr_blocks
        description = "Allow HTTP access from the world"
      }
    }
    ```

   3. Create and open a **variables.tf** file and add the following code.

    ```hcl
    variable "aws_region" {
      description = "AWS region"
      default     = "us-east-1"
    }

    variable "instance_type" {
      description = "EC2 instance type"
      default     = "t2.micro"
    }

    variable "ami" {
      description = "Amazon Machine Image ID"
      default     = "ami-0e9107ed11be76fde"
    }

    variable "allowed_ssh_cidr_blocks" {
      description = "List of CIDR blocks allowed to SSH into the instance"
      type        = list(string)
      default     = ["0.0.0.0/0"]
    }

    variable "allowed_http_cidr_blocks" {
      description = "List of CIDR blocks allowed to access the instance over HTTP"
      type        = list(string)
      default     = ["0.0.0.0/0"]
    }
    ```


## Conclusion

Load balancing is an important concept in cloud computing. It helps to distribute incoming network traffic across multiple servers. In this project, we have created a load balancing system with EC2 instances and CDK.

CDK is a fantastic tool that allows you to create infrastructure as code. It is an open source software development framework to model and provision your cloud application resources using familiar programming languages. In this project, we have used CDK to create a load balancing system with EC2 instances.

> If you liked this project, please **follow me** on [LinkedIn](https://www.linkedin.com/in/leninner), [Instagram](https://www.instagram.com/leninner/) and [GitHub](https://www.github.com/leninner) to stay tuned for more projects and **be sure** to check out my other [projects](/projects).

