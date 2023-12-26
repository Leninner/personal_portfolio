---
title: "Terraform notes"
description: "Terrform is a tool for building, changing and versioning infrastructure safely and efficiently. Is a infrastructure as code tool."
pubDate: "11/29/2023"
updateDate: "Nov 29 2023"
heroImage: "/blog-placeholder-4.jpg"
tags: ["cloud", "infrastructure", "terraform"]
---

## What is Terraform?

Terraform is a tool for building, changing and versioning infrastructure safely and efficiently. Is a infrastructure as code tool.

Enables application software best practices to infrastructure and is compatible with many cloud providers.

## What is infrastructure as code?

Infrastructure as code (IaC) is the process of managing and provisioning computer data centers through **machine-readable definition files**, rather than physical **hardware configuration or interactive** configuration tools.

`Terraform` has a lot of advantages:

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

```hcl
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

```hcl
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

## Common Patterns

**Provisioning + Config management**

- Provisioning: Create the infrastructure
- Config management: Configure the infrastructure
- Terraform is a provisioning tool, not a config management tool
- Terraform + Ansible could be a great combination

**Provisioning + Server Templating**

- Provisioning: Create the infrastructure
- Server Templating: Pre configure the servers that we are going to use later.
- Terraform + Packer

**Provisioning + Orchestration**

- Provisioning: Create the infrastructure
- Orchestration: Manage the infrastructure
- Terraform + Kubernetes

## Terraform Architecture

**Terraform core**

1. Terraform state
   - The state is used by Terraform to map real world resources to your configuration, keep track of metadata, and to improve performance for large infrastructures.

2. Terraform config
   - The configuration is the set of files in which you describe the infrastructure you want Terraform to manage.

**Providers**

- Are responsible for understanding **API interactions** with the different cloud providers and exposing resources. Each provider is its own encapsulated binary distributed separately from Terraform itself. This allows for a plugin-based model where new providers can be installed without Terraform getting updated.

## Variable types

Variables are a great way to define centrally controlled reusable values in Terraform. They can be used to reduce duplication between configurations or to create reusable configuration modules.

### Input variables

Input varianles are parameters for a Terraform module. They are used to assign values to variables used in the module configuration.

Variables are defined in Terraform configuration using the `variable` block:

```hcl
variable "instance_name" {
  description = "Value of the Name tag for the EC2 instance"
  type        = string
  default     = "ExampleAppServerInstance"
}
```

To reference a variable value, use the `var` prefix followed by the variable name:

```hcl
var.<name>
```

### Local variables

Are local to a module and are not passed in or out of it. They are used to reduce duplication within a module or to compute derived values.

Local variables are declared with the `locals` block:

```hcl
locals {
  service_name = "example"
  owner        = "terraform"  
}
```

To reference a local value, use the `local` prefix followed by the local name:

```hcl
local.<name>
```

### Output variables

Defines the return value of a resource and **makes it available for use** by other resources.

Output variables are defined using the `output` block:

```hcl
output "instance_id" {
  value       = aws_instance.app_server.id
}
```

### Setting input variables

We can use the following methods to set input variables:

- **Command line flags**
- **From a file**
- **From environment variables**
- **From the Terraform Cloud or Terraform Enterprise API**

Example:

```bash
terraform apply -var="instance_name=web_server"
```

The variables can have different types:

**Primitive types**

- **string**
- **number**
- **bool**

**Complex types**

- **list(<type>)**
- **set(<type>)**
- **map(<type>)**
- **object({<attr name> = <type>, ...})**
- **tuple([<type>])**

**Validation**

- Type checking happens automatically
- Custom conditions can also be enforced

We can also define **sensitive data**

```hcl
variable "password" {
  type = string
  sensitive = true
}
```

## Project organization and modules

**Modules** are self-contained packages of Terraform configurations that are managed as a group. Modules are used to create reusable components, improve organization, and to treat pieces of infrastructure as a black box.

- Why modules? 
  - **Reusability**
  - **Abstraction**
  - **Encapsulation**

- Types of modules
  - **Root module**: Default module containing all the .tf file of the main **working** directory
  - **Child module**: A separate external module referred from a .tf file 

Modules can be used from different sources:

- **Local path**: A filesystem path to a directory of Terraform configuration files
- **Terraform Registry**: A public registry of Terraform modules
- **Github**: A public git repository
- Etc...

- Local path example:

```hcl
module "web-app" {
  source = "./web-app"
}
```

- Terraform registry

```hcl
module "consul" {
  source = "hashicorp/consul/aws"
  version = "0.1.0"
}
```

- Github

```hcl
module "consul" {
  source = "github.com/hashicorp/example"
}
```

Inputs variables are passed in via module block

```hcl
module "web_app" {
  source = "./web-app"

  # input variables
  instance_type = "t2.micro"
  availability_zone = "us-east-1a"

  # meta-arguments
  count = 3
}
```

- What makes a good module?
  - **Raises the abstraction level from base resource types**
  - **Groups resources in a logical fashion**
  - **Exposes input variables to allow necessary customization + cmposition**
  - **Provides useful defaults**
  - **Returns outputs to make further integrations possible**

## Managing multiple environments

One config, multiple environments

### Workspaces

Multiple named sections within a single backend

**Pros**
- Easy to get started
- COnvenient terraform.workspace expression
- Minimizes code duplication

**Cons**
- Prone to human error
- State stored within same backend
- Codebase doesn't unambiguously show deployment configurations

To create a new workspace:

