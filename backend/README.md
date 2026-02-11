# Backend - Bytecode Trainings Microservices

This directory contains the Spring Boot microservices for the Bytecode Trainings application.

## Discovery & Routing
- **Discovery Service (Eureka)**: Port `8761`
- **API Gateway**: Port `8080` (Standard entry point)

## Core Business Services
| Service | Port | Database | Responsibilities |
| :--- | :--- | :--- | :--- |
| **User Service** | `8082` | Firebase | Auth, Profiles, Admin/Student Roles |
| **Course Service** | `8081` | MongoDB | LMS, Course Modules, Curriculum |
| **Academic Service** | `8088` | MongoDB | Attendance, Live Sessions, Notices |
| **Finance Service** | `8087` | MongoDB | Fees, Payments, Salaries |
| **Placement Service** | `8084` | MongoDB | MNC Records, Job Listings |

## Specialized Modules
| Service | Port | Database | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Exam Service** | `8086` | MongoDB | Online Test Conduction, Real-time Exams |
| **Assessment Service** | `8083` | MongoDB | Quizzes, Assignments, Results |
| **Chat Service** | `8085` | N/A | Real-time Communication (WebSocket) |

## Prerequisites
- Java 17, Maven 3.9+
- MongoDB (localhost:27017)
- Firebase Service Key (for User Service)

## Startup Order
1. Discovery Service
2. Business Services (User, Course, Academic, etc.)
3. API Gateway
