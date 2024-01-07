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
  - [Set up repository](#set-up-repository)
  - [Using Terraform](#using-terraform)
  - [Using CDK](#using-cdk)
- [Conclusion](#conclusion)

## Introduction

**Github Actions** is a great tool to automate your software development workflows in the same place you store code and collaborate on pull requests and issues. You can write individual tasks, called actions, and combine them to create a custom workflow. 

Workflows are custom automated processes that you can set up in your repository to build, test, package, release, or deploy any code project on GitHub. In this project, we are going to create a CI/CD pipeline with GitHub Actions for a Golang API deployed in AWS.

### What is CI/CD?

**Continuous Integration and Continuous Delivery (CI/CD)** is a set of practices that automates the processes of building, testing, and deploying code changes. CI/CD is a method to frequently deliver apps to customers by introducing automation into the stages of app development. The main concepts attributed to CI/CD are continuous integration, continuous delivery, and continuous deployment.

- **Continuous Integration** is the practice of automating the integration of code changes from multiple contributors into a single software project. The CI process is comprised of automatic tools that assert the new code’s correctness before integration. A successful CI process results in multiple integrations per day, allowing a team to detect and locate errors quickly. CI is also known as "continuous build" or "daily build".
- **Continuous Delivery** is the practice of keeping your codebase deployable at any point. Beyond making sure your application passes automated tests, continuous delivery involves ensuring that your application `can be deployed to any` environment on demand. Is an approach to software engineering based on producing software in short cycles.
- **Continuous Deployment** is the practice of automatically `deploying new code into production`. With continuous deployment, every change that passes all stages of your production pipeline is released to your customers. There's no human intervention, and only a failed test will prevent a new change to be deployed to production.

### What is a CI/CD Pipeline?

A CI/CD pipeline automates your software delivery process. The pipeline builds code, runs tests (CI), and safely deploys a new version of the application (CD). Automated pipelines remove manual errors, provide standardized feedback loops to developers, and enable fast product iterations.

### What is AWS EC2?

**AWS** stands for Amazon Web Services. It is a cloud computing platform that provides a wide range of services like compute power, database storage, content delivery, and other functionality to help businesses scale and grow.

**Amazon Elastic Compute Cloud (Amazon EC2)** is a web service that provides secure, resizable **compute capacity in the cloud**. It is designed to make web-scale cloud computing easier for developers. Amazon EC2’s simple web service interface allows you to obtain and configure capacity with minimal friction. It provides you with complete control of your computing resources and lets you run on Amazon’s proven computing environment.

## Architecture

![Architecture](/content/projects/load-balancing-aws/architecture.png)

In the above architecture, we have a load balancer that distributes incoming traffic across multiple EC2 instances. You can add and remove instances from your load balancer as your needs change, without disrupting the overall flow of requests to your application. 

In this project, we are going to use **nginx** as our load balancer and **apache** as our web server. We are going to create a load balancing system with EC2 instances and CDK.

### Requirements

- An **Github Account** and a **repository** to store the code
- An AWS account and AWS CLI configured on your computer
- Some knowledge about AWS services like EC2, VPC, IAM, etc.
- A basic knowledge of Linux commands
- A basic knowledge of Docker
- An IDE or text editor, I will be using **Visual Studio Code**

## Implementation

### Set up repository

First, we need to create a repository to store our code. You can create a new repository or use an existing one. I will be using an existing repository called **go-api-gh-actions**.

You can get the code

For this project we are going to use two approaches:

- [Using Terraform](#using-terraform)
- [Using AWS Cloud Development Kit](#using-cdk)

These two approaches are very similar, CDK is proposed by AWS and Terraform is a third party tool. Both of them are great tools to create **infrastructure as code.**

### Using Terraform

### Using CDK

## Conclusion

Load balancing is an important concept in cloud computing. It helps to distribute incoming network traffic across multiple servers. In this project, we have created a load balancing system with EC2 instances and CDK.

CDK is a fantastic tool that allows you to create infrastructure as code. It is an open source software development framework to model and provision your cloud application resources using familiar programming languages. In this project, we have used CDK to create a load balancing system with EC2 instances.


> If you liked this project, please **follow me** on [LinkedIn](https://www.linkedin.com/in/leninner), [Instagram](https://www.instagram.com/leninner/) and [GitHub](https://www.github.com/leninner) to stay tuned for more projects and **be sure** to check out my other [projects](/projects).

