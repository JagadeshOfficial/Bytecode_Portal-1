---
description: How to install and configure MongoDB and MongoDB Compass
---

# MongoDB Setup Workflow

This workflow will install local MongoDB Server and MongoDB Compass, and guide you through connecting to a remote (online) cluster.

## 1. Install MongoDB Server
// turbo
1. Run: `winget install MongoDB.Server --accept-package-agreements --accept-source-agreements`
2. Wait for the installation to complete. This installs the MongoDB Community Server as a Windows Service.

## 2. Install MongoDB Compass
// turbo
1. Run: `winget install MongoDB.Compass.Full --accept-package-agreements --accept-source-agreements`
2. Wait for the installation to complete.

## 3. Verify Local Connection
1. Open MongoDB Compass.
2. In the "New Connection" screen, the default connection string should be: `mongodb://localhost:27017`.
3. Click **Connect**. This verifies your local database is running.

## 4. Connect to MongoDB Atlas (Online)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create or select your Cluster.
3. Click **Connect** -> **Connect with MongoDB Compass**.
4. Copy the connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.exmple.mongodb.net/`).
5. Open MongoDB Compass, click **New Connection**, and paste the connection string.
6. Replace `<username>` and `<password>` with your Atlas credentials.
7. Click **Connect**.

## 5. View Both Simultaneously
In MongoDB Compass, you can save both connections (Local and Atlas) to your favorites to switch between them easily.
