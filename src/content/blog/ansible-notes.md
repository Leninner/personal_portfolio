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

## What is Ansible?

Ansible is a tool that essentially automate all the common tasks that you do in your daily basis. It is a tool that allows you to automate the configuration of multiple servers at the same time.

You write code, ansible execute the code, and that code defines the state that your servers should be in and Ansible makes sure that your servers are in that state. Ansible is essentially like a **state managemente machine**

### Use cases

- **Automate common tasks** 
- **Automate complex tasks**
- Is a **Configuration as code (CaC)** tool

We write ansible code in **Yaml** format and this code can be tracked by a version control system like **Git**. 

Write ansible will bring us `happiness` and `productivity` because we can automate all the common tasks that we do in our daily basis and we can automate all of these things using a CI/CD tool like **Github Actions.**
