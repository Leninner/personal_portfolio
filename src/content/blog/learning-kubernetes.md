---
title: "Kubernetes notes"
description: "K8S is a container orchestration open source platform that allows you to manage your containers in a cluster. Is developed by Google and is based on their internal platform Borg."
pubDate: "Nov 01 2023"
updateDate: "Nov 05 2023"
heroImage: "/blog-placeholder-3.jpg"
tags: ["cloud", "infrastructure", "kubernetes", "docker"]
---
- [What is Kubernetes?](#what-is-kubernetes)
- [Main components](#main-components)
- [Architecture](#architecture)

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