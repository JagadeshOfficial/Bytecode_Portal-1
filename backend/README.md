# Bytecode Trainings - Enterprise Microservices Ecosystem

This repository contains the complete backend for the Bytecode Trainings platform, built with **Spring Boot 3.x**, **Spring Cloud (Netflix Eureka)**, and **MongoDB**.

## 🏗️ Architecture Overview

The system is split into 10 services to ensure high availability and modularity:

| Service | Port | Database | Modules Covered |
| :--- | :--- | :--- | :--- |
| **Discovery Service** | `8761` | N/A | Central Service Registry (Eureka) |
| **API Gateway** | `8080` | N/A | Unified Entry Point & Routing |
| **User Service** | `8082` | `user-db` | Auth (Super Admin to Student), Profiles |
| **Course Service** | `8081` | `course-db` | Catalog, Tracks, Skill Seeding |
| **Exam Service** | `8086` | `exam-db` | **Online Test Conduction**, Automatic Scoring |
| **Academic Service** | `8088` | `academic-db` | Attendance, Notices, Live Class Schedules |
| **Finance Service** | `8087` | `finance-db` | Fee Records, Salary Processing |
| **Placement Service** | `8084` | `placement-db` | MNC Job Listings, Success Stories |
| **Assessment Service**| `8083` | `assessment-db`| Quizzes & Assignments |
| **Chat Service** | `8085` | N/A | **Real-time Student-Mentor Chat (WS)** |

---

## 🚀 Getting Started

### 1. Prerequisites
- Java 17+ & Maven 3.9+
- **MongoDB Community Server** (Running on `localhost:27017`)
- **MongoDB Compass** (To visualize data)

### 2. Database Setup
The services are pre-configured to automatically create and seed collections in your local MongoDB:
- The **User Service** seeds all 7 platform roles (Director, Faculty, etc.).
- The **Course Service** seeds the masterclass catalog.

### 3. Service Startup Order
To ensure the system works correctly, start the services in this exact order:
1.  **Discovery Service** (Wait for Dashboard at `http://localhost:8761`)
2.  **User Service** & **Course Service** (Core Data)
3.  **Academic, Finance, Placement, Exam Services**
4.  **API Gateway** (Routes everything together)

---

## 🔐 Auth Demo Credentials
All endpoints are available through the API Gateway at `http://localhost:8080/api/...`.

| User Level | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `director@bytecode.com` | `masterKey_2024` |
| **Faculty** | `java.trainer@bytecode.com` | `codeIsLife!` |
| **Student** | `student@learning.com` | `learnFast` |

---

## 🛠️ Key Endpoints
- **LMS Catalog**: `GET /api/courses`
- **Online Exams**: `GET /api/exams`
- **Notice Board**: `GET /api/academic/notices`
- **Live Classes**: `GET /api/academic/sessions`
