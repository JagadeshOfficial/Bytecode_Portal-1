$root = $PSScriptRoot

Function Start-Service {
    param($path, $name)
    $fullPath = Join-Path $root $path
    Write-Host "Starting $name at $fullPath..."
    if (!(Test-Path $fullPath)) {
        Write-Host "Error: Path $fullPath does not exist!" -ForegroundColor Red
        return
    }
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; mvn spring-boot:run"
}

Write-Host "Starting Backend Microservices..."

# 1. Discovery Service
Start-Service "backend/discovery-service" "Discovery Service"
Write-Host "Waiting 15s for Discovery Service to initialize..."
Start-Sleep -Seconds 15

# 2. Key Data Services
Start-Service "backend/user-service" "User Service"
Start-Service "backend/course-service" "Course Service"
Write-Host "Waiting 10s for Core Services..."
Start-Sleep -Seconds 10

# 3. Functional Services
Start-Service "backend/academic-service" "Academic Service"
Start-Service "backend/finance-service" "Finance Service"
Start-Service "backend/placement-service" "Placement Service"
Start-Service "backend/exam-service" "Exam Service"
Start-Service "backend/assessment-service" "Assessment Service"
Start-Service "backend/chat-service" "Chat Service"

Write-Host "Waiting 10s for Functional Services..."
Start-Sleep -Seconds 10

# 4. API Gateway
Start-Service "backend/api-gateway" "API Gateway"

Write-Host "All backend services launched! Please ensure your frontend is running (npm run dev)."