```bash
terraform workspace new production
```

To see the workspaces:

```bash
terraform workspace list
```

To use the workspace in terraform files:

```hcl
locals {
  environment = terraform.workspace
}
```

### File structure

Directory layout provides separation, modules provide reuse

**Pros**
- Isolated of backends
  - Improved security
  - Decreased potencial for human error
- Codebase fully represents deployed state

**Cons**
- Multiple **terraform apply** required to provision environments
- Mode code duplication, but can be minimized with modules

## Terraform languaje

The Terraform language is declarative, describing an intended goal rather than the steps to reach that goal. 

The ordering of blocks and the files they are organized into are generally not significant; Terraform only considers implicit and explicit relationships between resources when **determining an order** of operations.

```hcl
resource "aws_vpc" "main" {
  cidr_block = var.base_cidr_block
}

<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" {
  # Block body
  <IDENTIFIER> = <EXPRESSION> # Argument
}
```

- **Block type** defines an object which can be a resource, data source, provider, or provisioner. Block types are defined by the provider, and multiple providers can define blocks of the same type.
- **Block label** is a name given to a block which is used to refer to it elsewhere in the same Terraform configuration. Block labels are unique within a single Terraform configuration and can be more than one word.
- **Argument** is a configuration item assigned a value within a block. Arguments are represented by identifier = expression pairs within a block.
  - **Identifier** is a specific configuration item within a block, which varies depending on the type of block. For example, the name argument within the aws_instance resource block is an identifier.
  - **Expression** is the value assigned to an argument, either directly or via a variable reference, function call, template interpolation, etc.

### Example

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 1.0.4"
    }
  }
}

variable "aws_region" {}

variable "base_cidr_block" {
  description = "A /16 CIDR range definition, such as 10.1.0.0/16, that the VPC will use"
  default = "10.1.0.0/16"
}

variable "availability_zones" {
  description = "A list of availability zones in which to create subnets"
  type = list(string)
}

provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "main" {
  # Referencing the base_cidr_block variable allows the network address
  # to be changed without modifying the configuration.
  cidr_block = var.base_cidr_block
}

resource "aws_subnet" "az" {
  # Create one subnet for each given availability zone.
  count = length(var.availability_zones)

  # For each subnet, use one of the specified availability zones.
  availability_zone = var.availability_zones[count.index]

  # By referencing the aws_vpc.main object, Terraform knows that the subnet
  # must be created only after the VPC is created.
  vpc_id = aws_vpc.main.id

  # Built-in functions and operators can be used for simple transformations of
  # values, such as computing a subnet address. Here we create a /20 prefix for
  # each subnet, using consecutive addresses for each availability zone,
  # such as 10.1.16.0/20 .
  cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 4, count.index+1)
}
```

### Files and directories

Terraform languaje is stored in plain text files with the `.tf` file extension. Also, there is a `JSON variant` of the Terraform language that is named `.tf.json`.

The files are usually called `configuration files` and these files must use **utf-8** encoding and LF(Unix style) or CRLF(Windows style) line endings.

#### Directories

A **module** is a collection of `.tf` and/or `.tf.json` files kept together in a directory. Consists of only the set of **top-level** configuration files. Also, the nested directories are not considered part of the module.

#### Root module

Terraform always runs in the context of a **single root module**, which consists in the `terraform configuration file and the tree of child modules`

- In **Terraform CLI** the root directory is the current working directory when Terraform is run. 
- In **Terraform Cloud and Terraform Enterprise**, the root module for a workspace defaults to the top level of the configuration directory

#### Override Files

Terrafom expects that every directory defines a distinct set of configuration objects, if so, Terraform will return an error. However, you can use override files to define a subset of configuration objects.

See the following example:

- You define a resource in `main.tf`:

```hcl
resource "aws_instance" "web" {
  instance_type = "t2.micro"
  ami           = "ami-408c7f28"
}
```

- Then, you can override the resource in `override.tf`:

```hcl
resource "aws_instance" "web" {
  ami = "foo"
}
```

- Terraform will merge the latter with the former, behaving as if the original configuration had been the following:

```hcl
resource "aws_instance" "web" {
  instance_type = "t2.micro"
  ami           = "foo"
}
```

### Sintax

#### Configuration sintax

Describe the native grammar of the Terraform language.

##### Arguments and blocks

Terraform languaje sintax is based on **blocks** and **arguments**. A block is a container for other content and can contain multiple arguments within it.

###### Argument

An argument assigns a value to a particular name:

```hcl
<!-- <ARGUMENT> = <VALUE> -->
image_id = "ami-abc123"
```

###### Block

A block is a container for other content and can contain multiple arguments within it:

```hcl
resource "aws_instance" "example" {
  ami = "abc123"

  network_interface {
    # ...
  }
}
```

A block can have a `type` (**resource** in the previous example) and each block type defines how many labels it expects and what each label means.

In the case of the `resource` block type, the first label is the resource type and the second label is the resource name.

##### Identifiers

Argument names, block type names, and the names of most Terraform-specific constructs like resources, input variables, etc. **are all identifiers.**

Identifiers can contain letters, digits, underscores (_), and hyphens (-). The first character of an identifier must not be a digit, to avoid ambiguity with literal numbers.

For complete identifier rules, Terraform implements the Unicode identifier syntax, extended to include the ASCII hyphen character -.

##### Comments

Terraform supports three styles of comments:

```hcl
# This is a comment
```

```hcl
// This is a comment
```

```hcl
/* 
This is a comment 
*/
```