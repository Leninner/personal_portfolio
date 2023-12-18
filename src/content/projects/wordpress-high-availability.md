---
title: 'Distributed System with Wordpress and MySQL using Virtual Box'
type: 'Infrastructure'
description: 'Sometimes in companies, you need to have a distributed system to avoid downtime. In this project, you can find the information related to the configuration of a web server with Nginx and PhP for Wordpress.'
releaseDate: 'Nov 12 2023'
image: "/blog-placeholder-3.jpg"
---
**Summary**

- [Introduction](#introduction)
- [High Availability Cluster](#high-availability-cluster)
  - [Replication](#replication)
  - [High Availability](#high-availability)
- [Load Balancing Cluster](#load-balancing-cluster)
  - [Wordpress](#wordpress)
  - [Load Balancer setup](#load-balancer-setup)
- [Conclusion](#conclusion)

## Introduction

Some months ago, I was requested to create a distributed system that looks like this:

![Distributed System](/content/projects/wordpress-high-availability/requirement.png)

The system consists of the following:

- A cluster for **`high availability`** with three database servers running **MySQL** which should be able to **`replicate`** the data between them.

![High availability cluster](/content/projects/wordpress-high-availability/high-availability.png)

- A cluster for **`load balancing`** with two servers runnning some **`web server`** like **Nginx** or **Apache**.

![Load balancing cluster](/content/projects/wordpress-high-availability/load-balancing.png)


I'm using VirtualBox to create the virtual machines. You can download it from the following [link](https://www.virtualbox.org/). All the nodes or servers that I'm going to create are going to be based on the following image:

- [AlmaLinux 8.4](https://repo.almalinux.org/vault/8.4-beta/isos/x86_64/)
- We also have the **Bridged Adapter** network configuration.

## High Availability Cluster

We must generate three virtual machines with the following configuration:
- Server One
  - **IP**: x.x.x.100 
  - **Hostname**: SQL-ONE

- Server Two
  - **IP**: x.x.x.101
  - **Hostname**: SQL-TWO

- Server Three
  - **IP**: x.x.x.102
  - **Hostname**: SQL-THREE

> If you want to change the IP address of a virtual machine, you can read the following [post](/blog/change-ip-vm/).

> `Disclaimer:` The `x.x.x` is the network address of your network. You can check it running the following command `ip a` on your host machine.

### Replication
> You can read more about the configuration of a `replication cluster` in the following [link](/blog/replication-mysql/).

1. We must install and configure `mysql` and `mysql-server` on all virtual machines
2. Once we have installed and configured the corresponding services, we can start with the configuration for **a replication technique** that will allow us to have a distributed system with **high availability**. We have two options:
   - [Master-Slave](#master-slave-technique)
   - [Group Replication](#group-replication-technique)

I'm going to explain the **Group Replication** technique and you can read more about this in the following [link](https://dev.mysql.com/doc/refman/8.0/en/group-replication.html).

3. We have to edit the `/etc/my.cnf.d/mysql-server.cnf` file on all virtual machines with the following content

<div class="relative overflow-x-auto">
    <table class="w-full text-sm md:text-lg text-left rtl:text-right text-gray-500">
        <thead class="text-xs md:text-md text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Variable
                </th>
                <th scope="col" class="px-6 py-3">
                    Description
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    skip_name_resolve
                </th>
                <td class="px-6 py-4">
                    This variable is used to avoid DNS resolution. This is useful when you are using IP addresses instead of hostnames.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    server_id
                </th>
                <td class="px-6 py-4">
                    This variable is used to identify each node in the cluster.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    disabled_storage_engines
                </th>
                <td class="px-6 py-4">
                    This variable is used to disable the storage engines that you don't need.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    datadir
                </th>
                <td class="px-6 py-4">
                    This variable is used to specify the directory where the data will be stored.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    socket
                </th>
                <td class="px-6 py-4">
                    This variable is used to specify the socket file.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    log-error
                </th>
                <td class="px-6 py-4">
                    This variable is used to specify the log file.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    pid-file
                </th>
                <td class="px-6 py-4">
                    This variable is used to specify the pid file.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    gtid_mode
                </th>
                <td class="px-6 py-4">
                    This variable is used to enable the GTID mode.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    enforce_gtid_consistency
                </th>
                <td class="px-6 py-4">
                    This variable is used to enable the GTID consistency.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    plugin _load_add
                </th>
                <td class="px-6 py-4">
                    This variable is used to load the group replication plugin that we are going to use for the <strong>Group replication</strong>
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    group_replication_group_name
                </th>
                <td class="px-6 py-4">
                    This variable is used to specify the group name. This must be a valid UUID (Universally Unique Identifier).
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    group_replication_start_on_boot
                </th>
                <td class="px-6 py-4">
                    This variable is used to specify if the group replication will start on the boot of the system.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    group_replication_local_address
                </th>
                <td class="px-6 py-4">
                    This variable is used to specify the local address of the node.
                </td>
            </tr>
            <tr class="bg-white">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    group_replication_group_seeds
                </th>
                <td class="px-6 py-4">
                    This variable is used to specify the ip address of the other nodes.
                </td>
            </tr>
        </tbody>
    </table>
</div>

```bash
[mysqld]
skip_name_resolve=ON
server_id=1
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
log-error=/var/log/mysql/mysqld.log
pid-file=/run/mysqld/mysqld.pid
gtid_mode=ON
enforce_gtid_consistency=ON
plugin_load_add='group_replication.so'
group_replication_group_name="5add9b42-775c-11ee-be2f-080027f362da"
group_replication_start_on_boot=off
group_replication_local_address= "x.x.x.79:33061"
group_replication_group_seeds= "x.x.x.79:33061,x.x.x.80:33061,x.x.x.81:33061"
```   

And then restart the `mysqld` service

```bash
systemctl restart mysqld
```

> **Note:** See more information related to the variables used [here](https://dev.mysql.com/doc/refman/8.0/en/group-replication-configuring-instances.html)

If you want to start the group replication on boot, you must change the value of the `group_replication_start_on_boot` variable to `ON` and then restart the `mysqld` service.
But be careful, because if you shut down all the nodes and then start them, **you must run the bootstrap command on the primary node to start the group replication.**

1. We have to create a user to check the replication on all virtual machines

```bash
mysql -u root -p
```

```sql
-- Disable the log
SET SQL_LOG_BIN=0;

CREATE USER 'repl'@'%' IDENTIFIED WITH mysql_native_password BY '1850ABc';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
GRANT CONNECTION_ADMIN ON *.* TO 'repl'@'%';
GRANT BACKUP_ADMIN ON *.* TO 'repl'@'%';
GRANT GROUP_REPLICATION_STREAM ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;

-- Enable the log
SET SQL_LOG_BIN=1;
```

5. When you have created the replication user, you must supply the user credentials to the server for use with distributed recovery. You can do this by setting the user credentials as the credentials for the group_replication_recovery channel. 
**Run this command on all nodes**

```sql
CHANGE REPLICATION SOURCE TO 
  SOURCE_USER='repl',
  SOURCE_PASSWORD='1850ABc' FOR CHANNEL 'group_replication_recovery';
```

> Read the documentation [here](https://dev.mysql.com/doc/refman/8.0/en/group-replication-user-credentials.html)

6. Check the plugins for `group_replication`

```sql
SHOW PLUGINS;
```

You must check that the `group_replication` plugin is installed otherwise you must install it

```sql
INSTALL PLUGIN group_replication SONAME 'group_replication.so';
```

> Read the documentation [here](https://dev.mysql.com/doc/refman/8.0/en/group-replication-launching.html)

7. Bootstrap the group replication. Ensure that you run these commands on the primary node

```sql
SET GLOBAL group_replication_bootstrap_group=ON;
START GROUP_REPLICATION;
SET GLOBAL group_replication_bootstrap_group=OFF;
```

- If you are providing the credentials for the group_replication_recovery channel (Mysql 8.0.23 or later)

```sql
SET GLOBAL group_replication_bootstrap_group=ON;
START GROUP_REPLICATION USER='repl', PASSWORD='1850ABc';
SET GLOBAL group_replication_bootstrap_group=OFF;
```

> If you shutdown all the servers, you must always run the bootstrap command on the primary node to start the group replication

8. Check the status of the group replication

```sql
SELECT * FROM performance_schema.replication_group_members;
```

9. To add the other two servers to the group replication, you must run the following command on the other nodes

```sql
START GROUP_REPLICATION;
```

> Read de docs [here](https://dev.mysql.com/doc/refman/8.0/en/group-replication-adding-instances.html)

**GENERAL NOTE:** You may need to `bind ip addresses` to have the mysql group replication working properly. You can achieve this editing the `/etc/hosts` file on all nodes

```bash
x.x.x.x MACHINE-HOSTNAME
y.y.y.y MACHINE-HOSTNAME
z.z.z.z MACHINE-HOSTNAME
```

### High Availability

> You can read in more detail about the configuration of a `high availability cluster` in the following [link](/blog/high-availability-vm/).

Once we have the group replication working properly, is time to configure the `high availability cluster`. I'm going to use the `Keepalived` service to achieve this.

1. Create a user to access the database `performance_schema` on the primary node and thanks to the `replication technique` the other nodes will have the same user.

This user will be used to check if the node is the primary node.

```sql
CREATE USER 'verifier'@'%' IDENTIFIED WITH mysql_native_password BY '1850ABc';
GRANT SELECT ON performance_schema.* TO 'verifier'@'%';
```

2. Configure `keepalived` on all nodes.

```bash
sudo vim /etc/keepalived/keepalived.conf
```

```c
global_defs {
  router_id mysql
}

vrrp_script check_mysql {
  script "/bin/check_primary.sh"
  interval 2
  weight 50
  script_security script
}

vrrp_instance VI_01 {
  state BACKUP
  interface enp0s3
  virtual_router_id 50
  priority 90

  virtual_ipaddress {
    x.x.x.167/24
  }

  track_script {
    check_mysql
  }

  authentication {
    auth_type AH
    auth_pass secret
  }
} 
```

3. Create `check_primary.sh` script.

```bash
sudo vim /bin/check_primary.sh
```

```bash
#!/bin/sh

# Specify the address and port of your MySQL Group Replication primary node
NODE_IP=$(hostname -I | awk '{print $1}')
NODE_PORT="3306"

# Specify the user and password to access MySQL (replace with your credentials)
MYSQL_USER="verifier"
MYSQL_PASSWORD="1850ABc"

# Define a function to check if the node is the primary
is_primary() {
    # validate if the node is active
    if [ -z `pidof mysqld` ]; then
        return 1  # Node is not active
    fi

    result=$(mysql -u$MYSQL_USER -p$MYSQL_PASSWORD -h $NODE_IP -P $NODE_PORT -e "SELECT MEMBER_HOST FROM performance_schema.replication_group_members WHERE MEMBER_ROLE = 'PRIMARY'" 2>/dev/null | grep 'SQL-')
    hostname=$(hostname)

    # validate if the node is the primary checking the hostname against the result
    if [ "$result" = "$hostname" ]; then
        return 0  # Node is the primary
    else
        return 1  # Node is not the primary
    fi
}

# Check if this node is the primary
if is_primary; then
    # This node is the primary, so Keepalived should notify that it's the master
    exit 0
else
    # This node is not the primary, so Keepalived should notify that it's a backup
    exit 1
fi
```

4. Le damos permisos de ejecución al script.

```bash
sudo chmod +x /bin/check_primary.sh
```

5. Enable `keepalived` service on all nodes.

```bash
sudo systemctl start keepalived
sudo systemctl enable keepalived
```

6. Check the ip address of all nodes and in one of them, you must see the `virtual ip address` of the cluster.

```bash
ip a
```

<!-- insert image -->

7. Create a database and a user for `wordpress`

These commands must be run on the primary node. Remember the credentials that you are going to use.

```sql
CREATE DATABASE wordpress;
CREATE USER 'wordpressuser'@'%' IDENTIFIED WITH mysql_native_password BY '1850ABc';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpress'@'%';
```

## Load Balancing Cluster

We must generate three virtual machines with the following configuration:
- Server Load Balancer
  - **IP**: x.x.x.162
  - **Hostname**: LOAD-BALANCER

- Server One
  - **IP**: x.x.x.160
  - **Hostname**: SERVER-ONE

- Server Two
  - **IP**: x.x.x.161
  - **Hostname**: SERVER-TWO

> If you want to change the IP address of a virtual machine, you can read the following [post](/blog/change-ip-vm/).

In this project I'm going to use Wordpress, so if you want to do the same configuration for any other application, you can do it.

### Wordpress

Run these commands on the `SERVER-ONE` and `SERVER-TWO` virtual machines

1. Install `nginx` on all nodes

```bash
dnf install -y nginx
```

2. Install PHP extensions

```bash
sudo dnf install php php-mysqlnd php-fpm php-gd php-xml php-mbstring php-json php-opcache php-zip php-curl -y
```

3. Install Wordpress on `/usr/share/nginx/html` and move the contents to the root directory

```bash
cd /usr/share/nginx/html
sudo wget https://wordpress.org/latest.tar.gz
sudo tar -xvzf latest.tar.gz
sudo mv wordpress/* /usr/share/nginx/html
```

4. Remove unnecessary files

```bash
sudo rm -rf wordpress latest.tar.gz
```

4. Copy the wp-config-sample.php file to wp-config.php

```bash
sudo cp /usr/share/nginx/html/wp-config-sample.php /usr/share/nginx/html/wp-config.php
```

5. Update the database name, username, and password in the wp-config.php file

You must replace the field with the following values:

```php
define( 'DB_NAME', 'wordpress' );
define( 'DB_USER', 'wordpressuser' );
define( 'DB_PASSWORD', '1850ABc' );
define( 'DB_HOST', 'x.x.x.167' ); // the ip address of the high availability cluster
```

6. Verify if the file is present, otherwise create and add the following config for the server to read PHP files

- `/etc/nginx/conf.d/php-fpm.conf`

```nginx
upstream php-fpm {
  server unix:/run/php-fpm/www.sock;
}
```

7. Update the firewall rules

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

8. Start and enable the httpd and php-fpm services

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start php-fpm
sudo systemctl enable php-fpm
```

9.  Set SELinux to permissive mode

```bash
sudo setenforce 0
```

### Load Balancer setup

1. Install `nginx`

```bash
dnf install -y nginx
```

2. Create a configuration file for the load balancer

```bash
sudo vim /etc/nginx/conf.d/wordpress.conf
```

```nginx
log_format upstreamlog '$host to: $upstream_addr [$request]'
    'upstream_response_time $upstream_response_time '
    'msec $msec request_time $request_time';

upstream backend {
    # ip_hash;
    server x.x.x.160;
    server x.x.x.161;
}

server {
    listen 80;

    access_log /var/log/nginx/access.log upstreamlog;

    location / {
        proxy_pass http://backend;
        sub_filter 'http://backend' 'http://$host';
        sub_filter_once off;
    }

    location ~ \.css {
        add_header  Content-Type    text/css;
        proxy_pass http://backend;
        sub_filter 'http://backend' 'http://$host';
        sub_filter_once off;
    }

    location ~ \.js {
        add_header  Content-Type    application/javascript;
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }
}
```

You can check if the configuration if right running the following command

```bash
nginx -t
```

3. Update the firewall rules

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

4. Start and enable the `nginx` service

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

5. Check the correct configuration of the load balancer seeing the ip address of the load balancer

See https://x.x.x.162/

## Conclusion

Building a high availability cluster is not an easy task, but it is not impossible. You must have a lot of patience and be willing to learn new things. I hope this project can help you to build your own high availability cluster.

Remember that high availability is not the same as load balancing. You can read more about this [here](https://www.digitalocean.com/community/tutorials/what-is-high-availability).

> If you liked this project, please **follow me** on [LinkedIn](https://www.linkedin.com/in/leninner), [Instagram](https://www.instagram.com/leninner/) and [GitHub](https://www.github.com/leninner) to stay tuned for more projects and **be sure** to check out my other [projects](/projects).

