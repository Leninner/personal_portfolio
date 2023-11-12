---
title: 'Distributed System using Wordpress and MySQL'
type: 'Landing Page'
description: 'This project is a distributed system using Wordpress and MySQL. It is deployed using Docker and Virtual Machine.'
---
- [Wordpress - NGINX - PHP](#wordpress---nginx---php)
  - [Docker](#docker)
    - [Requirements](#requirements)
    - [Usage](#usage)
  - [Virtual Machine (Alma Linux)](#virtual-machine-alma-linux)
    - [Requirements](#requirements-1)

# Wordpress - NGINX - PHP

In this project, you can find the information related to the configuration of a web server with Nginx and PhP for Wordpress.

## Docker

###  Requirements

- Docker Compose
- Linux or MacOs

### Usage

Before running the project, you need to create a `.env` file with the following variables:

```bash
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=your_database
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
```

1. Run the `init.sh` with bash

```bash
sh init.sh
```

2. Run the `docker-compose.yml` file

```bash
docker compose up --env-file .env -d
```

3. See the result in `http://localhost:3000`

## Virtual Machine (Alma Linux)

### Requirements

- A virtual machine with Alma Linux installed, and wget, vim, unzip and tar installed.

1. Install nginx

    ```bash
    sudo dnf install nginx -y
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

    ```bash
    sudo vim /usr/share/nginx/html/wp-config.php
    ```

6. Verify if the file is present, otherwise create and add the following config for the server to read PHP files

```bash
cat /etc/nginx/conf.d/php-fpm.conf
```

  - If the file is not present, create it

    ```bash
    sudo vim /etc/nginx/conf.d/php-fpm.conf
    ```

  - Add the following content
  
    ```conf
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

10. Open the browser and navigate to `http://<IP_ADDRESS>`