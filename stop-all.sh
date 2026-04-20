#!/bin/bash

echo "🛑 Stopping Bytecode Trainings Platform..."

if [ -d ".runpids" ]; then
    for pidfile in .runpids/*.pid; do
        if [ -f "$pidfile" ]; then
            pid=$(cat "$pidfile")
            echo "Killing process $pid from $pidfile..."
            kill $pid 2>/dev/null
            rm "$pidfile"
        fi
    done
fi

# Cleanup any remaining processes on known ports
echo "🧹 Cleaning up ports..."
for port in 3000 3001 8080 8085 5001; do
    lsof -t -i:$port | xargs kill -9 2>/dev/null
done

echo "✅ All services stopped."
