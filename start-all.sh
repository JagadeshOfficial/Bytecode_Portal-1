#!/bin/bash
export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin


# Port mapping:
# 8080: LMS Node Backend
# 8085: Master Backend (V5.5)
# 5001: B-EMS Backend
# 3000: Main Frontend
# 3001: B-EMS Frontend

mkdir -p .runlogs .runpids
rm -rf .runlogs/* .runpids/*

echo "🚀 Starting Bytecode Trainings Platform..."

# 1. LMS Node Backend (8080)
echo "📡 Starting LMS Node Backend (8080)..."
(cd lms-node-backend && npm run dev > ../.runlogs/lms-node-backend.log 2>&1) &
echo $! > .runpids/lms-node-backend.pid

# 2. Master Backend (8085)
echo "📡 Starting Master Backend (8085)..."
(cd lms-node-backend && node server.js > ../.runlogs/master-backend.log 2>&1) &
echo $! > .runpids/master-backend.pid

# 3. B-EMS Backend (5001)
echo "📡 Starting B-EMS Backend (5001)..."
(cd b-ems/backend && npm run dev > ../../.runlogs/b-ems-backend.log 2>&1) &
echo $! > .runpids/b-ems-backend.pid

# 4. Main Frontend (3000)
echo "🌐 Starting Main Frontend (3000)..."
(cd frontend && npm run dev > ../.runlogs/frontend.log 2>&1) &
echo $! > .runpids/frontend.pid

# 5. B-EMS Frontend (3001)
echo "🌐 Starting B-EMS Frontend (3001)..."
(cd b-ems/frontend && PORT=3001 npm run dev > ../../.runlogs/b-ems-frontend.log 2>&1) &
echo $! > .runpids/b-ems-frontend.pid

echo "✅ All services initiated."
echo "📍 Main Frontend: http://localhost:3000"
echo "📍 B-EMS Frontend: http://localhost:3001"
echo "📍 LMS Backend: http://localhost:8080"
echo "📍 Master Backend: http://localhost:8085"
echo "📍 B-EMS Backend: http://localhost:5001"
echo "📄 Logs: .runlogs/"
