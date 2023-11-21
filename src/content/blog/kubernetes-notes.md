---
title: "Kubernetes notes"
description: "K8S is a container orchestration open source platform that allows you to manage your containers in a cluster. Is developed by Google and is based on their internal platform Borg."
pubDate: "11/14/2023"
updateDate: "Nov 05 2023"
heroImage: "/blog-placeholder-3.jpg"
tags: ["cloud", "infrastructure", "kubernetes", "docker"]
---
- [What is Kubernetes?](#what-is-kubernetes)
- [Main components](#main-components)
- [Architecture](#architecture)
  - [Worker servers or Nodes](#worker-servers-or-nodes)
  - [Master Nodes](#master-nodes)
- [Minikube and Kubectl set-up](#minikube-and-kubectl-set-up)
  - [Main kubeclt commands](#main-kubeclt-commands)
- [YAML configuration files for Kubernetes](#yaml-configuration-files-for-kubernetes)
- [Demo](#demo)

## What is Kubernetes?

Kubernetes is a container orchestration `open source` platform that allows you to manage your containers in a cluster. Is developed by Google and is based on their internal platform `Borg`.
Helps you to manage your containerized applications in different deployment environments. 

The need for a container orchestration tool:

- Trend from monolithic to microservices
- Increased usage of containers

![App using docker](/content/blog/kubernetes/first.png)

Kubernetes offers:

- **High availability** or no downtime
- **Scalability** or high performance
- **Disaster recovery** or backup and restore
- **Load balancing** or distribute traffic

Important stuff:

- K8s doesn't manage data persistance, this work should be done by the administrator

## Main components

<div class="relative overflow-x-auto">
    <table class="w-full text-sm md:text-lg text-left rtl:text-right text-gray-500">
        <thead class="text-xs md:text-md text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Component
                </th>
                <th scope="col" class="px-6 py-3">
                    Definition
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    pod
                </th>
                <td class="px-6 py-4">
                  <ul>
                    <li>Smallest unit of K8s</li>
                    <li>Abstraction over container</li>
                    <li>Usually 1 application per Pod</li>
                    <li>Each Pod gets its own IP address. Each Pod can comunicate each other with the internal network that K8s has built-in</li>
                    <li>A Pod is ephemeral which means that the Pod can die very easily</li>
                    <li>When a Pod die, K8s creates a new Pod with a new IP address (to avoid this, we have a feature called service)</li>
                    <li>Is an abstraction of containers. Is a built-in feature that is in the top of containers</li>
                  </ul>
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    service
                </th>
                <td class="px-6 py-4">
                  <ul>
                    <li>Has permanent IP address</li>
                    <li>Lifecycle of Pod and Service is NOT connected</li>
                    <li>Is a load balancer</li>
                    <li>
                      We have two different types of services:
                      <ul>
                        <li>External Service: Opens the communication from external sources</li>
                        <li>Internal Service: You must specify when create it</li>
                      </ul>
                    </li>
                  </ul>
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    ingress
                </th>
                <td class="px-6 py-4">
                  <ul>
                    <li>Acts like a proxy that receive a request from the outside world and redirect it to the correct service</li>
                    <li>Route traffic into the cluster</li>
                  </ul>
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    ConfigMap
                </th>
                <td class="px-6 py-4">
                  <ul>
                    <li>Has the external configuration of your application</li>
                    <li>Don't put credentials inside this component</li>
                  </ul>
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Secret
                </th>
                <td class="px-6 py-4">
                  <ul>
                    <li>Actually is the same as ConfigMap, but the difference is that is used for to store secret data</li>
                    <li>Base64 encoded</li>
                    <li>The built-in security mechanism is not enabled by default</li>
                  </ul>
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Volumes
                </th>
                <td class="px-6 py-4">
                  <ul>
                    <li>Are used to persist data</li>
                    <li>Are attached to local machine or remote, outside the K8s cluster</li>
                    <li>The built-in security mechanism is not enabled by default</li>
                  </ul>
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Deployment blueprint
                </th>
                <td class="px-6 py-4">
                  <ul>
                    <li>Is an abstraction of pods. Is a built-in feature that is in the top of Pods</li>
                    <li>We have to use Deployments with stateLESS apps</li>
                    <li>Databases can't be replicated via Deployment because of the state(data). We can use StatefulSet instead</li>
                    <li>
                      Is a template that contains the configuration of the Pod
                      <ul>
                        <li>Number of replicas</li>
                        <li>Image</li>
                        <li>Ports</li>
                        <li>Environment variables</li>
                        <li>...</li>
                      </ul>
                    </li>
                  </ul>
                </td>
            </tr>
            <tr class="bg-white border-b">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    StatefulSet blueprint
                </th>
                <td class="px-6 py-4">
                  <ul>
                    <li>Is used for STATEFUL apps like databases</li>
                    <li>We can control the scale up and scale down of the replicas</li>
                    <li>It making sure that the database reads and writes asyncronize to avoid data inconsistency</li>
                    <li>Deployment stateFUL apps in K8s isn't easy. DB servers are often hosted outside of K8s cluster</li>
                  </ul>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<br />

- Main components

![K8s components](/content/blog/kubernetes/components.png)

- Deployments

![K8s components](/content/blog/kubernetes/deployments.png)

## Architecture

K8s operates in a master-slave architecture. The master node is the brain of the cluster and the slave nodes are the workers.

### Worker servers or Nodes

- Each node has multiple Pods on it
- 3 processes are running on each node:
  - **kubelet:** is the agent that runs on each node in the cluster. It makes sure that the containers are running in a Pod. Starts the pod with a container inside
  - **kube-proxy:** is a network proxy that runs on each node in your cluster, implementing part of the Kubernetes Service concept. Forwards traffic to the correct Pod
  - **container runtime:** is the software that is responsible for running containers. K8s supports several container runtimes: Docker, containerd, CRI-O, and any implementation of the Kubernetes CRI (Container Runtime Interface)
- Worker nodes do the actual work

### Master Nodes

- Are the responsible for the state management of the cluster and the worker nodes 
- Has 4 processes running on every master node
  - **Api Server**: It's used when a client wants to intereact with the cluster. It's the only component that interacts with the etcd database. Acts like a cluster gateway and also acts as a gatekeeper for authentication.
  - **Scheduler**: It's responsible for distributing the creation of Pods across the nodes. The metric to determine where to place the Pod is the current usage of each node.
  - **Controller manager**: It's responsible for the actual work. It's a daemon that runs in the background and is responsible for making sure that the actual state of the cluster matches the desired state. It's responsible for the replication of the Pods, the scaling of the Pods, the rolling updates, etc.
  - **etcd**: Is the cluster brain and is a key/value store. Every change in the cluster get stored in the key value store. The application data isn't stored in `etcd` 

![Master node](/content/blog/kubernetes/master-node.png)

![Example](/content/blog/kubernetes/sticky-example.png)

## Minikube and Kubectl set-up

Minikube is a tool that makes it easy to run **Kubernetes locally**. Minikube runs a single-node Kubernetes cluster inside a `VM` on your laptop for users looking **to try out** Kubernetes or **develop with it day-to-day**.
Runs Master Processes and Worker Processes on a single node.

![Minikube](/content/blog/kubernetes/minikube.png)

Kubectl is a `command line tool` that allows you to run commands against Kubernetes clusters. You can use kubectl to deploy applications, inspect and manage cluster resources, and view logs.

- To install kubectl, follow the instructions [here](https://kubernetes.io/docs/tasks/tools/)
- To install minikube, follow the instructions [here](https://minikube.sigs.k8s.io/docs/start/)

> Minikube needs `virtualization` enable and you can check it in linux with `egrep -o '(vmx|svm)' /proc/cpuinfo` and if you get an `vmx` or `svm` is enabled. On MacOs you can check it with `sysctl -a | grep machdep.cpu.features | grep VMX`

> Also you need to have a `hypervisor` installed. For example, you can install `virtualbox`.

I am going to create a cluster

1. Starts the cluster. This command will use the default driver (docker) and will create a container with the name `minikube`

```bash
minikube start
```

2. You can check the status of minikube running `minikube status`

![Minikube status](/content/blog/kubernetes/minikube-status.png)

3. Get the nodes inside the created cluster

```bash
kubectl get nodes
```
  - Kubectl CLI is used for configuring the Minikube cluster
  - Minikube CLI is used for starting and stopping the Minikube cluster

### Main kubeclt commands

- Get the nodes and see their status inside the cluster

```bash
kubectl get nodes
```

- Get the pods inside the cluster

```bash
kubectl get pods
```

- Get the services inside the cluster

```bash
kubectl get services
```

- Create a Pod using Deployments as the abstraction

```bash
kubectl create deployment <name> --image=<image-name>
```

  - Example with Nginx

```bash
kubectl create deployment nginx-depl --image=nginx
```

![Kubectl basics](/content/blog/kubernetes/kubectl-basics.png)

  - The name of a Pod is the name of the deployment followed by the replicaset hash and the Pod hash
    - **namedeployment-[replicaset hash]-[pod hash]**
    - Replicaset is managing the replicas of a Pod

![Layers](/content/blog/kubernetes/layers.png)

- Edit a deployment

```bash
kubectl edit deployment <name>
```

- Debugging a Pod

```bash
kubectl logs <pod-name> # to see logs
kubectl describe pod <pod-name> # to describe the pod
```

- Interacting with a Pod

```bash
kubectl exec -it <pod-name> -- bin/bash
```

- Delete deployments

```bash
kubectl delete deployment <deployment-name>
```

- Using a config file to create a deployment

```bash
kubectl apply -f <config-file>
```

  - Example with Nginx

```bash
kubectl apply -f nginx-deployment.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec: # specification of the deployment
  replicas: 3 # number of replicas
  selector: # select the pods that are going to be managed by this deployment
    matchLabels:
      app: nginx
  template: # template of the pods
    metadata:
      labels:
        app: nginx
    spec: # specification of the pod
      containers:
      - name: nginx
        image: nginx:1.16
        ports:
        - containerPort: 80
```

- Delete with a config file

```bash
kubectl delete -f <config-file>
```

## YAML configuration files for Kubernetes

Each configuration file consist of 3 parts:

- **metadata:** Specifies the name of the object and labels
  - **labels:** Any key value pair that can be used to identify the object
- **specification:** Specifies the desired state of the object. And its attributes are **specific** to the `kind` of object
  - **selectors:** `matchLabels` is used to select the Pods that are going to be managed by this deployment.
- **status:** Is Auto-generated and added by kubernetes. It makes sure that the **desired** and **actual** state of the object matches and continuously updates the status of the object. K8s knows the actual state by the `etcd` database which is the **brain** of the cluster

> `etcd` holds the current status of any K8s component

- In a `deployment kind`, inside `spec` we can see the `template` field that allows us to specify the configuration **of a Pod**
- To connect a service to a deployment we must specify inside the `selector` field the **key value** that was specified in the main `metadata/label` field of the deployment file

Example:

- `nginx-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: 
  name: nginx-deployment
  labels:
    app: nginx # the same as the selector of the service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx # the same as the label of the deployment
  template:
    metadata:
      labels:
        app: nginx # the same as the selector of the service
    spec:
      containers: 
      - name: nginx
        image: nginx:1.16
        ports:
        - containerPort: 8080 # the same as the targetPort of the service
```

- `nginx-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx # the same as the label of the deployment
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080 # the same as the containerPort of the deployment
```

## Demo

I would like to complete this diagram:

![Demo](/content/blog/kubernetes/demo.png)

You can find the project details [here](/projects/mongo-express)