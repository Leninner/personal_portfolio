---
title: "Load Balancing with Nginx and AlmaLinux"
description: "Load balancing is a technique used to distribute workloads uniformly across servers or other compute resources to optimize network efficiency, reliability, and capacity. Load balancing is performed by an application delivery controller (ADC) or a network device such as a multilayer switch or a Domain Name System (DNS) server."
pubDate: "Nov 11 2023"
heroImage: "/blog-placeholder-3.jpg"
tags: ["cloud", "infrastructure", "linux", "nginx"]
---
## Configuring Nginx as a Load Balancer

Before to start we need to have 3 `servers` with **AlmaLinux 8 installed** and configured with the following IP addresses:

- **Server One**: x.x.x.160
- **Server Two**: x.x.x.161
- **Server Three**: x.x.x.162

On each server we need to install Nginx and configure the firewall to allow HTTP and HTTPS traffic:

```bash
dnf install nginx -y
firewall-cmd --add-service=http --permanent
firewall-cmd --add-service=https --permanent
firewall-cmd --reload
```

Now we need to configure another server with Nginx as a load balancer. To do this we need to edit a file `/etc/nginx/conf.d/filename.conf` and add the following lines:

```bash
log_format backendlog '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"';

upstream backend {
    server x.x.x.160
    server x.x.x.161
    server x.x.x.162
}

server {
    listen 80;

    access_log /var/log/nginx/loadbalancer.access.log backendlog;

    location / {
        proxy_pass http://backend;
    }
}
```

After that we need to restart the Nginx service:

```bash
systemctl restart nginx
```

If you want to persist sessions between requests, you can use the `ip_hash` directive in the upstream block:

```bash
upstream backend {
    ip_hash; # <--- Add this line
    server x.x.x.160
    server x.x.x.161
    server x.x.x.162
}
```

If you want to send request to the server that has the least number of active connections, you can use the `least_conn` directive in the upstream block:

```bash
upstream backend {
    least_conn; # <--- Add this line
    server x.x.x.160
    server x.x.x.161
    server x.x.x.162
}
```

> **Note:** Sometimes you might notice that a 502 bad gateway error appears when you try to access to the load balancer server. To avoid this problem, just disable SELinux on the load balancer server.
>
> ```bash
> setenforce 0
> ```