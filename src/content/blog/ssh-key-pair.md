---
title: "SSH key pair generation"
description: "SSH is a protocol that allows us to connect to a remote machine and execute commands on it. In order to connect to a remote machine, we need to have a ssh key pair. This key pair is composed by a public key and a private key. The public key is stored in the remote machine and the private key is stored in our local machine. In this post, we will see how to generate a ssh key pair."
pubDate: "01/08/2024"
updateDate: "Jan 08 2024"
heroImage: "/blog-placeholder-4.jpg"
tags: ["ssh", "key-pair", "ssh-keygen"]
---

- [What is Ansible?](#what-is-ansible)
  - [Use cases](#use-cases)
  - [What problem does Ansible solve?](#what-problem-does-ansible-solve)
  - [Installation](#installation)
- [System inventory](#system-inventory)
  - [Creating an inventory file](#creating-an-inventory-file)

## What is SSH?

SSH is a **protocol** that allows us to connect to a remote machine and execute commands on it. In order to connect to a remote machine, we need to have a ssh key pair. This key pair is composed by a **public key and a private key**. The public key is stored in the `remote machine` and the private key is stored in `our local machine`. In this post, we will see how to generate a ssh key pair.

## Generating a ssh key pair

In order to generate a ssh key pair, we will use the `ssh-keygen` command. This command will generate a ssh key pair in the `~/.ssh` directory. The `~/.ssh` directory is the default directory where the ssh keys are stored.

```bash
# Generate a ssh key pair
ssh-keygen
```

When you ask prompt you for a passphrase, you can leave it empty. If you leave it empty, you will be able to connect to the remote machine without typing a password. If you want to add a passphrase, you will have to type it every time you want to connect to the remote machine.

Then, we have to copy the public key to the remote machine. We can do this using the `ssh-copy-id` command. This command will copy the public key to the remote machine and it will add the public key to the `~/.ssh/authorized_keys` file. This file contains all the public keys that are allowed to connect to the remote machine.

```bash
# Copy the public key to the remote machine
ssh-copy-id -i ~/.ssh/<generated-ssh-key>.pub user@remote-machine
```