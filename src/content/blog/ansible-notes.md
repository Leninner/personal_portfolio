---
title: "Ansible notes"
description: "Ansible is a tool that essentially automate all the common tasks that you do in your daily basis. It is a tool that allows you to automate the configuration of multiple servers at the same time."
pubDate: "01/07/2024"
updateDate: "Jan 07 2024"
heroImage: "/blog-placeholder-2.jpg"
tags: ["configuration-management", "ansible", "provisioning", "cloud"]
---

- [What is Ansible?](#what-is-ansible)
  - [Use cases](#use-cases)
  - [What problem does Ansible solve?](#what-problem-does-ansible-solve)
  - [Installation](#installation)
- [System inventory](#system-inventory)
  - [Creating an inventory file](#creating-an-inventory-file)

## What is Ansible?

Ansible is a tool that essentially automate all the common tasks that you do in your daily basis. It is a tool that allows you to automate the configuration of multiple servers at the same time.

You write code, ansible execute the code, and that code defines the state that your servers should be in and Ansible makes sure that your servers are in that state. Ansible is essentially like a **state managemente machine**

### Use cases

- **Automate common tasks** 
- **Automate complex tasks**
- Is a **Configuration as code (CaC)** tool

We write ansible code in **Yaml** format and this code can be tracked by a version control system like **Git**. 

Write ansible will bring us `happiness` and `productivity` because we can automate all the common tasks that we do in our daily basis and we can automate all of these things using a CI/CD tool like **Github Actions.**

### What problem does Ansible solve?

- Human error
- (A lack of) transparency
- (A lack of) repeatability
- Documentation for the entire state

### Installation

- Linux (Ubuntu)

```bash
# Actualizamos los repositorios
sudo apt update
# Install python if ypu don't have it
sudo apt install python3 python3-pip -y
# install ansible
pip install ansible
# check the version
~/.local/bin/ansible --version
# add the path to the .bashrc file
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
# reload the bashrc file
source ~/.bashrc
# check the version
ansible --version
```

## System inventory

- **Inventory**: Is a list of all the servers that we want to manage with Ansible. This list can be in a file or in a database.
  - This file can contain hostnames and/or IPS
  - We can use groups for organizing systems
  - These ips can also be provided by the CLI
  - Or can be generated dynamically

### Creating an inventory file

```bash
touch inventory.init
```

```bash
# inventory.init

## define groups and IPs
[webservers]
x.x.x.x
x.x.x.x

[databases]
x.x.x.x
```

Tell to ansible which inventory file we want to use

> Before accomplish this step, we need to have a ssh key pair in our local machine and in the remote machine. Know how to create one here: [SSH key pair](/blog/ssh-key-pair)

```bash
ansible -i inventory.init -u leninner -m ping all
```
