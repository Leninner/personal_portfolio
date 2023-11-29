---
title: "Terraform notes"
description: "Terrform is a tool for building, changing and versioning infrastructure safely and efficiently. Is a infrastructure as code tool."
pubDate: "11/29/2023"
updateDate: "Nov 29 2023"
heroImage: "/blog-placeholder-4.jpg"
tags: ["cloud", "infrastructure", "terraform"]
---

## What is infrastructure as code?

Infrastructure as code (IaC) is the process of managing and provisioning computer data centers through **machine-readable definition files**, rather than physical **hardware configuration or interactive** configuration tools.

`Terraform` is a Hashicorp tool for building infrastructure as code and it has a lot of advantages:

- **Multi-cloud**: Can manage infrastructure for multiple cloud providers (AWS, Azure, GCP, etc) and private cloud providers (VMware, OpenStack, etc).
- **Human-readable**: Helps you write infrastructure as code quickly
- **State**: Allows us to track the changes throughout our deployments.
- **Collaboration**: You can commit your infrastructure code to a version control system (Git) and collaborate with your team.

Terraform has many plugins that are called `providers` and they are used to interact with the different cloud providers. For example, if you want to create a virtual machine in AWS, you will use the `aws` provider.

To deploy infrastructure with Terraform:

- **Scope** - Identify the infrastructure for your project.
- **Author** - Write the configuration for your infrastructure.
- **Initialize** - Install the plugins Terraform needs to manage the infrastructure.
- **Plan** - Preview the changes Terraform will make to match your configuration.
- **Apply** - Make the planned changes.

### Demo

In this demo we are going to create a nginx docker container locally.

First, we need to create a file called `main.tf` and add the following code:

```terraform
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.15.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "nginx" {
  name         = "nginx:latest"
  keep_locally = false
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.latest
  name  = "tutorial"
  ports {
    internal = 80
    external = 8000
  }
}
```

Then, we need to initialize terraform:

```bash
terraform init
```

Then we can see the plan:

```bash
terraform plan
```

And finally, we can apply the changes:

```bash
terraform apply
```

Verify that the container is running:

```bash
docker ps
```

Destroy the terraform resources:

```bash
terraform destroy
```

## Build infrastructure on AWS

We need to have installed the AWS CLI and obviously Terraform.

1. Set environment variables to login with Terraform Provider for AWS:

```bash
export AWS_ACCESS_KEY_ID="anaccesskey"
export AWS_SECRET_ACCESS_KEY="asecretkey"
```

The set of files used to describe infrastructure in Terraform is known as a Terraform `configuration`. Each configuration should be in its own directory.

2. Create a directory for the configuration and change into it:

```bash
mkdir learn-terraform-aws-instance
cd learn-terraform-aws-instance
```

3. Create a file to define the infrastructure.

```bash
touch main.tf
```

4. Paste the following code into `main.tf`:

```terraform
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "us-east-1"
}

resource "aws_instance" "app_server" {
  ami           = "ami-0230bd60aa48260c6"
  instance_type = "t2.micro"

  tags = {
    Name = "ExampleAppServerInstance"
  }
}
```

5. Initialize the directory:

```bash
terraform init
```

6. Format and validate the configuration:

```bash
terraform fmt
terraform validate
```

7. Create the infrastructure:

```bash
terraform apply
```

8. Inspect state:

```bash
terraform show
```

9. Destroy the infrastructure:

```bash
terraform destroy
```

## Defining variables

Variables are a great way to define centrally controlled reusable values in Terraform. They can be used to reduce duplication between configurations or to create reusable configuration modules.

### Variable definition

Variables are defined in Terraform configuration using the `variable` block:

```terraform
variable "instance_name" {
  description = "Value of the Name tag for the EC2 instance"
  type        = string
  default     = "ExampleAppServerInstance"
}
```

### Variable usage

Variables can be used in expressions to concisely refer to values that are not known until the configuration is applied. For example, we can use the `instance_name` variable we defined above in the `tags` argument of the `aws_instance` resource:

```terraform
resource "aws_instance" "app_server" {
  ami           = "ami-0230bd60aa48260c6"
  instance_type = "t2.micro"

  tags = {
    Name = var.instance_name
  }
}
```

### Variable assignment

```bash
terraform apply -var="instance_name=web_server"
```

## Outputs

Outputs are a way to tell Terraform what data is important. This data is outputted when apply is called, and can be queried using the terraform output command.


To define an output value, use the output block in your configuration:

```terraform
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}
```

To query the outputs after applying the configuration, use the terraform output command:

```bash
terraform output
```
