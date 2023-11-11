---
title: "Alta disponibilidad en máquinas virtuales"
description: "Revisamos cómo funciona la alta disponibilidad con la herramienta de Keepalived dentro de máquinas virtuales."
pubDate: "Nov 02 2023"
heroImage: "/blog-placeholder-2.jpg"
---
## Virtual Machines (Alma Linux)

**Note:** I am using 3 nodes for this project.

1. Install `keepalived` on all nodes.

```bash
sudo dnf install -y keepalived
```

2. Configure `keepalived` on all nodes.

```bash
sudo vim /etc/keepalived/keepalived.conf
```
<br/>

```conf
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
    192.168.100.167/24
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
MYSQL_USER="user_name"
MYSQL_PASSWORD="user_password"

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