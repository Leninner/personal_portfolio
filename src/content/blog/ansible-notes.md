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
  - [Using group variables in an Ansible inventory](#using-group-variables-in-an-ansible-inventory)
- [What are ad-hoc commands?](#what-are-ad-hoc-commands)
  - [Create a linux user](#create-a-linux-user)
  - [Install nginx](#install-nginx)
- [What are playbooks?](#what-are-playbooks)
- [What are roles?](#what-are-roles)

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

If all goes well, we should see something like this:

```bash
x.x.x.x | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
x.x.x.x | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
x.x.x.x | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

### Using group variables in an Ansible inventory

```bash
# inventory.init

## define groups and IPs
[webservers]
x.x.x.x
x.x.x.x

[databases]
x.x.x.x

[all:vars]
ansible_user=leninner
ansible_ssh_private_key_file=~/.ssh/id_rsa

[webservers:vars]
ansible_python_interpreter=/usr/bin/python3

[databases:vars]
ansible_python_interpreter=/usr/bin/python3
```

## What are ad-hoc commands?

An ad-hoc command is a single Ansible task to perform quickly, but don't want to save for later. It is a command that you run from the command line to perform a quick task.

Are:

- One-off jobs and runs
- Pulling information
- Fun, but limited

### Create a linux user

```bash
ansible -i inventory.ini -u root -m user -a "name=test state=present" all
```

You should see something like this:

```bash
x.x.x.x | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": true,
    "comment": "",
    "create_home": true,
    "group": 1000,
    "home": "/home/test",
    "name": "test",
    "shell": "/bin/bash",
    "state": "present",
    "system": false,
    "uid": 1000
}
```

### Install nginx

```bash
# To install
ansible -i inventory.ini -u root -m package -a "name=nginx state=present" webservers

# To uninstall
ansible -i inventory.ini -u root -m package -a "name=nginx state=absent" webservers
```

## What are playbooks?

`Playbooks are Ansible's configuration, deployment, and onchestration languaje`. They can describe a policy you want  your remote systems to enforce, or a set of steps in a general IT process.

Playbook is the core component of Ansible. It is a YAML file that describes the desired state of the system. It is a file that contains a list of tasks that we want to execute on a particular remote server.

With playbook:
- The real fun begins
- Very powerful and flexible
- Can be nested
- A collection of **plays**
  - Is a collection of **tasks**
  - which execute **modules**

Let's create a playbook:

- A **playbook** document contains `plays`

```yaml
# PATH: master.yaml

# first play
- name: Configure WebServers
  hosts: webservers
  become: yes
  tasks: # this is a list of tasks
    - name: Create a non-root user
      user: # this is a module
        name: leninner
        state: present

    - name: Install nginx
      package: # this is a module
        name: nginx
        state: present

# second play
- name: Configure Databases
  hosts: databases
  become: yes
  tasks:
    - name: Install MySQL Server
      package:
        name: mysql-server
        state: present
```

To run the playbook:

```bash
ansible-playbook -i inventory.ini master.yaml -u root
```

## What are roles?

Roles are ways of automatically loading **certain vars_files**, tasks, and handlers based on a known file structure. 

Grouping content by roles also allows easy sharing of roles with other users.

- Are repeatable and reusable unit of code
- Used for managing sets of related resources
