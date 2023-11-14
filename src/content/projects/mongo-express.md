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
  replicas: 1
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
  mongo-root-username: dXNlcm5hbWU= # base64 encoded `username`
  mongo-root-password: cGFzc3dvcmQ= # base64 encoded `password`
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

5. Creation of `mongo-express` deployment

```bash
vim mongo-express-deployment.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: mongo-express
  labels:
    app: mongo-express

spec:
  replica: 1
  selector:
    matchLabels:
      app: mongo-express
  template:
    metadata:
      labels:
        app: mongo-express
    spec:
      containers:
      - name: mongo-express
        image: mongo-express
        ports:
        - containerPort: 8081
        env:
        - name: ME_CONFIG_MONGODB_ADMINUSERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-username
        - name: ME_CONFIG_MONGODB_ADMINPASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-password
        - name: ME_CONFIG_MONGODB_SERVER
          valueFrom:
            configMapKeyRef:
              name: mongodb-configmap
              key: database_url
```

6. Create a `configmap` for mongo-express

```bash
vim mongodb-configmap.yaml
```

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: mongodb-configmap

data:
  database_url: mongodb-service
```

Run the following command to create the configmap

```bash
kubectl apply -f mongodb-configmap.yaml
kubectl apply -f mongo-express-deployment.yaml
```

7. Create an `external service` for mongo-express

Add the following lines at the end of the `mongo-express-deployment.yaml` file

```yaml
---
apiVersion: v1
kind: Service

metadata:
  name: mongo-express-service
spec:
  selector:
    app: mongo-express
  type: LoadBalancer # This line is useful to make the service externally accessible
  ports:
    - protocol: TCP
      port: 8081
      targetPort: 8081 
      nodePort: 30000 # Port for external access. Between 30000 and 32767
```

Run the following command to create the service

```bash
kubectl apply -f mongo-express-deployment.yaml
```

> To assign an external IP address to the service, you need to run the following command: `minikube service mongo-express-service`. This is because we are using `minikube` to create a local kubernetes cluster.

8. Check the status of the pods

```bash
kubectl get pods
```

9. Check the status of mongo-express accessing to the external IP address generated. You can see this IP with

```bash
minikube service mongo-express-service --url
```
