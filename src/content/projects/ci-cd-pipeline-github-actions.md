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
name: CI Pipeline for Go API

on:
  pull_request:
    branches: [develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Go
        uses: actions/setup-go@v2
        with:
          go-version: 1.16

      - name: Build
        run: go build -v

      - name: Test
        run: go test -v ./...

  
```

## Conclusion

Load balancing is an important concept in cloud computing. It helps to distribute incoming network traffic across multiple servers. In this project, we have created a load balancing system with EC2 instances and CDK.

CDK is a fantastic tool that allows you to create infrastructure as code. It is an open source software development framework to model and provision your cloud application resources using familiar programming languages. In this project, we have used CDK to create a load balancing system with EC2 instances.

> If you liked this project, please **follow me** on [LinkedIn](https://www.linkedin.com/in/leninner), [Instagram](https://www.instagram.com/leninner/) and [GitHub](https://www.github.com/leninner) to stay tuned for more projects and **be sure** to check out my other [projects](/projects).

