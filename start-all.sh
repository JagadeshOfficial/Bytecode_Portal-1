#!/bin/bash

# Configuration
ROOT_DIR=$(pwd)
BACKEND_DIR="$ROOT_DIR/backend"

# Function to start a service in a new Terminal window
start_service() {
    local SERVICE_PATH=$1
    local SERVICE_NAME=$2
    local FULL_PATH="$ROOT_DIR/$SERVICE_PATH"

    echo "Starting $SERVICE_NAME at $FULL_PATH..."
    
    if [ ! -d "$FULL_PATH" ]; then
        echo "Error: Path $FULL_PATH does not exist!"
        return
    fi

    # Use osascript to open a new Terminal window and run the command
    # This avoids using System Events keystrokes which requires extra permissions
    osascript <<EOF
tell application "Terminal"
    do script "cd '$FULL_PATH' && ./mvnw spring-boot:run"
end tell
EOF
}

# Function to start the frontend in a new Terminal window
start_frontend() {
    echo "Starting Frontend at $ROOT_DIR..."
    osascript <<EOF
tell application "Terminal"
    do script "cd '$ROOT_DIR' && npm run dev"
end tell
EOF
}

echo "Starting Platform Orchestration..."

# 1. Discovery Service
start_service "backend/discovery-service" "Discovery Service"
echo "Waiting 15s for Discovery Service to initialize..."
sleep 15

# 2. Key Data Services
start_service "backend/user-service" "User Service"
start_service "backend/course-service" "Course Service"
echo "Waiting 10s for Core Services..."
sleep 10

# 3. Functional Services
start_service "backend/academic-service" "Academic Service"
start_service "backend/finance-service" "Finance Service"
start_service "backend/placement-service" "Placement Service"
start_service "backend/exam-service" "Exam Service"
start_service "backend/assessment-service" "Assessment Service"
start_service "backend/chat-service" "Chat Service"
echo "Waiting 10s for Functional Services..."
sleep 10

# 4. API Gateway
start_service "backend/api-gateway" "API Gateway"
echo "Waiting 5s for API Gateway..."
sleep 5

# 5. Frontend
start_frontend

echo "--------------------------------------------------"
echo "All services launched in separate Terminal windows!"
echo "Discovery: http://localhost:8761"
echo "Gateway:   http://localhost:8080"
echo "Frontend:  http://localhost:3000"
echo "--------------------------------------------------"
