---
title: "Alta disponibilidad en máquinas virtuales"
description: "Revisamos cómo funciona la alta disponibilidad con la herramienta de Keepalived dentro de máquinas virtuales."
pubDate: "11/02/2023"
heroImage: "/blog-placeholder-2.jpg"
tags: ["cloud", "infrastructure", "linux", "keepalived"]
---
In a production environment, when your applications are receiving a lot requests to a single node and you see that node isn't able to handle all requests, you need to scale your application. 

One way to do this is `by adding more nodes to your application.` But, how can you distribute the requests between all nodes? You can use a load balancer to distribute the requests between all nodes, but what happens if the load balancer fails? You need to have a backup load balancer to avoid downtime. 
This is `where high availability comes in.`

In this post, we will see how to configure high availability using `Keepalived` on virtual machines to avoid downtime.

## What is Keepalived?

Is a tool that provides a `heartbeat` between two or more nodes. It's used to `monitor the health of your nodes` and `distribute the requests between all nodes.`

## The actual process

I am using 3 nodes running Alma Linux for this post, and each node has a NGINX server running on it. The idea is to have a `high availability NGINX cluster` that if one node fails, the other node will take the requests.

1. Install `keepalived` on all nodes.

```bash
sudo dnf install -y keepalived
```

2. Configure `keepalived` on all nodes.

```bash
sudo vim /etc/keepalived/keepalived.conf
```
<br/>

```c
global_defs {
  router_id nginx
}

vrrp_script check_nginx {
  script "/bin/check_nginx.sh"
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
    192.168.100.167/24
  }

  track_script {
    check_nginx
  }

  authentication {
    auth_type AH
    auth_pass secret
  }
} 
```

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
                    global_defs
                </th>
                <td class="px-6 py-4">
                    This section is used to define global variables. In this case, we are defining the router_id which is used to identify the cluster. This must be the same on all nodes.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    vrrp_script
                </th>
                <td class="px-6 py-4">
                    This section is used to define the script that will be used to check if the node is the primary. In this case, we are using the <strong>check_nginx.sh</strong> script that we are going to create later.
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    vrrp_instance
                </th>
                <td class="px-6 py-4">
                    This section is used to define the instance of the cluster. In this case, we are defining the following variables:
                    <ul class="list-disc list-inside">
                        <li><strong>state:</strong> This variable is used to define the state of the node. In this case, we are defining the state as <strong>BACKUP</strong> because we want to have a primary node and two backup nodes.</li>
                        <li><strong>interface:</strong> This variable is used to define the interface that will be used to communicate with the other nodes.</li>
                        <li><strong>virtual_router_id:</strong> This variable is used to define the id of the cluster. This must be the same on all nodes.</li>
                        <li><strong>priority:</strong> This variable is used to define the priority of the node. The node with the highest priority will be the primary node.</li>
                        <li><strong>virtual_ipaddress:</strong> This variable is used to define the <strong>virtual ip address</strong> of the cluster. This must be the same on all nodes.</li>
                        <li><strong>track_script:</strong> This variable is used to define the script that will be used to check if the node is the primary. In this case, we are using the <strong>check_mysql</strong> script that we defined in an above variable.</li>
                        <li><strong>authentication:</strong> This variable is used to define the authentication type and password. In this case, we are using the <strong>AH</strong> authentication type and the <strong>secret</strong> password.</li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

3. Create `check_nginx.sh` script.

```bash
sudo vim /bin/check_nginx.sh
```

```bash
#!/bin/sh

if [ -z `pidof nginx` ]; then
  exit 1
else
  exit 0
fi
```

4. Specify permissions to `check_nginx.sh` script.

```bash
sudo chmod +x /bin/check_nginx.sh
```

5. Enable `keepalived` service on all nodes.

```bash
sudo systemctl start keepalived
sudo systemctl enable keepalived
```

6. Check the ip address on all nodes and you will see that only one node has the ip address `192.168.100.167`.`
