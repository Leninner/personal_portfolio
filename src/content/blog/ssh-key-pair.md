---
title: "SSH key pair generation"
description: "SSH is a protocol that allows us to connect to a remote machine and execute commands on it. In order to connect to a remote machine, we need to have a ssh key pair. This key pair is composed by a public key and a private key. The public key is stored in the remote machine and the private key is stored in our local machine. In this post, we will see how to generate a ssh key pair."
pubDate: "01/08/2024"
updateDate: "Jan 08 2024"
heroImage: "/blog-placeholder-4.jpg"
tags: ["ssh", "key-pair", "ssh-keygen"]
---

- [What is SSH?](#what-is-ssh)
- [Generating a ssh key pair](#generating-a-ssh-key-pair)

## What is SSH?

SSH is a **protocol** that allows us to connect to a remote machine and execute commands on it. In order to connect to a remote machine without the need of a password, we need to have a ssh key pair. 

This key pair is composed by a **public key and a private key**. The public key is stored in the `remote machine` and the private key is stored in our `local machine`. In this post, we will see how to generate a ssh key pair and copy the public key to the remote machine.

> You can read more about ssh in the [official documentation](https://www.ssh.com/ssh/protocol/).

## Generating a ssh key pair

In order to generate a ssh key pair, we will use the `ssh-keygen` command. This command will generate a ssh key pair in the `~/.ssh` directory. The `~/.ssh` directory is the default directory where the ssh keys are stored.

```bash
ssh-keygen
```

If you want to add a comment to the ssh key, you can use the `-C` option. This option will add a comment to the ssh key. This comment will be added to the end of the public key.

```bash
ssh-keygen -C "comment"
```

Also, you might want to change the name and the directory of the ssh key. You can do this using the `-f` option. This option will allow you to specify the name and the directory of the ssh key.

```bash
ssh-keygen -f <path-to-ssh-key-and-name> -C "comment"
```

In my case, I will generate a ssh key pair with the following command:

```bash
ssh-keygen -t rsa -b 2048 -C "gendocsv3s" -f ./ssh -N ""
```

In this command, I am using the following options:

- `-t rsa`: This option will generate a ssh key pair using the rsa algorithm.
- `-b 2048`: This option will generate a ssh key pair with a length of 2048 bits.
- `-C "gendocsv3s"`: This option will add a comment to the ssh key pair.
- `-f ./ssh`: This option will generate the ssh key pair in the `current` directory with the name `ssh`.
- `-N ""`: This option will set an empty passphrase to the ssh key pair.

Then, we have to copy the public key to the remote machine. We can do this using the `ssh-copy-id` command. This command will copy the public key to the remote machine and it will add the public key to the `~/.ssh/authorized_keys` file. 

This file contains all the public keys that are allowed to connect to the remote machine.

```bash
ssh-copy-id -i ~/.ssh/<generated-ssh-key>.pub user@remote-machine
```

The `-i` flag is used to specify the path to the public key in our local machine. and the `user@remote-machine` is the user and the remote machine where we want to copy the public key.

When we execute the command, we have to enter the password of the user in the remote machine. After that, the public key will be copied to the remote machine and it will be added to the `~/.ssh/authorized_keys` file.
