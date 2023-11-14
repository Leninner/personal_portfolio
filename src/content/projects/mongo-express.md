---
title: 'A mongo GUI client using docker and kubernetes'
type: 'Infrastructure'
description: 'Kubernetes allows you to deploy containerized applications at scale. In this project, I will be deploying a mongo GUI client using docker and kubernetes.'
releaseDate: 'Nov 13 2023'
image: "/blog-placeholder-4.jpg"
---
**Summary**

- [Introduction](#introduction)
- [Development](#development)

## Introduction

We asked to create a simple mongo-express GUI client using docker and kubernetes. The mongo-express GUI client will be deployed on a kubernetes cluster.

![mongo-express](/content/projects/mongo-express/desired.png)

## Development

I will be using `minikube` to create a local kubernetes cluster, so make sure you have it installed on your machine. If you don't have it installed, you can follow the instructions [here](https://minikube.sigs.k8s.io/docs/start/).

1. Create a `mongodb` deployment

```bash
vim mongodb-deployment.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: mongodb-deployment
  labels:
    app: mongodb

spec:
  replica: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-username 
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-password
```

Note that in orden to read the `env` variables, we need to create first the `secrete` for mongodb.

2. Creation of `secret` for mongodb

```bash
vim mongodb-secret.yaml
```

```yaml
apiVersion: v1
kind: Secret

metadata:
  name: mongodb-secret
type: Opaque
data:
  mongo-root-username: dXNlcm5hbWU=
  mongo-root-password: cGFzc3dvcmQ=
```

3. Run these commands in order to create the `deployment` and `secret` for mongodb

```bash
kubectl apply -f mongodb-secret.yaml
kubectl apply -f mongodb-deployment.yaml
```

4. Create an `internal service` for mongodb

We can write the configuration in the same file as deployment, because they are related.

```bash
vim mongodb-deployment.yaml
```
  
```yaml 
# add these lines at the end of the file
---
apiVersion: v1
kind: Service

metadata:
  name: mongodb-service

spec:
  selector:
    app: mongodb
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
```

Run the following command to create the service

```bash
kubectl apply -f mongodb-deployment.yaml
```
