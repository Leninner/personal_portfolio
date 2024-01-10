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
  - [Variables and conditions](#variables-and-conditions)
  - [Loops](#loops)
- [What are tags?](#what-are-tags)

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

We are going to create the following structure:

```bash
mkdir -p roles/users/tasks roles/users/defaults
```

Inside the `roles/users/tasks` folder, we are going to create a file called `main.yaml` and inside this file we are going to write the following code:

```yaml
# PATH: roles/users/tasks/main.yaml
---
- name: Create or delete user accounts
  loop: "{{ users_list }}"
  ansible.builtin.user:
    name: "{{ item.username }}"
    state: "{{ item.state }}"

```

Inside the `roles/users/defaults` folder, we are going to create a file called `main.yaml` and inside this file we are going to write the following code:

```yaml
# PATH: roles/users/defaults/main.yaml
---
users_list:
  - username: leninsin
    state: absent

  - username: stalin
    state: absent

  - username: pepe
    state: absent

```

### Variables and conditions

- Variables

```yaml
# play
- name: Using vargs
  hosts: all
  gather_facts: false
  vars:
    hello: Hello World # this is a variable
    number_list: [1, 2, 3, 4, 5] # this is a list
    string_list: ['hello', 'world'] # this is a list
    another_number_list: # this is a list
      - 1
      - 2
      - 3
    number_map: # this is a map
      one: 1
      two: 2
      a_map_inside:
        one: 1
        two: 2
    list_of_maps: # this is a list of maps
      - name: lenin
        age: 24
      - name: stalin
        age: 25
    map_of_lists: # this is a map of lists
      names: ['lenin', 'stalin']
      ages:
        - 24
        - 25
  tasks:
    - name: Print hello
      debug:
        msg: "Hello {{ number_map.a_map_inside.one }}" # using the variable
    - name: Print list of maps
      debug:
        msg: "{{ list_of_maps[0].name }}"
    - name: Print map of lists
      debug:
        msg: "{{ map_of_lists.names[0] }}"
```

- Conditions

```yaml
# play
- name: Using conditions
  hosts: all
  gather_facts: false
  vars:
    number: 10
    another_number: 20
  tasks:
    - name: Print number
      debug:
        msg: "The number is {{ number }}"
      when: number > 5 and number < 15
    
    - name: Print another number
      debug:
        msg: "The another number is {{ another_number }}"
      when: 
        - another_number > 5
        - or # this is necessary for `or` condition, if you have `and` condition you don't need this
        - another_number < 15
```


### Loops

```yaml
# play
- name: Using loops
  hosts: localhost
  vars:
    number_list: [1, 2, 3, 4, 5] # this is a list
    map_list: # this is a list of maps
      name: lenin
      age: 24
  tasks:
    - name: Print hello
      ansible.builtin.debug:
        msg: "Hello {{ item }}" # using the item of the list
      loop: "{{ number_list }}" # looping through the list

    - name: Iterating over a map
      ansible.builtin.debug:
        msg: "Hello {{ item.key }} and {{ item.value }}" # using the item of the list
      loop: "{{ map_list | dict2items }}" # looping through the map

    - name: Using a loop condition
      ansible.builtin.debug:
        msg: "Hello {{ item }}"
      loop: "{{ number_list }}"
      when: item > 3
```

## What are tags?

Are:

- Great at the `task` level
- Can be used to skip certain tasks or only execute certain task
- Great for speeding up development times during experimentation
- Speeding up execution, especially in CI/CD pipelines

```yaml
# play
- name: Using tags
  hosts: all
  gather_facts: false
  vars:
    number: 10
    another_number: 20
  tasks:
    - name: Print number
      debug:
        msg: "The number is {{ number }}"
      when: number > 5 and number < 15
      tags: # this is a tag
        - number
        - number2

    - name: Print another number
      debug:
        msg: "The another number is {{ another_number }}"
      when: 
        - another_number > 5
        - or # this is necessary for `or` condition, if you have `and` condition you don't need this
        - another_number < 15
      tags: # this is a tag
        - another_number
```

To run the playbook with tags:

```bash
ansible-playbook -i inventory.ini master.yaml -u root --tags "number, number2"
```

To run the playbook without tags:

```bash
ansible-playbook -i inventory.ini master.yaml -u root --skip-tags "number, number2"
```
