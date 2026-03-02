#!/bin/bash

# CyberPress Platform - Development Startup Script
# This script starts both frontend and backend in development mode

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored messages
print_header() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Function to cleanup processes on exit
cleanup() {
    echo ""
    print_info "Stopping all services..."

    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_success "Backend stopped"
    fi

    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Frontend stopped"
    fi

    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Print header
print_header "🚀 CyberPress Platform - Development Mode"

# Check if we're in the project root
if [ ! -f "package.json" ] && [ ! -f "backend/requirements.txt" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Start backend
print_info "Starting backend server..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_error "Virtual environment not found. Run setup.sh first"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Start backend in background
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > /tmp/cyberpress-backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    print_success "Backend started (PID: $BACKEND_PID)"
    print_info "Backend API: http://localhost:8000"
    print_info "API Docs: http://localhost:8000/api/docs"
else
    print_error "Backend failed to start. Check /tmp/cyberpress-backend.log"
    exit 1
fi

cd ..

# Start frontend
print_info "Starting frontend server..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_error "node_modules not found. Run setup.sh first"
    exit 1
fi

# Start frontend in background
npm run dev > /tmp/cyberpress-frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    print_success "Frontend started (PID: $FRONTEND_PID)"
    print_info "Frontend: http://localhost:3000"
else
    print_error "Frontend failed to start. Check /tmp/cyberpress-frontend.log"
    cleanup
    exit 1
fi

cd ..

echo ""
print_header "✅ All services running!"
echo ""
print_info "Press Ctrl+C to stop all services"
echo ""

# Show logs in real-time
print_info "Monitoring logs (Ctrl+C to stop)..."
echo ""

# Function to show logs
show_logs() {
    while true; do
        clear
        print_header "🚀 CyberPress Platform - Running"
        echo ""
        echo -e "${GREEN}Backend:${NC} http://localhost:8000 (PID: $BACKEND_PID)"
        echo -e "${GREEN}Frontend:${NC} http://localhost:3000 (PID: $FRONTEND_PID)"
        echo ""
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${CYAN}  Backend Log (last 10 lines)${NC}"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        tail -10 /tmp/cyberpress-backend.log 2>/dev/null || echo "No backend logs yet"
        echo ""
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${CYAN}  Frontend Log (last 10 lines)${NC}"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        tail -10 /tmp/cyberpress-frontend.log 2>/dev/null || echo "No frontend logs yet"
        sleep 5
    done
}

# Start showing logs
show_logs
