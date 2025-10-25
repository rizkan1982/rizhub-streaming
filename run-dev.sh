#!/bin/bash

echo "╔═══════════════════════════════════════════╗"
echo "║  🎬 LustPress Cinema - Development Mode  ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "Starting backend and frontend servers..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Start backend
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo ""
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait

