---
title: "How to Change the IP Address of a Virtual Machine in AlmaLinux"
description: "Sometimes you may need to change the IP address of a virtual machine in AlmaLinux. This can be done by editing the network configuration file and restarting the network service."
pubDate: "Nov 05 2023"
heroImage: "/blog-placeholder-3.jpg"
tags: ["cloud", "infrastructure", "linux"]
---

1. Edit the ip of a connection

```bash
nmcli con modify <connection_name> ipv4.addresses <ip_address>
```

2. Edit the gateway of a connection

```bash
nmcli con modify <connection_name> ipv4.gateway <gateway_address>
```

3. Edit the DNS of the connection

```bash
nmcli con modify <connection_name> ipv4.dns <dns_address>
```

4. Edit the DNS ip asignation method to manual

```bash
nmcli con modify <connection_name> ipv4.method manual
```

5. Reboot the connection

```bash
nmcli con down <connection_name> && nmcli con up <connection_name>
```

6. Reboot the system

```bash
systemctl reboot
```
