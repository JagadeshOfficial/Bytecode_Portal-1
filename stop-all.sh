#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$ROOT_DIR/.runpids"

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
  "frontend"
)

stop_process() {
  local name=$1
  local pid_file="$PID_DIR/$name.pid"
  local pid

  if [[ ! -f "$pid_file" ]]; then
    echo "Skipping $name: no PID file."
    return
  fi

  pid="$(cat "$pid_file")"
  if [[ -z "$pid" ]]; then
    echo "Skipping $name: empty PID file."
    rm -f "$pid_file"
    return
  fi

  if ! kill -0 "$pid" 2>/dev/null; then
    echo "Skipping $name: process $pid is not running."
    rm -f "$pid_file"
    return
  fi

  echo "Stopping $name (PID $pid)..."
  kill "$pid" 2>/dev/null || true

  for _ in {1..10}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      rm -f "$pid_file"
      echo "Stopped $name."
      return
    fi
    sleep 1
  done

  echo "Force stopping $name (PID $pid)..."
  kill -9 "$pid" 2>/dev/null || true
  rm -f "$pid_file"
}

main() {
  if [[ ! -d "$PID_DIR" ]]; then
    echo "No runtime PID directory found at $PID_DIR."
    exit 0
  fi

  for service in "${SERVICES[@]}"; do
    stop_process "$service"
  done

  if [[ -d "$PID_DIR" ]] && [[ -z "$(find "$PID_DIR" -type f -print -quit 2>/dev/null)" ]]; then
    rmdir "$PID_DIR" 2>/dev/null || true
  fi
}

main "$@"
