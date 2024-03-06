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
  - [Part 3: Define the secrets](#part-3-define-the-secrets)
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

![Architecture](/content/projects/ci-cd-pipeline-gh-actions/architecture.png)

In the above architecture, we have a Golang API that is in a Github repository. We are going to create a CI/CD pipeline with Github Actions to build and deploy the API in AWS EC2 instances. We are going to use **terraform** to create the infrastructure in AWS.

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

Before we can continue with the CD pipeline, we need to create the infrastructure in AWS. We have to create a couple of files to create the infrastructure with **terraform**.

We need to have an EC2 instance running in AWS where we can deploy our code. We are going to use **terraform** to create the infrastructure in AWS.
   1. Create a new folder called **terraform** in the root of the repository.
   2. Create and open a **main.tf** file and add the following code.
    This configuration will create an EC2 instance with a security group that allows SSH and HTTP traffic.

    ```hcl
   terraform {
      required_version = ">= 1.6.6"

      cloud {
        organization = "leninner"

        workspaces {
          name = "go-api-terraform-github-actions"
        }
      }

      required_providers {
        aws = {
          source  = "hashicorp/aws"
          version = "~> 5.33.0"
        }
      }
    }

    provider "aws" {
      region = var.aws_region
    }

    data "aws_vpc" "default" {
      default = true
    }

    resource "aws_instance" "go_api_server" {
      ami                    = var.ami
      instance_type          = var.instance_type
      vpc_security_group_ids = [aws_security_group.security_group.id]
      key_name               = "go-api"

      tags = {
        Name = "go-api-server"
      }
    }

    resource "aws_security_group" "security_group" {
      vpc_id      = data.aws_vpc.default.id
      description = "Allow SSH (TCP port 22), TCP/3001 from the world and HTTP (TCP port 80) access to GO API Server"
      name        = "go-api-server-sg"

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
        from_port   = var.go-api-port
        to_port     = var.go-api-port
        protocol    = "tcp"
        cidr_blocks = var.allowed_http_cidr_blocks
        description = "Allow GO API access from the world"
      }
    }
    ```

   3. Create and open a **variables.tf** file and add the following code.
    This configuration contains the variables that we are going to use in our terraform configuration.

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

    variable "go-api-port" {
      description = "Port on which the Go API server listens"
      type        = number
      default     = 3001
    }
    ```


    4. Go to the local repository, pull all the changes from the remote repository from **develop** and we will work in this branch.

    ```bash
    git checkout develop
    git pull origin develop
    ```

    5. Create a file called `terraform-plan.yml` in the `.github/workflows` folder. This file will contain the configuration of our CD pipeline.

    ```bash
    mkdir -p .github/workflows
    touch .github/workflows/terraform-plan.yml
    ```

    6. Open the `terraform-plan.yml` file and add the following code.

    ```yml
    name: Terraform plan for go api

    on:
      pull_request:
        branches:
          - main

    env:
      TF_CLOUD_ORGANIZATION: "leninner"
      TF_API_TOKEN: "${{ secrets.TF_API_TOKEN }}"
      TF_WORKSPACE: "go-api-terraform-github-actions"
      CONFIG_DIRECTORY: "./terraform"

    jobs:
      terraform:
        name: "Terraform Plan"
        runs-on: ubuntu-latest
        permissions:
          contents: read
          pull-requests: write
        steps:
          - name: Checkout repository
            uses: actions/checkout@v4

          - name: Upload Configuration
            uses: hashicorp/tfc-workflows-github/actions/upload-configuration@v1.0.0
            id: plan-upload
            with:
              workspace: ${{ env.TF_WORKSPACE }}
              directory: ${{ env.CONFIG_DIRECTORY }}
              speculative: true

          - name: Create Plan Run
            uses: hashicorp/tfc-workflows-github/actions/create-run@v1.0.0
            id: plan-run
            with:
              workspace: ${{ env.TF_WORKSPACE }}
              configuration_version: ${{ steps.plan-upload.outputs.configuration_version_id }}
              plan_only: true

          - name: Get Plan Output
            uses: hashicorp/tfc-workflows-github/actions/plan-output@v1.0.0
            id: plan-output
            with:
              plan: ${{ fromJSON(steps.plan-run.outputs.payload).data.relationships.plan.data.id }}

          - name: Update PR
            uses: actions/github-script@v7
            id: plan-comment
            with:
              github-token: ${{ secrets.GITHUB_TOKEN }}
              script: |
                // 1. Retrieve existing bot comments for the PR
                const { data: comments } = await github.rest.issues.listComments({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: context.issue.number,
                });
                const botComment = comments.find(comment => {
                  return comment.user.type === 'Bot' && comment.body.includes('Terraform Cloud Plan Output')
                });
                const output = `#### Terraform Cloud Plan Output
                    \`\`\`
                    Plan: ${{ steps.plan-output.outputs.add }} to add, ${{ steps.plan-output.outputs.change }} to change, ${{ steps.plan-output.outputs.destroy }} to destroy.
                    \`\`\`
                    [Terraform Cloud Plan](${{ steps.plan-run.outputs.run_link }})
                    `;
                // 3. Delete previous comment so PR timeline makes sense
                if (botComment) {
                  github.rest.issues.deleteComment({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    comment_id: botComment.id,
                  });
                }
                github.rest.issues.createComment({
                  issue_number: context.issue.number,
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  body: output
                });
    ```

    In this file we are defining the steps to create a plan in Terraform Cloud. This plan will show us the changes that will be applied to our infrastructure.

    - **Build**: This job will build our code.
    - **Deploy**: This job will deploy our code to an AWS EC2 instance.

    7. Create another file called `terraform-apply.yml` in the `.github/workflows` folder. This file will contain the configuration of our CD pipeline.

    ```bash
    touch .github/workflows/terraform-apply.yml
    ```

    8. Open the `terraform-apply.yml` file and add the following code.

    ```yml
    name: Terraform Apply for golang api

    on:
      push:
        branches:
          - main

    env:
      TF_CLOUD_ORGANIZATION: "leninner"
      TF_API_TOKEN: "${{ secrets.TF_API_TOKEN }}"
      TF_WORKSPACE: "go-api-terraform-github-actions"
      CONFIG_DIRECTORY: "./terraform"

    jobs:
      terraform:
        name: "Terraform Apply"
        runs-on: ubuntu-latest
        permissions:
          contents: read
        steps:
          - name: Checkout
            uses: actions/checkout@v4

          - name: Upload Configuration
            uses: hashicorp/tfc-workflows-github/actions/upload-configuration@v1.0.0
            id: apply-upload
            with:
              workspace: ${{ env.TF_WORKSPACE }}
              directory: ${{ env.CONFIG_DIRECTORY }}

          - name: Create Apply Run
            uses: hashicorp/tfc-workflows-github/actions/create-run@v1.0.0
            id: apply-run
            with:
              workspace: ${{ env.TF_WORKSPACE }}
              configuration_version: ${{ steps.apply-upload.outputs.configuration_version_id }}
              
          - name: Apply
            uses: hashicorp/tfc-workflows-github/actions/apply-run@v1.0.0
            if: fromJSON(steps.apply-run.outputs.payload).data.attributes.actions.IsConfirmable
            id: apply
            with:
              run: ${{ steps.apply-run.outputs.run_id }}
              comment: "Apply Run from GitHub Actions CI ${{ github.sha }}"
    ```

    In this file we are defining the steps to apply the changes to our infrastructure in Terraform Cloud.

    9. Create a new file called `deploy-api.yml` in the `.github/workflows` folder. This file will contain the configuration of our CD pipeline.

    ```bash
    touch .github/workflows/deploy-api.yml
    ```

    10. Open the `deploy-api.yml` file and add the following code.

    ```yml
    name: Continous deployment for golang api

    on:
      workflow_dispatch:
        inputs:
          environment:
            description: Ambiente a desplegar
            required: true
            default: "production"
            type: choice
            options:
              - production
              - staging

    env:
      AWS_PRIVATE_KEY: ${{ secrets.AWS_PRIVATE_KEY }}
      AWS_EC2_USER: ${{ secrets.AWS_EC2_USER }}
      AWS_EC2_HOST: ${{ secrets.AWS_EC2_HOST }}

    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout repository
            uses: actions/checkout@v4

          - name: Set up Go 1.21
            uses: actions/setup-go@v4
            with:
              go-version: "^1.21"

          - name: Build go-api
            run: go build -v -o go-api

          - name: Build .pem file
            run: |
              echo "${{ secrets.AWS_PRIVATE_KEY }}" > aws.pem
              echo "Pem file created"
              chmod 600 aws.pem
              echo "Pem file permissions set"

          - name: Deploy to production
            run: |
              echo "Deploying..."
              scp -o StrictHostKeyChecking=no -i aws.pem go-api ${{ env.AWS_EC2_USER }}@${{ env.AWS_EC2_HOST }}:~/go-api

          - name: Start api
            run: |
              echo "Starting api..."
              ssh -o StrictHostKeyChecking=no -i aws.pem ${{ env.AWS_EC2_USER }}@${{ env.AWS_EC2_HOST }} "nohup ./go-api > output.log 2>&1 &"
              echo "Api started at: https://${{ env.AWS_EC2_HOST }}:3031"
    ```



### Part 3: Define the secrets

We need to define some secrets in our repository to use in our CD pipeline.

1. Go to your repository and click on **Settings**.

2. Click on **Secrets** and then click on **New repository secret**.
3. Add the following secrets:
  - **TF_API_TOKEN**
  - **AWS_PRIVATE_KEY**
  - **AWS_EC2_USER**
  - **AWS_EC2_HOST**
  - **AWS_REGION**
  - **AWS_ACCESS_KEY_ID**
  - **AWS_SECRET_ACCESS_KEY**

After all these steps, we have created a CI/CD pipeline with Github Actions for a Golang API deployed in AWS.

Now, you can open a pull request to merge the **develop** branch to the **main** branch and see the status of the pipeline in the **Actions** tab.

## Conclusion

In this project, we have created a CI/CD pipeline with Github Actions for a Golang API deployed in AWS. We have created a CI pipeline to build and test the code and a CD pipeline to deploy the code to an AWS EC2 instance.

We can see the importance of having a CI/CD pipeline in our projects. It allows us to automate the processes of building, testing, and deploying code changes. It helps us to deliver apps to customers frequently by introducing automation into the stages of app development.

> If you liked this project, please **follow me** on [LinkedIn](https://www.linkedin.com/in/leninner), [Instagram](https://www.instagram.com/leninner/) and [GitHub](https://www.github.com/leninner) to stay tuned for more projects and **be sure** to check out my other [projects](/projects).

