#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
LOG_DIR="$ROOT_DIR/.runlogs"
PID_DIR="$ROOT_DIR/.runpids"
REQUIRED_PORTS=(8761 8080 8081 8082 8083 8084 8085 8086 8087 8088)

SERVICES=(
  "discovery-service"
  "user-service"
  "course-service"
  "academic-service"
  "finance-service"
  "placement-service"
  "exam-service"
  "assessment-service"
  "chat-service"
  "api-gateway"
)

STARTED_PID_FILES=()

cleanup_started_processes() {
  local pid_file pid
  for pid_file in "${STARTED_PID_FILES[@]}"; do
    if [[ -f "$pid_file" ]]; then
      pid="$(cat "$pid_file")"
      if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null || true
      fi
      rm -f "$pid_file"
    fi
  done
}

on_error() {
  echo "Startup failed. Stopping any processes started by this run..."
  cleanup_started_processes
}

trap on_error ERR

require_command() {
  local command_name=$1
  local install_hint=$2
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: '$command_name' is required. $install_hint"
    exit 1
  fi
}

ensure_port_available() {
  local port=$1
  if command -v lsof >/dev/null 2>&1 && lsof -tiTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Error: port $port is already in use."
    exit 1
  fi
}

ensure_runtime_dirs() {
  mkdir -p "$LOG_DIR" "$PID_DIR"
}

clean_stale_pid_file() {
  local pid_file=$1
  local pid

  if [[ ! -f "$pid_file" ]]; then
    return
  fi

  pid="$(cat "$pid_file")"
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
    echo "Error: stack appears to be running already (active PID $pid from $(basename "$pid_file"))."
    echo "Run ./stop-all.sh before starting again."
    exit 1
  fi

  rm -f "$pid_file"
}

verify_prerequisites() {
  require_command "java" "Install Java 17+ and ensure it is on PATH."

  local service_dir
  for service in "${SERVICES[@]}"; do
    service_dir="$BACKEND_DIR/$service"
    if [[ ! -d "$service_dir" ]]; then
      echo "Error: missing service directory $service_dir."
      exit 1
    fi
    if [[ ! -x "$service_dir/mvnw" ]]; then
      chmod +x "$service_dir/mvnw"
    fi
  done

  local port
  for port in "${REQUIRED_PORTS[@]}"; do
    ensure_port_available "$port"
  done
}

check_existing_runtime_state() {
  local service
  for service in "${SERVICES[@]}"; do
    clean_stale_pid_file "$PID_DIR/$service.pid"
  done
}

start_background_process() {
  local name=$1
  local workdir=$2
  local command=$3
  local pid_file="$PID_DIR/$name.pid"
  local log_file="$LOG_DIR/$name.log"
  local pid
  local escaped_workdir

  echo "Starting $name..."
  printf -v escaped_workdir '%q' "$workdir"
  nohup bash -lc "cd $escaped_workdir && exec $command" >"$log_file" 2>&1 &

  pid=$!
  echo "$pid" > "$pid_file"
  STARTED_PID_FILES+=("$pid_file")

  if ! kill -0 "$pid" 2>/dev/null; then
    echo "Error: failed to start $name."
    exit 1
  fi

  echo "  PID $pid"
  echo "  Log $log_file"
}

wait_phase() {
  local seconds=$1
  local label=$2
  echo "Waiting ${seconds}s for $label..."
  sleep "$seconds"
}

print_summary() {
  cat <<EOF
--------------------------------------------------
Backend services launched in background processes.
Logs:      $LOG_DIR
PID files: $PID_DIR
Discovery: http://localhost:8761
Gateway:   http://localhost:8080
--------------------------------------------------
EOF
}

main() {
  echo "Starting Bytecode Trainings Backend..."
  ensure_runtime_dirs
  verify_prerequisites
  check_existing_runtime_state

  # Start services in order
  start_background_process "discovery-service" "$BACKEND_DIR/discovery-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  wait_phase 15 "Discovery Service"

  start_background_process "user-service" "$BACKEND_DIR/user-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  start_background_process "course-service" "$BACKEND_DIR/course-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  wait_phase 10 "Core Services"

  start_background_process "academic-service" "$BACKEND_DIR/academic-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  start_background_process "finance-service" "$BACKEND_DIR/finance-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  start_background_process "placement-service" "$BACKEND_DIR/placement-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  start_background_process "exam-service" "$BACKEND_DIR/exam-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  start_background_process "assessment-service" "$BACKEND_DIR/assessment-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  start_background_process "chat-service" "$BACKEND_DIR/chat-service" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  wait_phase 10 "Functional Services"

  start_background_process "api-gateway" "$BACKEND_DIR/api-gateway" "./mvnw spring-boot:run -Dspring-boot.run.jvmArguments=\"-Djava.net.preferIPv4Stack=true\""
  wait_phase 5 "API Gateway"

  trap - ERR
  print_summary
}

main "$@"
